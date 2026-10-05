// ============================================
// Novarion Finans — Global Store (Zustand)
// ============================================

import { create } from 'zustand';
import type {
  User,
  Account,
  Transaction,
  Category,
  Contact,
  Payment,
  PaymentHistory,
  Notification,
  Toast,
  CompanySettings,
} from '@/types';
import {
  demoAccounts,
  demoTransactions,
  demoCategories,
  demoContacts,
  demoPayments,
  demoPaymentHistory,
  demoNotifications,
} from '@/data/demo';
import { generateId } from '@/utils/helpers';

// ── Theme ──
type Theme = 'light' | 'dark';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Sidebar
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  toggleSidebar: () => void;
  setMobileSidebar: (open: boolean) => void;

  // Company
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;

  // Accounts
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>) => void;
  updateAccount: (id: string, data: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  deleteTransactions: (ids: string[]) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  // Payments (Planlı Alacak ve Ödemeler)
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
  updatePayment: (id: string, data: Partial<Payment>) => void;
  deletePayment: (id: string) => void;

  // Payment History (Tahsilat / Ödeme Geçmişi)
  paymentHistory: PaymentHistory[];
  addPaymentHistory: (history: Omit<PaymentHistory, 'id' | 'created_at' | 'created_by'>) => void;
  deletePaymentHistory: (id: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Demo data
  isDemoMode: boolean;
  clearDemoData: () => void;
  loadDemoData: () => void;
  initSupabase: () => Promise<void>;
}

const defaultCompanySettings: CompanySettings = {
  id: 'company-1',
  name: 'Novarion',
  title: 'Novarion Horeca & Supply Solution',
  tax_number: '1234567890',
  address: 'Levent, Beşiktaş, İstanbul',
  phone: '+90 212 555 0000',
  email: 'info@novarion.com',
  default_currency: '₺',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

const defaultUser: User = {
  id: 'user-1',
  email: 'admin@novarion.com',
  full_name: 'Tufan Gemicioğlu',
  role: 'admin',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    localStorage.setItem('novarion-theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  }
  return 'light';
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  isAuthenticated: false,
  currentUser: null,
  login: (email: string, _password: string) => {
    // Demo login — accept any credentials
    const user = { ...defaultUser, email };
    set({ isAuthenticated: true, currentUser: user });
    return true;
  },
  logout: () => {
    set({ isAuthenticated: false, currentUser: null });
  },

  // Theme
  theme: getInitialTheme(),
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('novarion-theme', newTheme);
    set({ theme: newTheme });
  },

  // Sidebar
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMobileSidebar: (open) => set({ sidebarMobileOpen: open }),

  // Company
  companySettings: defaultCompanySettings,
  updateCompanySettings: (settings) =>
    set((s) => ({
      companySettings: { ...s.companySettings, ...settings, updated_at: new Date().toISOString() },
    })),

  // Accounts
  accounts: demoAccounts,
  addAccount: async (account) => {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('accounts').insert([account]).select().single();
    if (error) {
      get().addToast({ type: 'error', title: 'Hata', message: error.message });
      return;
    }
    set((s) => ({ accounts: [...s.accounts, data] }));
    get().addToast({ type: 'success', title: 'Hesap oluşturuldu' });
  },
  updateAccount: async (id, data) => {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('accounts').update(data).eq('id', id);
    if (!error) {
      set((s) => ({
        accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...data, updated_at: new Date().toISOString() } : a)),
      }));
    }
  },
  deleteAccount: async (id) => {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    if (!error) {
      set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) }));
      get().addToast({ type: 'success', title: 'Hesap silindi' });
    }
  },

  // Transactions
  transactions: demoTransactions,
  addTransaction: async (transaction) => {
    const { supabase } = await import('@/lib/supabase');
    const newTr: any = {
      ...transaction,
      created_by: get().currentUser?.id
    };
    if (!newTr.contact_id) delete newTr.contact_id;
    if (!newTr.category_id) delete newTr.category_id;
    if (!newTr.account_id) delete newTr.account_id;
    
    // Remove joined fields before insert
    delete newTr.account_name;
    delete newTr.category_name;
    delete newTr.contact_name;
    
    const { data: insertedTr, error } = await supabase.from('transactions').insert([newTr]).select().single();
    if (error) {
      get().addToast({ type: 'error', title: 'Hata', message: error.message });
      return;
    }

    // Update Account Balance
    if (transaction.account_id) {
      const account = get().accounts.find(a => a.id === transaction.account_id);
      if (account) {
        let newBalance = account.balance;
        if (transaction.type === 'income') newBalance += transaction.amount;
        else if (transaction.type === 'expense') newBalance -= transaction.amount;
        await supabase.from('accounts').update({ balance: newBalance }).eq('id', account.id);
      }
    }

    // Update Contact Balance
    if (transaction.contact_id) {
      const contact = get().contacts.find(c => c.id === transaction.contact_id);
      if (contact) {
        const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
        await supabase.from('contacts').update({ balance: contact.balance + balanceChange }).eq('id', contact.id);
      }
    }

    await get().initSupabase();
    get().addToast({ type: 'success', title: 'İşlem kaydedildi' });
  },
  updateTransaction: async (id, data) => {
    const { supabase } = await import('@/lib/supabase');
    const oldTr = get().transactions.find((t) => t.id === id);
    
    const updateData: any = { ...data };
    if (updateData.contact_id === "") updateData.contact_id = null;
    if (updateData.category_id === "") updateData.category_id = null;
    if (updateData.account_id === "") updateData.account_id = null;
    
    // Remove joined fields before update
    delete updateData.account_name;
    delete updateData.category_name;
    delete updateData.contact_name;
    
    const { error } = await supabase.from('transactions').update(updateData).eq('id', id);
    if (!error && oldTr) {
      const newTr = { ...oldTr, ...updateData };
      
      // If amount, type or account changed, recalculate
      if (oldTr.amount !== newTr.amount || oldTr.type !== newTr.type || oldTr.account_id !== newTr.account_id) {
        // Rollback old
        if (oldTr.account_id) {
          const acc = get().accounts.find(a => a.id === oldTr.account_id);
          if (acc) {
            let rollback = acc.balance;
            if (oldTr.type === 'income') rollback -= oldTr.amount;
            else if (oldTr.type === 'expense') rollback += oldTr.amount;
            await supabase.from('accounts').update({ balance: rollback }).eq('id', acc.id);
          }
        }
        // Apply new
        if (newTr.account_id) {
          // Fetch fresh account in case it's the same one we just rollbacked
          const { data: freshAcc } = await supabase.from('accounts').select('balance').eq('id', newTr.account_id).single();
          if (freshAcc) {
            let apply = freshAcc.balance;
            if (newTr.type === 'income') apply += newTr.amount;
            else if (newTr.type === 'expense') apply -= newTr.amount;
            await supabase.from('accounts').update({ balance: apply }).eq('id', newTr.account_id);
          }
        }
      }
      
      await get().initSupabase();
      get().addToast({ type: 'success', title: 'İşlem güncellendi' });
    }
  },
  deleteTransaction: async (id) => {
    const { supabase } = await import('@/lib/supabase');
    const tr = get().transactions.find((t) => t.id === id);
    if (!tr) return;

    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      get().addToast({ type: 'error', title: 'Hata', message: error.message });
      return;
    }

    // Rollback Account Balance
    if (tr.account_id) {
      const account = get().accounts.find(a => a.id === tr.account_id);
      if (account) {
        let newBalance = account.balance;
        if (tr.type === 'income') newBalance -= tr.amount;
        else if (tr.type === 'expense') newBalance += tr.amount;
        await supabase.from('accounts').update({ balance: newBalance }).eq('id', account.id);
      }
    }

    // Rollback Contact Balance
    if (tr.contact_id) {
      const contact = get().contacts.find(c => c.id === tr.contact_id);
      if (contact) {
        const balanceChange = tr.type === 'income' ? tr.amount : -tr.amount;
        await supabase.from('contacts').update({ balance: contact.balance + balanceChange }).eq('id', contact.id);
      }
    }

    await get().initSupabase();
    get().addToast({ type: 'success', title: 'İşlem silindi' });
  },
  deleteTransactions: (ids) => {
    set((s) => ({ transactions: s.transactions.filter((t) => !ids.includes(t.id)) }));
    get().addToast({ type: 'success', title: `${ids.length} işlem silindi` });
  },

  // Categories
  categories: demoCategories,
  addCategory: (category) => {
    set((s) => ({
      categories: [...s.categories, { ...category, id: generateId(), created_at: new Date().toISOString() }],
    }));
  },
  updateCategory: (id, data) =>
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  deleteCategory: (id) =>
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

  // Contacts
  contacts: demoContacts,
  addContact: async (contact) => {
    const { supabase } = await import('@/lib/supabase');
    const newContact: any = { ...contact };
    const { data, error } = await supabase.from('contacts').insert([newContact]).select().single();
    if (error) {
      get().addToast({ type: 'error', title: 'Hata', message: error.message });
      return;
    }
    set((s) => ({ contacts: [data, ...s.contacts] }));
    get().addToast({ type: 'success', title: 'Cari hesap oluşturuldu' });
  },
  updateContact: async (id, data) => {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('contacts').update(data).eq('id', id);
    if (!error) {
      set((s) => ({
        contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...data, updated_at: new Date().toISOString() } : c)),
      }));
    }
  },
  deleteContact: async (id) => {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (!error) {
      set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) }));
      get().addToast({ type: 'success', title: 'Cari hesap silindi' });
    }
  },

  // Payments (Alacak / Ödeme)
  payments: demoPayments,
  addPayment: async (payment) => {
    const { supabase } = await import('@/lib/supabase');
    const newPayment: any = { ...payment, created_by: get().currentUser?.id };
    if (!newPayment.contact_id) delete newPayment.contact_id;
    if (!newPayment.account_id) delete newPayment.account_id;
    
    // Remove joined fields before insert
    delete newPayment.account_name;
    delete newPayment.contact_name;
    
    const { data, error } = await supabase.from('payments').insert([newPayment]).select().single();
    if (error) {
      get().addToast({ type: 'error', title: 'Hata', message: error.message });
      return;
    }
    set((s) => ({ payments: [data, ...s.payments] }));
    get().addToast({ type: 'success', title: 'Planlı kayıt oluşturuldu' });
  },
  updatePayment: async (id, data) => {
    const { supabase } = await import('@/lib/supabase');
    const updateData: any = { ...data };
    if (updateData.contact_id === "") updateData.contact_id = null;
    if (updateData.account_id === "") updateData.account_id = null;
    
    // Remove joined fields before update
    delete updateData.account_name;
    delete updateData.contact_name;
    
    const { error } = await supabase.from('payments').update(updateData).eq('id', id);
    if (!error) {
      set((s) => ({
        payments: s.payments.map((p) => (p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p)),
      }));
    }
  },
  deletePayment: async (id) => {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (!error) {
      set((s) => ({ payments: s.payments.filter((p) => p.id !== id) }));
      get().addToast({ type: 'success', title: 'Planlı kayıt silindi' });
    }
  },

  // Payment History
  paymentHistory: demoPaymentHistory,
  addPaymentHistory: (history) => {
    const now = new Date().toISOString();
    set((s) => ({
      paymentHistory: [
        ...s.paymentHistory,
        { ...history, id: generateId(), created_by: get().currentUser?.id || 'user-1', created_at: now },
      ],
    }));
    // TODO: update related payment's paid_amount
  },
  deletePaymentHistory: (id) => {
    set((s) => ({ paymentHistory: s.paymentHistory.filter((ph) => ph.id !== id) }));
  },

  // Notifications
  notifications: demoNotifications,
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, is_read: true })),
    })),

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = generateId();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 4000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // Demo
  isDemoMode: true,
  clearDemoData: () => {
    set({
      accounts: [],
      transactions: [],
      contacts: [],
      payments: [],
      paymentHistory: [],
      notifications: [],
      isDemoMode: false,
    });
    get().addToast({ type: 'info', title: 'Demo verileri temizlendi' });
  },
  loadDemoData: () => {
    set({
      accounts: demoAccounts,
      transactions: demoTransactions,
      contacts: demoContacts,
      payments: demoPayments,
      paymentHistory: demoPaymentHistory,
      notifications: demoNotifications,
      isDemoMode: true,
    });
    get().addToast({ type: 'success', title: 'Demo verileri yüklendi' });
  },
  
  // Real DB
  initSupabase: async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const [
        { data: accounts },
        { data: transactions },
        { data: contacts },
        { data: payments }
      ] = await Promise.all([
        supabase.from('accounts').select('*'),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('contacts').select('*'),
        supabase.from('payments').select('*').order('due_date', { ascending: true })
      ]);
      
      set({
        accounts: accounts || [],
        transactions: transactions || [],
        contacts: contacts || [],
        payments: payments || [],
        isDemoMode: false
      });
    } catch (e) {
      console.error('Failed to load DB data', e);
    }
  }
}));
