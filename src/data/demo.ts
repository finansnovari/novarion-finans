// ============================================
// Novarion Finans — Demo Data
// ============================================

import type {
  Account,
  Transaction,
  Category,
  Contact,
  Payment,
  PaymentHistory,
  DashboardSummary,
  ChartDataPoint,
  CategorySummary,
  Notification,
} from '@/types';

// ── Categories ──
export const demoCategories: Category[] = [
  // Gelir Kategorileri
  { id: 'cat-1', name: 'Satış / Tahsilat', type: 'income', color: '#10B981', created_at: '2024-01-01' },
  
  // Gider Kategorileri (İstenilenler)
  { id: 'cat-5', name: 'Harcama', type: 'expense', color: '#EF4444', created_at: '2024-01-01' },
  { id: 'cat-6', name: 'Kira', type: 'expense', color: '#F97316', created_at: '2024-01-01' },
  { id: 'cat-7', name: 'Malzeme Alımı', type: 'expense', color: '#EC4899', created_at: '2024-01-01' },
  { id: 'cat-8', name: 'Vergi', type: 'expense', color: '#6366F1', created_at: '2024-01-01' },
  { id: 'cat-9', name: 'Ulaşım', type: 'expense', color: '#14B8A6', created_at: '2024-01-01' },
];

// ── Accounts ──
export const demoAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'Garanti TL Hesabı',
    type: 'bank',
    currency: '₺',
    balance: 284750.50,
    bank_name: 'Garanti BBVA',
    iban: 'TR12 0006 2000 0001 2345 6789 00',
    is_active: true,
    created_at: '2024-01-15',
    updated_at: '2024-10-01',
  },
  {
    id: 'acc-2',
    name: 'İş Bankası TL Hesabı',
    type: 'bank',
    currency: '₺',
    balance: 157320.00,
    bank_name: 'İş Bankası',
    iban: 'TR45 0006 4000 0001 2345 6789 00',
    is_active: true,
    created_at: '2024-02-01',
    updated_at: '2024-10-01',
  },
  {
    id: 'acc-3',
    name: 'Yapı Kredi EUR Hesabı',
    type: 'bank',
    currency: '€',
    balance: 12450.00,
    bank_name: 'Yapı Kredi',
    iban: 'TR78 0006 7000 0001 2345 6789 00',
    is_active: true,
    created_at: '2024-03-01',
    updated_at: '2024-10-01',
  },
  {
    id: 'acc-4',
    name: 'Şirket Kredi Kartı',
    type: 'credit_card',
    currency: '₺',
    balance: -18650.00,
    bank_name: 'Garanti BBVA',
    is_active: true,
    created_at: '2024-01-15',
    updated_at: '2024-10-01',
  },
  {
    id: 'acc-5',
    name: 'Nakit Kasa',
    type: 'cash',
    currency: '₺',
    balance: 8450.00,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-10-01',
  },
];

// ── Contacts ──
export const demoContacts: Contact[] = [
  {
    id: 'con-1', type: 'customer', name: 'ABC Otelleri A.Ş.',
    title: 'ABC Otelleri Anonim Şirketi', tax_number: '1234567890',
    phone: '+90 212 555 0001', email: 'info@abchotels.com',
    address: 'Beşiktaş, İstanbul', balance: 45600.00,
    is_active: true, created_at: '2024-02-01', updated_at: '2024-09-15',
  },
  {
    id: 'con-2', type: 'customer', name: 'Deniz Restaurant Grubu',
    title: 'Deniz Restaurant Ltd. Şti.', tax_number: '9876543210',
    phone: '+90 216 555 0002', email: 'finans@denizrestaurant.com',
    address: 'Kadıköy, İstanbul', balance: 23400.00,
    is_active: true, created_at: '2024-03-15', updated_at: '2024-09-20',
  },
  {
    id: 'con-3', type: 'supplier', name: 'Metro Gıda Tedarik',
    title: 'Metro Gıda Ltd. Şti.', tax_number: '5555555555',
    phone: '+90 312 555 0003', email: 'siparis@metrogida.com',
    address: 'Çankaya, Ankara', balance: -32150.00,
    is_active: true, created_at: '2024-01-10', updated_at: '2024-09-25',
  },
  {
    id: 'con-4', type: 'supplier', name: 'Temizlik Plus',
    title: 'Temizlik Plus San. Tic. A.Ş.', tax_number: '4444444444',
    phone: '+90 232 555 0004', email: 'info@temizlikplus.com',
    address: 'Bornova, İzmir', balance: -8900.00,
    is_active: true, created_at: '2024-04-01', updated_at: '2024-09-28',
  },
  {
    id: 'con-5', type: 'both', name: 'Ege Lojistik',
    title: 'Ege Lojistik Taşımacılık Ltd. Şti.', tax_number: '3333333333',
    phone: '+90 242 555 0005', email: 'muhasebe@egelojistik.com',
    address: 'Muratpaşa, Antalya', balance: 12800.00,
    is_active: true, created_at: '2024-05-01', updated_at: '2024-09-30',
  },
  {
    id: 'con-6', type: 'customer', name: 'Grand Otel İstanbul',
    title: 'Grand Otel Turizm A.Ş.', tax_number: '6666666666',
    phone: '+90 212 555 0006', email: 'info@grandotel.com',
    address: 'Beyoğlu, İstanbul', balance: 67800.00,
    is_active: true, created_at: '2024-06-01', updated_at: '2024-10-01',
  },
];

