import { createServerClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { MonthlyChart } from '@/components/dashboard/monthly-chart';
import { UpcomingPayments } from '@/components/dashboard/upcoming-payments';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { NeedsReviewBanner } from '@/components/dashboard/needs-review-banner';

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch current month summary
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const [incomeRes, expenseRes, needsReviewRes, insightsRes, recurringRes] = await Promise.all([
    supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user!.id)
      .eq('type', 'income')
      .gte('date', monthStart)
      .lte('date', monthEnd),
    supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user!.id)
      .eq('type', 'expense')
      .gte('date', monthStart)
      .lte('date', monthEnd),
    supabase
      .from('transactions')
      .select('id', { count: 'exact' })
      .eq('user_id', user!.id)
      .eq('needs_review', true),
    supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user!.id)
      .eq('is_dismissed', false)
      .order('priority', { ascending: false })
      .limit(3),
    supabase
      .from('recurring_payments')
      .select('*')
      .eq('user_id', user!.id)
      .eq('is_active', true)
      .gte('next_date', now.toISOString())
      .order('next_date')
      .limit(5),
  ]);

  const totalIncome = incomeRes.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  const totalExpenses = expenseRes.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  const netBalance = totalIncome - totalExpenses;
  const needsReviewCount = needsReviewRes.count || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">סקירה כללית</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {now.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Needs Review Banner */}
      {needsReviewCount > 0 && (
        <NeedsReviewBanner count={needsReviewCount} />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="הכנסות החודש"
          value={totalIncome}
          type="income"
          icon="trending-up"
          currency="ILS"
        />
        <StatCard
          title="הוצאות החודש"
          value={totalExpenses}
          type="expense"
          icon="trending-down"
          currency="ILS"
        />
        <StatCard
          title="יתרה נטו"
          value={netBalance}
          type={netBalance >= 0 ? 'income' : 'expense'}
          icon="wallet"
          currency="ILS"
        />
        <StatCard
          title="לסיווג"
          value={needsReviewCount}
          type="neutral"
          icon="tag"
          suffix="עסקאות"
          href="/transactions?filter=needs-review"
        />
      </div>

      {/* Charts & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyChart userId={user!.id} />
        </div>
        <div>
          <AIInsights insights={insightsRes.data || []} />
        </div>
      </div>

      {/* Transactions & Upcoming Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions userId={user!.id} />
        <UpcomingPayments payments={recurringRes.data || []} />
      </div>
    </div>
  );
}
