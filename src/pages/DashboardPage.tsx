// ============================================
// Novarion Finans — Dashboard Page
// ============================================

import { useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Building2,
  FileWarning,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '@/utils/helpers';
import Topbar from '@/components/layout/Topbar';

export default function DashboardPage() {
  const { 
    accounts, transactions, payments, categories,
    theme, isDemoMode 
  } = useStore();

  // Dashboard Stats Calculation
  const totalBalance = useMemo(() => accounts.reduce((acc, account) => acc + account.balance, 0), [accounts]);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = useMemo(() => 
    transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.status === 'completed';
    }), 
  [transactions, currentMonth, currentYear]);

  const monthlyIncome = useMemo(() => 
    monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
  [monthlyTransactions]);

  const monthlyExpense = useMemo(() => 
    monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
  [monthlyTransactions]);

  const netProfit = monthlyIncome - monthlyExpense;

  const totalReceivables = useMemo(() => 
    payments.filter(p => p.direction === 'receivable' && p.status !== 'paid' && p.status !== 'cancelled').reduce((acc, p) => acc + (p.amount - p.paid_amount), 0),
  [payments]);

  const totalPayables = useMemo(() => 
    payments.filter(p => p.direction === 'payable' && p.status !== 'paid' && p.status !== 'cancelled').reduce((acc, p) => acc + (p.amount - p.paid_amount), 0),
  [payments]);

  // Chart Data Preparation (Demo data or calculated)
  const chartColors = {
    income: 'var(--color-success)',
    expense: 'var(--color-error)',
    grid: theme === 'dark' ? '#2D3142' : '#E2E5EF',
    text: theme === 'dark' ? '#A0A6B8' : '#5A6178',
    tooltipBg: theme === 'dark' ? '#1A1D26' : '#FFFFFF',
    tooltipBorder: theme === 'dark' ? '#2D3142' : '#E2E5EF'
  };

  // Prepare Expense by Category for Pie Chart
  const categoryExpenses = useMemo(() => {
    const expenses = monthlyTransactions.filter(t => t.type === 'expense' && t.category_id);
    const byCategory: Record<string, number> = {};
    
    expenses.forEach(t => {
      if (t.category_id) {
        const catName = categories.find(c => c.id === t.category_id)?.name || 'Diğer';
        byCategory[catName] = (byCategory[catName] || 0) + t.amount;
      }
    });

    // Default colors for pie chart
    const colors = ['#EF4444', '#EC4899', '#6366F1', '#F97316', '#06B6D4', '#14B8A6'];
    
    return Object.entries(byCategory)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5
  }, [monthlyTransactions]);

  const cashFlowData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = d.toLocaleString('tr-TR', { month: 'short' });
      const m = d.getMonth();
      const y = d.getFullYear();
      
      const mIncome = transactions.filter(t => {
        const td = new Date(t.date);
        return t.type === 'income' && t.status === 'completed' && td.getMonth() === m && td.getFullYear() === y;
      }).reduce((acc, t) => acc + t.amount, 0);
      
      const mExpense = transactions.filter(t => {
        const td = new Date(t.date);
        return t.type === 'expense' && t.status === 'completed' && td.getMonth() === m && td.getFullYear() === y;
      }).reduce((acc, t) => acc + t.amount, 0);

      data.push({ name: monthLabel, gelir: mIncome, gider: mExpense });
    }
    return data;
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);
  const upcomingPayments = payments.filter(p => p.status === 'pending' || p.status === 'partial' || p.status === 'overdue').sort((a,b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).slice(0, 4);

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <Topbar title="Dashboard" />
      
      <main className="page-content overflow-y-auto">
        {/* Welcome Message */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold mb-1">Hoş Geldiniz, Bahadır Bey</h2>
            <p className="text-secondary text-sm">İşte Novarion'un güncel finansal özeti.</p>
          </div>
          <div className="text-sm text-secondary">
            Son güncelleme: {formatDate(new Date().toISOString())}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-stats mb-6">
          <div className="stat-card">
            <div className="stat-card-icon brand">
              <Wallet size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Toplam Bakiye (Tüm Hesaplar)</div>
              <div className="stat-card-value">{formatCurrency(totalBalance)}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon green">
              <TrendingUp size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Bu Ay Gelir</div>
              <div className="stat-card-value">{formatCurrency(monthlyIncome)}</div>
              <div className="stat-card-change positive">
                <ArrowUpRight size={14} /> %12 Geçen aya göre
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon red">
              <TrendingDown size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Bu Ay Gider</div>
              <div className="stat-card-value">{formatCurrency(monthlyExpense)}</div>
              <div className="stat-card-change negative">
                <ArrowUpRight size={14} /> %3 Geçen aya göre
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon amber">
              <Building2 size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Net Kâr / Zarar</div>
              <div className={`stat-card-value ${netProfit >= 0 ? 'text-success' : 'text-error'}`}>
                {formatCurrency(netProfit)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid-2 mb-6" style={{ gap: 'var(--space-4)' }}>
           <div className="stat-card" style={{ padding: 'var(--space-4)' }}>
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="stat-card-label">Bekleyen Alacaklar</div>
                  <div className="stat-card-value text-success">{formatCurrency(totalReceivables)}</div>
                </div>
                <div className="stat-card-icon green" style={{ width: 40, height: 40 }}>
                  <ArrowDownRight size={20} />
                </div>
              </div>
           </div>
           <div className="stat-card" style={{ padding: 'var(--space-4)' }}>
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="stat-card-label">Bekleyen Borçlar</div>
                  <div className="stat-card-value text-error">{formatCurrency(totalPayables)}</div>
                </div>
                <div className="stat-card-icon red" style={{ width: 40, height: 40 }}>
                  <ArrowUpRight size={20} />
                </div>
              </div>
           </div>
        </div>

        {/* Charts Section */}
        <div className="grid-dashboard-main mb-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Nakit Akışı (Son 6 Ay)</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.income} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartColors.income} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGider" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.expense} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartColors.expense} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, borderRadius: 8 }}
                    formatter={(value: any) => formatCurrency(Number(value))}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" name="Gelir" dataKey="gelir" stroke={chartColors.income} strokeWidth={3} fillOpacity={1} fill="url(#colorGelir)" />
                  <Area type="monotone" name="Gider" dataKey="gider" stroke={chartColors.expense} strokeWidth={3} fillOpacity={1} fill="url(#colorGider)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Gider Dağılımı (Bu Ay)</h3>
            </div>
            {categoryExpenses.length > 0 ? (
              <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column' }}>
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={categoryExpenses}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, borderRadius: 8 }}
                      formatter={(value: any) => formatCurrency(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: '30%' }}>
                  {categoryExpenses.slice(0,3).map((cat, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.color }} />
                        <span className="truncate" style={{ maxWidth: 100 }}>{cat.name}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <FileWarning className="empty-state-icon" style={{ width: 48, height: 48, marginBottom: 16 }} />
                <p className="text-secondary text-sm">Bu ay henüz gider kaydedilmedi.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid-2">
          {/* Recent Transactions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Son İşlemler</h3>
              <button className="btn btn-ghost btn-sm">Tümünü Gör</button>
            </div>
            <div className="table-container" style={{ border: 'none', borderRadius: 0, overflow: 'visible' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Açıklama</th>
                    <th>Hesap</th>
                    <th className="text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.length > 0 ? recentTransactions.map((tr) => (
                    <tr key={tr.id}>
                      <td>{formatDate(tr.date)}</td>
                      <td>
                        <div className="truncate font-medium" style={{ maxWidth: 180 }}>{tr.description || tr.category_name}</div>
                        <div className="text-xs text-secondary">{tr.contact_name || '-'}</div>
                      </td>
                      <td>{tr.account_name}</td>
                      <td className="text-right">
                        <span className={`table-amount ${tr.type === 'income' ? 'positive' : tr.type === 'expense' ? 'negative' : ''}`}>
                          {tr.type === 'expense' ? '-' : tr.type === 'income' ? '+' : ''}
                          {formatCurrency(tr.amount)}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="text-center text-secondary py-4">İşlem bulunamadı</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Yaklaşan Ödemeler/Tahsilatlar</h3>
              <button className="btn btn-ghost btn-sm">Tümünü Gör</button>
            </div>
            <div className="flex flex-col gap-3">
              {upcomingPayments.length > 0 ? upcomingPayments.map((p) => {
                const isPayable = p.direction === 'payable';
                const Icon = isPayable ? ArrowUpRight : ArrowDownRight;
                const colorClass = isPayable ? 'text-error' : 'text-success';
                const bgClass = isPayable ? 'var(--color-error-light)' : 'var(--color-success-light)';
                
                return (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-secondary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center rounded-md" style={{ width: 36, height: 36, backgroundColor: bgClass }}>
                        <Icon size={18} className={colorClass} />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{p.contact_name || p.description}</div>
                        <div className="flex items-center gap-2 text-xs text-secondary mt-1">
                          <Clock size={12} /> {formatDate(p.due_date)}
                          <span className={`badge ${getStatusBadgeClass(p.status)}`} style={{ padding: '0 4px', fontSize: 10 }}>
                            {getStatusLabel(p.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${colorClass}`}>
                      {formatCurrency(p.amount - p.paid_amount)}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center text-secondary py-4">Yaklaşan kayıt bulunamadı</div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