// ── Transactions ──
const today = new Date();
const thisMonth = today.getMonth();
const thisYear = today.getFullYear();

function dateStr(daysAgo: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const demoTransactions: Transaction[] = [
  {
    id: 'tr-1', type: 'income', amount: 48500.00, currency: '₺',
    date: dateStr(1), category_id: 'cat-1', account_id: 'acc-1',
    contact_id: 'con-1', description: 'Ekim ayı hizmet bedeli',
    payment_method: 'Havale', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(1), updated_at: dateStr(1),
    category_name: 'Satışlar', account_name: 'Garanti TL Hesabı', contact_name: 'ABC Otelleri A.Ş.',
  },
  {
    id: 'tr-2', type: 'income', amount: 32000.00, currency: '₺',
    date: dateStr(3), category_id: 'cat-2', account_id: 'acc-2',
    contact_id: 'con-2', description: 'Eylül konsültasyon ücreti',
    payment_method: 'Havale', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(3), updated_at: dateStr(3),
    category_name: 'Hizmet Geliri', account_name: 'İş Bankası TL Hesabı', contact_name: 'Deniz Restaurant Grubu',
  },
  {
    id: 'tr-101', type: 'expense', amount: 45000.00, currency: '₺',
    date: dateStr(15), category_id: 'cat-1', account_id: 'acc-1',
    contact_id: 'con-2', description: 'Ekim Ayı Toplu Gıda Faturası',
    payment_method: 'Nakit', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(15), updated_at: dateStr(15),
    category_name: 'Satışlar', account_name: 'Garanti TL Hesabı', contact_name: 'Deniz Restaurant Grubu',
  },
  {
    id: 'tr-102', type: 'income', amount: 20000.00, currency: '₺',
    date: dateStr(10), category_id: 'cat-1', account_id: 'acc-2',
    contact_id: 'con-2', description: 'Kısmi Fatura Ödemesi',
    payment_method: 'Havale', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(10), updated_at: dateStr(10),
    category_name: 'Tahsilat', account_name: 'İş Bankası TL Hesabı', contact_name: 'Deniz Restaurant Grubu',
  },
  {
    id: 'tr-103', type: 'expense', amount: 12500.00, currency: '₺',
    date: dateStr(5), category_id: 'cat-2', account_id: 'acc-1',
    contact_id: 'con-2', description: 'Ekstra İçecek Faturası',
    payment_method: 'Nakit', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(5), updated_at: dateStr(5),
    category_name: 'Satışlar', account_name: 'Garanti TL Hesabı', contact_name: 'Deniz Restaurant Grubu',
  },
  {
    id: 'tr-104', type: 'income', amount: 15000.00, currency: '₺',
    date: dateStr(2), category_id: 'cat-1', account_id: 'acc-2',
    contact_id: 'con-2', description: 'Kalan Fatura Ödemesi',
    payment_method: 'Havale', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(2), updated_at: dateStr(2),
    category_name: 'Tahsilat', account_name: 'İş Bankası TL Hesabı', contact_name: 'Deniz Restaurant Grubu',
  },
  {
    id: 'tr-3', type: 'expense', amount: 85000.00, currency: '₺',
    date: dateStr(2), category_id: 'cat-5', account_id: 'acc-1',
    description: 'Ekim maaş ödemeleri',
    payment_method: 'Havale', status: 'completed', is_recurring: true,
    recurring_interval: 'monthly',
    created_by: 'user-1', created_at: dateStr(2), updated_at: dateStr(2),
    category_name: 'Personel Gideri', account_name: 'Garanti TL Hesabı',
  },
  {
    id: 'tr-4', type: 'expense', amount: 12500.00, currency: '₺',
    date: dateStr(5), category_id: 'cat-6', account_id: 'acc-1',
    description: 'Ofis kira bedeli',
    payment_method: 'Havale', status: 'completed', is_recurring: true,
    recurring_interval: 'monthly',
    created_by: 'user-1', created_at: dateStr(5), updated_at: dateStr(5),
    category_name: 'Kira', account_name: 'Garanti TL Hesabı',
  },
  {
    id: 'tr-5', type: 'income', amount: 67800.00, currency: '₺',
    date: dateStr(7), category_id: 'cat-1', account_id: 'acc-1',
    contact_id: 'con-6', description: 'Grand Otel Eylül faturası',
    payment_method: 'Havale', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(7), updated_at: dateStr(7),
    category_name: 'Satışlar', account_name: 'Garanti TL Hesabı', contact_name: 'Grand Otel İstanbul',
  },
  {
    id: 'tr-6', type: 'expense', amount: 24300.00, currency: '₺',
    date: dateStr(4), category_id: 'cat-7', account_id: 'acc-2',
    contact_id: 'con-3', description: 'Gıda malzeme alımı',
    payment_method: 'Havale', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(4), updated_at: dateStr(4),
    category_name: 'Malzeme Alımı', account_name: 'İş Bankası TL Hesabı', contact_name: 'Metro Gıda Tedarik',
  },
  {
    id: 'tr-7', type: 'expense', amount: 18650.00, currency: '₺',
    date: dateStr(6), category_id: 'cat-8', account_id: 'acc-4',
    description: 'SGK prim ödemesi',
    payment_method: 'Kredi Kartı', status: 'completed', is_recurring: true,
    recurring_interval: 'monthly',
    created_by: 'user-1', created_at: dateStr(6), updated_at: dateStr(6),
    category_name: 'Vergi & SGK', account_name: 'Şirket Kredi Kartı',
  },
  {
    id: 'tr-8', type: 'income', amount: 15200.00, currency: '₺',
    date: dateStr(10), category_id: 'cat-2', account_id: 'acc-1',
    contact_id: 'con-5', description: 'Lojistik danışmanlık ücreti',
    payment_method: 'Havale', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(10), updated_at: dateStr(10),
    category_name: 'Hizmet Geliri', account_name: 'Garanti TL Hesabı', contact_name: 'Ege Lojistik',
  },
  {
    id: 'tr-9', type: 'expense', amount: 6800.00, currency: '₺',
    date: dateStr(8), category_id: 'cat-11', account_id: 'acc-4',
    description: 'Google Ads ve sosyal medya reklamları',
    payment_method: 'Kredi Kartı', status: 'completed', is_recurring: true,
    recurring_interval: 'monthly',
    created_by: 'user-1', created_at: dateStr(8), updated_at: dateStr(8),
    category_name: 'Pazarlama', account_name: 'Şirket Kredi Kartı',
  },
  {
    id: 'tr-10', type: 'expense', amount: 3200.00, currency: '₺',
    date: dateStr(9), category_id: 'cat-9', account_id: 'acc-5',
    description: 'Akaryakıt ve yol masrafları',
    payment_method: 'Nakit', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(9), updated_at: dateStr(9),
    category_name: 'Ulaşım', account_name: 'Nakit Kasa',
  },
  {
    id: 'tr-11', type: 'income', amount: 4500.00, currency: '₺',
    date: dateStr(12), category_id: 'cat-3', account_id: 'acc-1',
    description: 'Vadeli mevduat faiz geliri',
    payment_method: 'Otomatik', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(12), updated_at: dateStr(12),
    category_name: 'Faiz Geliri', account_name: 'Garanti TL Hesabı',
  },
  {
    id: 'tr-12', type: 'expense', amount: 8900.00, currency: '₺',
    date: dateStr(11), category_id: 'cat-7', account_id: 'acc-2',
    contact_id: 'con-4', description: 'Temizlik malzemesi alımı',
    payment_method: 'Havale', status: 'completed', is_recurring: false,
    created_by: 'user-1', created_at: dateStr(11), updated_at: dateStr(11),
    category_name: 'Malzeme Alımı', account_name: 'İş Bankası TL Hesabı', contact_name: 'Temizlik Plus',
  },
];

// ── Payments (Planned) ──
export const demoPayments: Payment[] = [
  {
    id: 'pay-1', direction: 'payable', amount: 32150.00, paid_amount: 0,
    currency: '₺', due_date: dateStr(-3), contact_id: 'con-3',
    account_id: 'acc-1', description: 'Metro Gıda faturası',
    status: 'overdue', payment_type: 'transfer',
    created_by: 'user-1', created_at: dateStr(15), updated_at: dateStr(0),
    contact_name: 'Metro Gıda Tedarik', account_name: 'Garanti TL Hesabı',
  },
  {
    id: 'pay-2', direction: 'payable', amount: 8900.00, paid_amount: 4000.00,
    currency: '₺', due_date: dateStr(-5), contact_id: 'con-4',
    account_id: 'acc-2', description: 'Temizlik Plus bakiye',
    status: 'partial', payment_type: 'transfer',
    created_by: 'user-1', created_at: dateStr(20), updated_at: dateStr(5),
    contact_name: 'Temizlik Plus', account_name: 'İş Bankası TL Hesabı',
  },
  {
    id: 'pay-3', direction: 'receivable', amount: 45600.00, paid_amount: 0,
    currency: '₺', due_date: dateStr(-2), contact_id: 'con-1',
    account_id: 'acc-1', description: 'ABC Otelleri Eylül faturası',
    status: 'pending', payment_type: 'transfer',
    created_by: 'user-1', created_at: dateStr(10), updated_at: dateStr(0),
    contact_name: 'ABC Otelleri A.Ş.', account_name: 'Garanti TL Hesabı',
  },
  {
    id: 'pay-4', direction: 'receivable', amount: 23400.00, paid_amount: 10000.00,
    currency: '₺', due_date: dateStr(-7), contact_id: 'con-2',
    account_id: 'acc-2', description: 'Deniz Restaurant bakiyesi',
    status: 'partial', payment_type: 'check', check_number: 'ÇK-2024-045',
    created_by: 'user-1', created_at: dateStr(25), updated_at: dateStr(7),
    contact_name: 'Deniz Restaurant Grubu', account_name: 'İş Bankası TL Hesabı',
  },
  {
    id: 'pay-5', direction: 'receivable', amount: 67800.00, paid_amount: 0,
    currency: '₺', due_date: dateStr(-14), contact_id: 'con-6',
    description: 'Grand Otel İstanbul hizmet bedeli',
    status: 'overdue', payment_type: 'transfer',
    reminder_notes: 'Muhasebe müdürüne 2 kez hatırlatma yapıldı.',
    created_by: 'user-1', created_at: dateStr(30), updated_at: dateStr(0),
    contact_name: 'Grand Otel İstanbul',
  },
  {
    id: 'pay-6', direction: 'payable', amount: 12500.00, paid_amount: 0,
    currency: '₺', due_date: dateStr(-1), contact_id: 'con-1', account_id: 'acc-1',
    description: 'Kasım kira ödemesi (ABC Otelleri mülkü)',
    status: 'pending', payment_type: 'transfer',
    created_by: 'user-1', created_at: dateStr(5), updated_at: dateStr(0),
    account_name: 'Garanti TL Hesabı', contact_name: 'ABC Otelleri A.Ş.',
  },
  {
    id: 'pay-7', direction: 'receivable', amount: 12800.00, paid_amount: 0,
    currency: '₺', due_date: dateStr(-30), contact_id: 'con-5',
    description: 'Taşımacılık hizmet bedeli',
    status: 'pending', payment_type: 'transfer',
    created_by: 'user-1', created_at: dateStr(20), updated_at: dateStr(0),
    contact_name: 'Ege Lojistik',
  },
];

// ── Payment History ──
export const demoPaymentHistory: PaymentHistory[] = [
  {
    id: 'ph-1', payment_id: 'pay-2', amount: 4000.00, date: dateStr(1),
    account_id: 'acc-2', notes: 'İlk taksit', created_by: 'user-1',
    created_at: dateStr(1), account_name: 'İş Bankası TL Hesabı'
  },
  {
    id: 'ph-2', payment_id: 'pay-4', amount: 10000.00, date: dateStr(2),
    account_id: 'acc-2', notes: 'Kısmi ödeme alındı', created_by: 'user-1',
    created_at: dateStr(2), account_name: 'İş Bankası TL Hesabı'
  }
];

// ── Dashboard Summary ──
export const demoDashboardSummary: DashboardSummary = {
  totalBalance: demoAccounts.reduce((sum, a) => sum + a.balance, 0),
  monthlyIncome: 168000.00,
  monthlyExpense: 159350.00,
  netProfit: 8650.00,
  totalReceivables: 149600.00,
  totalPayables: 53550.00,
  incomeChange: 12.5,
  expenseChange: -3.2,
};

// ── Chart Data ──
export const demoCashFlowData: ChartDataPoint[] = [
  { name: 'Oca', gelir: 145000, gider: 120000 },
  { name: 'Şub', gelir: 132000, gider: 118000 },
  { name: 'Mar', gelir: 168000, gider: 135000 },
  { name: 'Nis', gelir: 155000, gider: 142000 },
  { name: 'May', gelir: 178000, gider: 138000 },
  { name: 'Haz', gelir: 192000, gider: 155000 },
  { name: 'Tem', gelir: 185000, gider: 148000 },
  { name: 'Ağu', gelir: 210000, gider: 162000 },
  { name: 'Eyl', gelir: 198000, gider: 158000 },
  { name: 'Eki', gelir: 168000, gider: 159350 },
];

export const demoCategoryExpenses: CategorySummary[] = [
  { category: 'Personel Gideri', amount: 85000, percentage: 53.3, color: '#EF4444' },
  { category: 'Malzeme Alımı', amount: 33200, percentage: 20.8, color: '#EC4899' },
  { category: 'Vergi & SGK', amount: 18650, percentage: 11.7, color: '#6366F1' },
  { category: 'Kira', amount: 12500, percentage: 7.8, color: '#F97316' },
  { category: 'Pazarlama', amount: 6800, percentage: 4.3, color: '#06B6D4' },
  { category: 'Ulaşım', amount: 3200, percentage: 2.0, color: '#14B8A6' },
];

// ── Notifications ──
export const demoNotifications: Notification[] = [
  {
    id: 'notif-1', title: 'Gecikmiş Ödeme',
    message: 'Metro Gıda Tedarik faturası 3 gündür gecikmiş.',
    type: 'error', is_read: false, link: '/odemeler',
    created_at: dateStr(0),
  },
  {
    id: 'notif-2', title: 'Yaklaşan Tahsilat',
    message: 'ABC Otelleri tahsilatı yarın vadesi doluyor.',
    type: 'warning', is_read: false, link: '/tahsilatlar',
    created_at: dateStr(0),
  },
  {
    id: 'notif-3', title: 'Kira Ödemesi',
    message: 'Kasım ayı kira ödemesi yarın.',
    type: 'info', is_read: true, link: '/odemeler',
    created_at: dateStr(1),
  },
  {
    id: 'notif-4', title: 'Yeni Ödeme Alındı',
    message: 'Deniz Restaurant Grubu 10.000 ₺ ödeme yaptı.',
    type: 'success', is_read: true,
    created_at: dateStr(7),
  },
];

// ── Forecast Data ──
export const demoForecastData: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  const dayName = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  
  // Simulate forecast with some randomness
  const baseIncome = 5600 + Math.random() * 3000;
  const baseExpense = 4200 + Math.random() * 2500;
  
  return {
    name: dayName,
    gelir: Math.round(baseIncome),
    gider: Math.round(baseExpense),
    net: Math.round(baseIncome - baseExpense),
  };
});
