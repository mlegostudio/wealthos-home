-- ============================================================
-- WealthOS Home - Initial Database Schema v001
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  currency TEXT DEFAULT 'ILS',
  locale TEXT DEFAULT 'he-IL',
  timezone TEXT DEFAULT 'Asia/Jerusalem',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BUSINESSES
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  business_type TEXT,
  registration_number TEXT,
  tax_id TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACCOUNTS
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('bank','credit_card','cash','savings','investment')),
  institution_name TEXT,
  account_number_last4 TEXT,
  currency TEXT DEFAULT 'ILS',
  current_balance DECIMAL(15,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'bank',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_he TEXT,
  icon TEXT DEFAULT 'tag',
  color TEXT DEFAULT '#6366f1',
  category_type TEXT NOT NULL CHECK (category_type IN ('income','expense','transfer')),
  parent_id UUID REFERENCES categories(id),
  is_system BOOLEAN DEFAULT FALSE,
  is_business BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUTO-CLASSIFICATION RULES (Learning Engine)
CREATE TABLE auto_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  match_type TEXT NOT NULL CHECK (match_type IN ('exact','contains','starts_with','regex')),
  match_value TEXT NOT NULL,
  match_field TEXT DEFAULT 'description',
  confidence DECIMAL(3,2) DEFAULT 1.0,
  times_applied INTEGER DEFAULT 0,
  last_applied_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STATEMENT IMPORTS
CREATE TABLE statement_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf','csv','xlsx','ofx')),
  file_size INTEGER,
  storage_path TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  total_transactions INTEGER DEFAULT 0,
  auto_categorized INTEGER DEFAULT 0,
  needs_review INTEGER DEFAULT 0,
  period_start DATE,
  period_end DATE,
  ai_model TEXT,
  parsing_notes TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  import_id UUID REFERENCES statement_imports(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'ILS',
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income','expense','transfer')),
  description TEXT,
  merchant TEXT,
  reference_number TEXT,
  transaction_date DATE NOT NULL,
  value_date DATE,
  raw_data JSONB,
  is_reviewed BOOLEAN DEFAULT FALSE,
  needs_review BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  is_business_expense BOOLEAN DEFAULT FALSE,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTIES
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  property_type TEXT CHECK (property_type IN ('apartment','house','commercial','land','parking','storage')),
  purchase_price DECIMAL(15,2),
  purchase_date DATE,
  current_value DECIMAL(15,2),
  last_valuation_date DATE,
  ownership_percentage DECIMAL(5,2) DEFAULT 100.00,
  is_primary_residence BOOLEAN DEFAULT FALSE,
  is_rental BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MORTGAGES
CREATE TABLE mortgages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  lender_name TEXT NOT NULL,
  original_amount DECIMAL(15,2) NOT NULL,
  current_balance DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,3) NOT NULL,
  interest_type TEXT CHECK (interest_type IN ('fixed','variable','prime_plus')),
  term_months INTEGER,
  monthly_payment DECIMAL(15,2),
  start_date DATE NOT NULL,
  end_date DATE,
  account_id UUID REFERENCES accounts(id),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LOANS
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id),
  name TEXT NOT NULL,
  lender_name TEXT NOT NULL,
  loan_type TEXT CHECK (loan_type IN ('personal','business','auto','student','other')),
  original_amount DECIMAL(15,2) NOT NULL,
  current_balance DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,3),
  monthly_payment DECIMAL(15,2),
  start_date DATE NOT NULL,
  end_date DATE,
  account_id UUID REFERENCES accounts(id),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RENTAL INCOME
CREATE TABLE rental_income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_name TEXT,
  monthly_rent DECIMAL(15,2) NOT NULL,
  lease_start DATE,
  lease_end DATE,
  account_id UUID REFERENCES accounts(id),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RECURRING TRANSACTIONS
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(15,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income','expense')),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily','weekly','biweekly','monthly','quarterly','yearly')),
  next_date DATE,
  last_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  auto_detected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MONTHLY SUMMARIES
