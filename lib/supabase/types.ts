// ============================================================
// WealthOS Home - Supabase Database Types
// Auto-generated + manually enhanced TypeScript types
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type AccountType = 'bank' | 'credit_card' | 'cash' | 'savings' | 'investment'
export type TransactionType = 'income' | 'expense' | 'transfer'
export type CategoryType = 'income' | 'expense' | 'transfer'
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type FileType = 'pdf' | 'csv' | 'xlsx' | 'ofx'
export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land' | 'parking' | 'storage'
export type LoanType = 'personal' | 'business' | 'auto' | 'student' | 'other'
export type InterestType = 'fixed' | 'variable' | 'prime_plus'
export type InsightType = 'saving_opportunity' | 'anomaly' | 'forecast' | 'recommendation' | 'summary'
export type MatchType = 'exact' | 'contains' | 'starts_with' | 'regex'
export type Frequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  currency: string
  locale: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  profile_id: string
  name: string
  business_type: string | null
  registration_number: string | null
  tax_id: string | null
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  profile_id: string
  business_id: string | null
  name: string
  account_type: AccountType
  institution_name: string | null
  account_number_last4: string | null
  currency: string
  current_balance: number
  is_active: boolean
  color: string
  icon: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  profile_id: string | null
  name: string
  name_he: string | null
  icon: string
  color: string
  category_type: CategoryType
  parent_id: string | null
  is_system: boolean
  is_business: boolean
  sort_order: number
  created_at: string
}

export interface AutoRule {
  id: string
  profile_id: string
  category_id: string
  match_type: MatchType
  match_value: string
  match_field: string
  confidence: number
  times_applied: number
  last_applied_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  profile_id: string
  account_id: string
  category_id: string | null
  business_id: string | null
  import_id: string | null
  amount: number
  currency: string
  transaction_type: TransactionType
  description: string | null
  merchant: string | null
  reference_number: string | null
  transaction_date: string
  value_date: string | null
  raw_data: Json | null
  is_reviewed: boolean
  needs_review: boolean
  is_recurring: boolean
  is_business_expense: boolean
  notes: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
  // Joined fields
  category?: Category
  account?: Account
  business?: Business
}

export interface StatementImport {
  id: string
  profile_id: string
  account_id: string
  filename: string
  file_type: FileType
  file_size: number | null
  storage_path: string | null
  status: ImportStatus
  total_transactions: number
  auto_categorized: number
  needs_review: number
  period_start: string | null
  period_end: string | null
  ai_model: string | null
  parsing_notes: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  profile_id: string
  name: string
  address: string | null
  city: string | null
  property_type: PropertyType | null
  purchase_price: number | null
  purchase_date: string | null
  current_value: number | null
  last_valuation_date: string | null
  ownership_percentage: number
  is_primary_residence: boolean
  is_rental: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Mortgage {
  id: string
  profile_id: string
  property_id: string | null
  lender_name: string
  original_amount: number
  current_balance: number
  interest_rate: number
  interest_type: InterestType | null
  term_months: number | null
  monthly_payment: number | null
  start_date: string
  end_date: string | null
  account_id: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Loan {
  id: string
  profile_id: string
  business_id: string | null
  name: string
  lender_name: string
  loan_type: LoanType | null
  original_amount: number
  current_balance: number
  interest_rate: number | null
  monthly_payment: number | null
  start_date: string
  end_date: string | null
  account_id: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RentalIncome {
  id: string
  profile_id: string
  property_id: string
  tenant_name: string | null
  monthly_rent: number
  lease_start: string | null
  lease_end: string | null
  account_id: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RecurringTransaction {
  id: string
  profile_id: string
  account_id: string | null
  category_id: string | null
  name: string
  description: string | null
  amount: number
  transaction_type: TransactionType
  frequency: Frequency
  next_date: string | null
  last_date: string | null
  is_active: boolean
  auto_detected: boolean
  created_at: string
  updated_at: string
}

export interface MonthlySummary {
  id: string
  profile_id: string
  year: number
  month: number
  total_income: number
  business_income: number
  rental_income: number
  other_income: number
  total_expenses: number
  home_expenses: number
  business_expenses: number
  net_savings: number
  savings_rate: number
  mortgage_payments: number
  loan_payments: number
  transaction_count: number
  unreviewed_count: number
  computed_at: string
}

export interface AiInsight {
  id: string
  profile_id: string
  insight_type: InsightType
  title: string
  title_he: string | null
  body: string
  body_he: string | null
  related_category_id: string | null
  amount: number | null
  period_start: string | null
  period_end: string | null
  is_read: boolean
  is_dismissed: boolean
  priority: number
  ai_model: string | null
  confidence: number | null
  created_at: string
}

// Dashboard aggregated types
export interface DashboardSummary {
  currentMonth: MonthlySummary | null
  previousMonth: MonthlySummary | null
  topExpenseCategories: Array<{
    category: Category
    total: number
    percentage: number
  }>
  unreviewedCount: number
  recentInsights: AiInsight[]
  totalAssets: number
  totalLiabilities: number
  netWorth: number
}

// Statement parsing result
export interface ParsedTransaction {
  date: string
  description: string
  amount: number
  transaction_type: TransactionType
  merchant?: string
  reference?: string
  raw_line?: string
}
