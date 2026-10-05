// ============================================
// Novarion Finans — Type Definitions
// ============================================

export type UserRole = 'admin' | 'accountant' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  name: string;
  title: string;
  tax_number: string;
  address: string;
  phone: string;
  email: string;
  logo_url?: string;
  default_currency: string;
  created_at: string;
  updated_at: string;
}

export type AccountType = 'bank' | 'credit_card' | 'cash';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  bank_name?: string;
  iban?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string;
  category_id?: string;
  subcategory?: string;
  account_id: string;
  contact_id?: string;
  description?: string;
  payment_method?: string;
  tags?: string[];
  attachment_url?: string;
  is_recurring: boolean;
  recurring_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  status: 'completed' | 'pending' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  category_name?: string;
  account_name?: string;
  contact_name?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  parent_id?: string;
  created_at: string;
}

export type ContactType = 'customer' | 'supplier' | 'both';

export interface Contact {
  id: string;
  type: ContactType;
  name: string;
  title?: string;
  tax_number?: string;
  tax_office?: string;
  currency?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
export type PaymentDirection = 'payable' | 'receivable';

export interface Payment {
  id: string;
  direction: PaymentDirection;
  amount: number;
  paid_amount: number;
  currency: string;
  due_date: string;
  contact_id: string;
  account_id?: string;
  description?: string;
  status: PaymentStatus;
  payment_type?: 'cash' | 'check' | 'promissory_note' | 'transfer' | 'other';
  check_number?: string;
  reminder_notes?: string;
  is_recurring?: boolean;
  recurring_interval?: 'monthly' | 'weekly' | 'yearly';
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  contact_name?: string;
  account_name?: string;
}

export interface PaymentHistory {
  id: string;
  payment_id: string;
  amount: number;
  date: string;
  account_id: string;
  notes?: string;
  created_by: string;
  created_at: string;
  // Joined fields
  account_name?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: 'create' | 'update' | 'delete';
  entity_type: string;
  entity_id: string;
  changes?: Record<string, unknown>;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  link?: string;
  created_at: string;
}

// Report Types
export interface DateRange {
  start: string;
  end: string;
}

export interface ChartDataPoint {
  name: string;
  gelir: number;
  gider: number;
  net?: number;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netProfit: number;
  totalReceivables: number;
  totalPayables: number;
  incomeChange: number;
  expenseChange: number;
}

export type ExportFormat = 'excel' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  dateRange?: DateRange;
  filters?: Record<string, unknown>;
  includeAll?: boolean;
  title: string;
  filename: string;
}

// Toast
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
