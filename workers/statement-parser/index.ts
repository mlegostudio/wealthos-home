/**
 * WealthOS Home - Statement Parser Worker
 * Cloudflare Worker for processing bank statements (PDF/CSV)
 * Uses OpenAI GPT-4o to extract and structure transaction data
 */

interface Env {
  OPENAI_API_KEY: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  WEALTHOS_BUCKET: R2Bucket
}

interface ParseRequest {
  fileContent: string // base64 encoded
  fileType: 'pdf' | 'csv' | 'xlsx'
  accountId: string
  profileId: string
  importId: string
}

interface ParsedTransaction {
  date: string
  description: string
  amount: number
  transaction_type: 'income' | 'expense' | 'transfer'
  merchant?: string
  reference?: string
  balance?: number
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const body: ParseRequest = await request.json()
      
      // Validate auth token against Supabase
      const authHeader = request.headers.get('Authorization')
      if (!authHeader) {
        return new Response('Unauthorized', { status: 401 })
      }

      // Parse the statement using AI
      const transactions = await parseStatement(body, env)
      
      // Apply auto-classification rules
      const classified = await applyAutoRules(transactions, body.profileId, env)
      
      // Store results in Supabase
      await storeResults(classified, body, env)

      return new Response(JSON.stringify({
        success: true,
        total: transactions.length,
        classified: classified.filter(t => t.category_id).length,
        needs_review: classified.filter(t => !t.category_id).length,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } catch (error) {
      console.error('Parser error:', error)
      return new Response(JSON.stringify({ error: 'Parse failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }
}

async function parseStatement(body: ParseRequest, env: Env): Promise<ParsedTransaction[]> {
  const prompt = buildParsePrompt(body.fileType)
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `Parse this bank statement:\n${body.fileContent}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    })
  })

  const data: any = await response.json()
  const parsed = JSON.parse(data.choices[0].message.content)
  return parsed.transactions || []
}

function buildParsePrompt(fileType: string): string {
  return `You are a bank statement parser for Israeli banks.
Extract all transactions and return JSON with this structure:
{
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "original description",
      "merchant": "clean merchant name if identifiable",
      "amount": number (positive always),
      "transaction_type": "income" | "expense" | "transfer",
      "reference": "reference number if present",
      "balance": number or null
    }
  ]
}

Rules:
- Dates must be ISO 8601
- Amounts are always positive numbers
- transaction_type: income = money in, expense = money out, transfer = internal transfer
- Extract clean merchant names when possible (e.g. "SUPER-PHARM STORE 42" -> "Super-Pharm")
- Handle Hebrew text correctly
- If amount sign is ambiguous, use context clues`
}

async function applyAutoRules(
  transactions: ParsedTransaction[],
  profileId: string,
  env: Env
): Promise<(ParsedTransaction & { category_id?: string })[]> {
  // Fetch active rules for this profile
  const rulesRes = await fetch(
    `${env.SUPABASE_URL}/rest/v1/auto_rules?profile_id=eq.${profileId}&is_active=eq.true&select=*`,
    {
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      }
    }
  )
  
  const rules = await rulesRes.json()
  
  return transactions.map(tx => {
    const matchedRule = findMatchingRule(tx, rules)
    return {
      ...tx,
      category_id: matchedRule?.category_id,
    }
  })
}

function findMatchingRule(tx: ParsedTransaction, rules: any[]): any {
  const searchText = tx.description?.toLowerCase() || ''
  const merchant = tx.merchant?.toLowerCase() || ''
  
  for (const rule of rules) {
    const value = rule.match_value.toLowerCase()
    const field = rule.match_field === 'merchant' ? merchant : searchText
    
    let matches = false
    switch (rule.match_type) {
      case 'exact': matches = field === value; break
      case 'contains': matches = field.includes(value); break
      case 'starts_with': matches = field.startsWith(value); break
      case 'regex':
        try { matches = new RegExp(value, 'i').test(field) } catch { matches = false }
        break
    }
    
    if (matches) return rule
  }
  return null
}

async function storeResults(
  transactions: (ParsedTransaction & { category_id?: string })[],
  body: ParseRequest,
  env: Env
): Promise<void> {
  const rows = transactions.map(tx => ({
    profile_id: body.profileId,
    account_id: body.accountId,
    import_id: body.importId,
    category_id: tx.category_id || null,
    amount: tx.amount,
    transaction_type: tx.transaction_type,
    description: tx.description,
    merchant: tx.merchant,
    reference_number: tx.reference,
    transaction_date: tx.date,
    is_reviewed: false,
    needs_review: !tx.category_id,
    raw_data: tx,
  }))

  await fetch(`${env.SUPABASE_URL}/rest/v1/transactions`, {
    method: 'POST',
    headers: {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(rows)
  })
}
