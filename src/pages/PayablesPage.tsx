// ============================================
// Novarion Finans — Payables Page (Ödeme Vade Çizelgesi)
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Calendar,
  List,
  ArrowUpRight,
  Clock,
  AlertCircle,
  MoreHorizontal,
  CheckCircle
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '@/utils/helpers';
import { useSearchParams } from 'react-router-dom';
import Topbar from '@/components/layout/Topbar';
import PaymentModal from '@/components/modals/PaymentModal';
import type { Payment } from '@/types';

export default function PayablesPage() {
  const { payments } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);

  useEffect(() => {
    if (searchParams.get('yeni') === 'true') {
      setPaymentToEdit(null);
      setIsModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const { updatePayment, addPayment, addTransaction } = useStore();

  const handleMarkAsPaid = (payment: Payment) => {
    // 1. Mark current as paid
    updatePayment(payment.id, {
      status: 'paid',
      paid_amount: payment.amount
    });

    // Add transaction to update account balances
    addTransaction({
      type: 'expense',
      amount: payment.amount,
      currency: payment.currency,
      date: new Date().toISOString(),
      account_id: payment.account_id || '',
      contact_id: payment.contact_id,
      description: payment.description || 'Ödeme tamamlandı',
      status: 'completed',
      payment_method: payment.payment_type === 'transfer' ? 'Havale' : 'Nakit',
      is_recurring: false
    });

    // 2. If recurring, generate next payment
    if (payment.is_recurring) {
      const currentDue = new Date(payment.due_date);
      let nextDue = new Date(currentDue);

      if (payment.recurring_interval === 'weekly') {
        nextDue.setDate(currentDue.getDate() + 7);
      } else if (payment.recurring_interval === 'monthly') {
        nextDue.setMonth(currentDue.getMonth() + 1);
      } else if (payment.recurring_interval === 'yearly') {
        nextDue.setFullYear(currentDue.getFullYear() + 1);
      }

      const { id, created_at, updated_at, created_by, ...restPayment } = payment;
      addPayment({
        ...restPayment,
        status: 'pending',
        paid_amount: 0,
        due_date: nextDue.toISOString(),
      });
    }
  };

  // Filter only payables
  const payables = useMemo(() => 
    payments.filter(p => p.direction === 'payable'),
  [payments]);

  // Search filter
  const filteredPayables = useMemo(() => {
    return payables.filter(p => 
      p.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }, [payables, searchTerm]);

  // Group by contact for the list view
  const groupedByContact = useMemo(() => {
    const groups: Record<string, typeof filteredPayables> = {};
    filteredPayables.forEach(p => {
      const name = p.contact_name || 'Bilinmeyen / Cari Belirtilmemiş';
      if (!groups[name]) groups[name] = [];
      groups[name].push(p);
    });
    return groups;
  }, [filteredPayables]);

  // Stats
  const totalPayable = payables.reduce((sum, p) => sum + (p.amount - p.paid_amount), 0);
  const overduePayable = payables
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + (p.amount - p.paid_amount), 0);
    
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthPayable = payables
    .filter(p => {
      const d = new Date(p.due_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && p.status !== 'paid' && p.status !== 'cancelled';
    })
    .reduce((sum, p) => sum + (p.amount - p.paid_amount), 0);

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <Topbar title="Ödeme Vade Çizelgesi" />
      
      <main className="page-content overflow-y-auto">
        
        {/* Header & Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="search-input-wrapper" style={{ width: 280 }}>
              <Search />
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Firma veya açıklama ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex bg-tertiary p-1 rounded-md" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <button 
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'list' ? 'bg-secondary shadow-sm font-medium' : 'text-secondary hover:text-primary'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} /> Liste
              </button>
              <button 
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-secondary shadow-sm font-medium' : 'text-secondary hover:text-primary'}`}
                onClick={() => setViewMode('calendar')}
              >
                <Calendar size={16} /> Takvim
              </button>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <Filter size={16} />
              Filtrele
            </button>
            <button className="btn btn-secondary">
              <Download size={16} />
              Dışa Aktar
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setPaymentToEdit(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={16} />
              Yeni Ödeme Planı
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-3 mb-6">
          <div className="stat-card">
            <div className="stat-card-icon red">
              <ArrowUpRight size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Toplam Bekleyen Ödeme</div>
              <div className="stat-card-value text-error">{formatCurrency(totalPayable)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon brand">
              <Calendar size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Bu Ay Ödenecek</div>
              <div className="stat-card-value">{formatCurrency(thisMonthPayable)}</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderColor: overduePayable > 0 ? 'var(--color-error)' : 'var(--border-primary)' }}>
            <div className="stat-card-icon red">
              <AlertCircle size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Gecikmiş Ödemeler</div>
              <div className={`stat-card-value ${overduePayable > 0 ? 'text-error' : ''}`}>
                {formatCurrency(overduePayable)}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'list' ? (
          <div className="flex flex-col gap-6">
            {Object.keys(groupedByContact).length > 0 ? Object.entries(groupedByContact).map(([contactName, items]) => {
              const contactTotal = items.reduce((sum, item) => sum + (item.amount - item.paid_amount), 0);
              
              return (
                <div key={contactName} className="card p-0">
                  <div className="bg-tertiary px-6 py-4 flex justify-between items-center border-b border-primary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <h3 className="font-semibold text-lg">{contactName}</h3>
                    <div className="text-right">
                      <div className="text-xs text-secondary mb-1">Firma Toplam Borcumuz</div>
                      <div className="font-bold text-error font-display text-lg">{formatCurrency(contactTotal)}</div>
                    </div>
                  </div>
                  <div className="table-container border-0 rounded-none">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Vade Tarihi</th>
                          <th>Açıklama</th>
                          <th>Ödenecek Hesap</th>
                          <th>Durum</th>
                          <th className="text-right">Kalan Tutar</th>
                          <th style={{ width: 60 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr key={item.id} className={item.status === 'overdue' ? 'bg-error-light text-error-contrast' : ''}>
                            <td>
                              <div className="flex items-center gap-2 font-medium">
                                <Clock size={14} className={item.status === 'overdue' ? 'text-error' : 'text-secondary'} />
                                <span className={item.status === 'overdue' ? 'text-error' : ''}>
                                  {formatDate(item.due_date)}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="truncate max-w-[200px]">{item.description}</div>
                            </td>
                            <td>
                              <span className="text-secondary">{item.account_name || '-'}</span>
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                                {getStatusLabel(item.status)}
                              </span>
                            </td>
                            <td className="text-right font-semibold text-error">{formatCurrency(item.amount - item.paid_amount, item.currency)}</td>
                            <td>
                              <div className="dropdown dropdown-hover">
                                <button className="btn btn-ghost btn-icon sm"><MoreHorizontal size={16} /></button>
                                <div className="dropdown-menu" style={{ right: 0, left: 'auto' }}>
                                  {item.status !== 'paid' && (
                                    <button 
                                      className="dropdown-item text-success"
                                      onClick={() => handleMarkAsPaid(item)}
                                    >
                                      <CheckCircle size={14} /> Ödendi İşaretle
                                    </button>
                                  )}
                                  <button 
                                    className="dropdown-item"
                                    onClick={() => {
                                      setPaymentToEdit(item);
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    Düzenle
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }) : (
              <div className="empty-state">
                <AlertCircle className="empty-state-icon" />
                <h3 className="empty-state-title">Bekleyen ödeme bulunamadı</h3>
                <p className="empty-state-description">Şu an için sisteme kayıtlı bir ödeme planı bulunmuyor.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <Calendar size={48} className="text-tertiary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Takvim Görünümü Yapım Aşamasında</h3>
            <p className="text-secondary max-w-md">
              Aylık ödeme takvimi görünümü Novarion Finans'ın sonraki güncellemesinde aktif olacaktır. 
              Lütfen şimdilik Liste görünümünü kullanın.
            </p>
            <button className="btn btn-primary mt-6" onClick={() => setViewMode('list')}>
              Liste Görünümüne Dön
            </button>
          </div>
        )}

      </main>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentToEdit={paymentToEdit}
        defaultDirection="payable"
      />
    </div>
  );
}