CREATE TABLE monthly_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  total_income DECIMAL(15,2) DEFAULT 0,
  business_income DECIMAL(15,2) DEFAULT 0,
  rental_income DECIMAL(15,2) DEFAULT 0,
  other_income DECIMAL(15,2) DEFAULT 0,
  total_expenses DECIMAL(15,2) DEFAULT 0,
  home_expenses DECIMAL(15,2) DEFAULT 0,
  business_expenses DECIMAL(15,2) DEFAULT 0,
  net_savings DECIMAL(15,2) DEFAULT 0,
  savings_rate DECIMAL(5,2) DEFAULT 0,
  mortgage_payments DECIMAL(15,2) DEFAULT 0,
  loan_payments DECIMAL(15,2) DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  unreviewed_count INTEGER DEFAULT 0,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, year, month)
);

-- AI INSIGHTS
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('saving_opportunity','anomaly','forecast','recommendation','summary')),
  title TEXT NOT NULL,
  title_he TEXT,
  body TEXT NOT NULL,
  body_he TEXT,
  related_category_id UUID REFERENCES categories(id),
  amount DECIMAL(15,2),
  period_start DATE,
  period_end DATE,
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 5,
  ai_model TEXT,
  confidence DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_transactions_profile_date ON transactions(profile_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_needs_review ON transactions(profile_id, needs_review) WHERE needs_review = TRUE;
CREATE INDEX idx_auto_rules_profile ON auto_rules(profile_id, is_active);
CREATE INDEX idx_monthly_summaries_lookup ON monthly_summaries(profile_id, year, month);
CREATE INDEX idx_ai_insights_unread ON ai_insights(profile_id, is_read, is_dismissed);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE statement_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgages ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_businesses" ON businesses FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_accounts" ON accounts FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "view_categories" ON categories FOR SELECT USING (profile_id IS NULL OR auth.uid() = profile_id);
CREATE POLICY "own_categories" ON categories FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "own_rules" ON auto_rules FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_transactions" ON transactions FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_imports" ON statement_imports FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_properties" ON properties FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_mortgages" ON mortgages FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_loans" ON loans FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_rentals" ON rental_income FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_recurring" ON recurring_transactions FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_summaries" ON monthly_summaries FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "own_insights" ON ai_insights FOR ALL USING (auth.uid() = profile_id);

-- AUTO-UPDATE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_upd BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_businesses_upd BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_accounts_upd BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_transactions_upd BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_mortgages_upd BEFORE UPDATE ON mortgages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_loans_upd BEFORE UPDATE ON loans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- DEFAULT SYSTEM CATEGORIES
INSERT INTO categories (id, profile_id, name, name_he, icon, color, category_type, is_system) VALUES
-- Income categories
(uuid_generate_v4(), NULL, 'Salary', 'משכורת', 'briefcase', '#10b981', 'income', TRUE),
(uuid_generate_v4(), NULL, 'Business Revenue', 'הכנסות עסק', 'building', '#059669', 'income', TRUE),
(uuid_generate_v4(), NULL, 'Rental Income', 'הכנסות שכירות', 'home', '#0d9488', 'income', TRUE),
(uuid_generate_v4(), NULL, 'Dividends', 'דיבידנדים', 'trending-up', '#0891b2', 'income', TRUE),
(uuid_generate_v4(), NULL, 'Other Income', 'הכנסות אחרות', 'plus-circle', '#6366f1', 'income', TRUE),
-- Expense categories
(uuid_generate_v4(), NULL, 'Housing', 'דיור', 'home', '#ef4444', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Food & Dining', 'מזון ומסעדות', 'utensils', '#f97316', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Transportation', 'תחבורה', 'car', '#eab308', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Utilities', 'חשבונות', 'zap', '#84cc16', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Healthcare', 'בריאות', 'heart', '#ec4899', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Education', 'חינוך', 'book', '#8b5cf6', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Entertainment', 'בידור', 'tv', '#f59e0b', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Shopping', 'קניות', 'shopping-bag', '#14b8a6', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Insurance', 'ביטוח', 'shield', '#64748b', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Mortgage Payment', 'משכנתה', 'landmark', '#dc2626', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Loan Payment', 'החזר הלוואה', 'credit-card', '#b91c1c', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Business Expense', 'הוצאות עסק', 'briefcase', '#7c3aed', 'expense', TRUE),
(uuid_generate_v4(), NULL, 'Savings Transfer', 'העברה לחסכון', 'piggy-bank', '#2563eb', 'transfer', TRUE),
(uuid_generate_v4(), NULL, 'Uncategorized', 'לא מסווג', 'help-circle', '#94a3b8', 'expense', TRUE);
