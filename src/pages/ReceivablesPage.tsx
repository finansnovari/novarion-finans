// ============================================
// Novarion Finans — Receivables Page (Alacak Vade Çizelgesi)
// ============================================

import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Calendar,
  List,
  ArrowDownRight,
  Clock,
  AlertCircle,
  MoreHorizontal,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '@/utils/helpers';
import Topbar from '@/components/layout/Topbar';
import PaymentModal from '@/components/modals/PaymentModal';
import type { Payment } from '@/types';

export default function ReceivablesPage() {
  const { payments } = useStore();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);

  const { updatePayment, addPayment, addTransaction } = useStore();

  const handleMarkAsPaid = (payment: Payment) => {
    updatePayment(payment.id, {
      status: 'paid',
      paid_amount: payment.amount
    });

    addTransaction({
      type: 'income',
      amount: payment.amount,
      currency: payment.currency,
      date: new Date().toISOString(),
      account_id: payment.account_id || '',
      contact_id: payment.contact_id,
      description: payment.description || 'Tahsilat tamamlandı',
      status: 'completed',
      payment_method: payment.payment_type === 'transfer' ? 'Havale' : 'Nakit',
      is_recurring: false
    });

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

  // Filter only receivables
  const receivables = useMemo(() => 
    payments.filter(p => p.direction === 'receivable'),
  [payments]);

  // Search filter
  const filteredReceivables = useMemo(() => {
    return receivables.filter(r => 
      r.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }, [receivables, searchTerm]);

  // Group by contact for the list view
  const groupedByContact = useMemo(() => {
    const groups: Record<string, typeof filteredReceivables> = {};
    filteredReceivables.forEach(r => {
      const name = r.contact_name || 'Bilinmeyen Cari';
      if (!groups[name]) groups[name] = [];
      groups[name].push(r);
    });
    return groups;
  }, [filteredReceivables]);

  // Stats
  const totalReceivable = receivables.reduce((sum, r) => sum + (r.amount - r.paid_amount), 0);
  const overdueReceivable = receivables
    .filter(r => r.status === 'overdue')
    .reduce((sum, r) => sum + (r.amount - r.paid_amount), 0);
    
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthReceivable = receivables
    .filter(r => {
      const d = new Date(r.due_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.status !== 'paid' && r.status !== 'cancelled';
    })
    .reduce((sum, r) => sum + (r.amount - r.paid_amount), 0);

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <Topbar title="Alacak Vade Çizelgesi" />
      
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
              Yeni Tahsilat Planı
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-3 mb-6">
          <div className="stat-card">
            <div className="stat-card-icon green">
              <ArrowDownRight size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Toplam Bekleyen Tahsilat</div>
              <div className="stat-card-value text-success">{formatCurrency(totalReceivable)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon brand">
              <Calendar size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Bu Ay Tahsil Edilecek</div>
              <div className="stat-card-value">{formatCurrency(thisMonthReceivable)}</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderColor: overdueReceivable > 0 ? 'var(--color-error)' : 'var(--border-primary)' }}>
            <div className="stat-card-icon red">
              <AlertCircle size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-label">Gecikmiş Alacaklar</div>
              <div className={`stat-card-value ${overdueReceivable > 0 ? 'text-error' : ''}`}>
                {formatCurrency(overdueReceivable)}
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
                      <div className="text-xs text-secondary mb-1">Firma Toplam Bekleyen</div>
                      <div className="font-bold text-success font-display text-lg">{formatCurrency(contactTotal)}</div>
                    </div>
                  </div>
                  <div className="table-container border-0 rounded-none">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Vade Tarihi</th>
                          <th>Açıklama</th>
                          <th>Durum</th>
                          <th className="text-right">Toplam Tutar</th>
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
                              {item.reminder_notes && (
                                <div className="text-xs text-warning mt-1 flex items-center gap-1">
                                  <AlertCircle size={12} /> {item.reminder_notes}
                                </div>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                                {getStatusLabel(item.status)}
                              </span>
                            </td>
                            <td className="text-right text-secondary">{formatCurrency(item.amount, item.currency)}</td>
                            <td className="text-right font-semibold text-success">{formatCurrency(item.amount - item.paid_amount, item.currency)}</td>
                            <td>
                              <div className="dropdown dropdown-hover">
                                <button className="btn btn-ghost btn-icon sm"><MoreHorizontal size={16} /></button>
                                <div className="dropdown-menu" style={{ right: 0, left: 'auto' }}>
                                  {item.status !== 'paid' && (
                                    <button 
                                      className="dropdown-item text-success"
                                      onClick={() => handleMarkAsPaid(item)}
                                    >
                                      <CheckCircle size={14} /> Tahsil Edildi
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
                <FileText className="empty-state-icon" />
                <h3 className="empty-state-title">Bekleyen alacak bulunamadı</h3>
                <p className="empty-state-description">Şu an için sisteme kayıtlı bir tahsilat planı bulunmuyor.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <Calendar size={48} className="text-tertiary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Takvim Görünümü Yapım Aşamasında</h3>
            <p className="text-secondary max-w-md">
              Aylık tahsilat takvimi görünümü Novarion Finans'ın sonraki güncellemesinde aktif olacaktır. 
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
        defaultDirection="receivable"
      />
    </div>
  );
}
