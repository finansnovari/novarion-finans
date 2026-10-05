// ============================================
// Novarion Finans — Payment Modal (Planlı Ödeme / Tahsilat)
// ============================================

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, DollarSign, Type, FileText, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Payment } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentToEdit?: Payment | null;
  defaultDirection?: 'payable' | 'receivable';
}

export default function PaymentModal({
  isOpen,
  onClose,
  paymentToEdit,
  defaultDirection = 'payable',
}: PaymentModalProps) {
  const { 
    addPayment, 
    updatePayment,
    contacts,
    accounts
  } = useStore();

  const [direction, setDirection] = useState<'payable' | 'receivable'>(defaultDirection);
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [contactId, setContactId] = useState('');
  const [accountId, setAccountId] = useState(''); // Optional, for planned account
  const [description, setDescription] = useState('');
  const [paymentType, setPaymentType] = useState<'cash' | 'check' | 'promissory_note' | 'transfer' | 'other'>('transfer');
  const [reminderNotes, setReminderNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  useEffect(() => {
    if (paymentToEdit) {
      setDirection(paymentToEdit.direction);
      setAmount(paymentToEdit.amount.toString());
      setDueDate(paymentToEdit.due_date.split('T')[0]);
      setContactId(paymentToEdit.contact_id);
      setAccountId(paymentToEdit.account_id || '');
      setDescription(paymentToEdit.description || '');
      setPaymentType(paymentToEdit.payment_type || 'transfer');
      setReminderNotes(paymentToEdit.reminder_notes || '');
      setIsRecurring(paymentToEdit.is_recurring || false);
      setRecurringInterval(paymentToEdit.recurring_interval || 'monthly');
    } else {
      setDirection(defaultDirection);
      setAmount('');
      
      // Default to today + 7 days
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDueDate(d.toISOString().split('T')[0]);
      
      setContactId('');
      setAccountId('');
      setDescription('');
      setPaymentType('transfer');
      setReminderNotes('');
      setIsRecurring(false);
      setRecurringInterval('monthly');
    }
  }, [paymentToEdit, defaultDirection, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Lütfen geçerli bir tutar girin');
      return;
    }
    if (!contactId) {
      alert('Lütfen bir cari seçin');
      return;
    }

    const selectedContact = contacts.find(c => c.id === contactId);
    const selectedAccount = accounts.find(a => a.id === accountId);

    const paymentData = {
      direction,
      type: direction,
      amount: Number(amount),
      paid_amount: paymentToEdit ? paymentToEdit.paid_amount : 0,
      currency: selectedAccount ? selectedAccount.currency : '₺',
      due_date: new Date(dueDate).toISOString(),
      contact_id: contactId,
      account_id: accountId || undefined,
      description,
      status: paymentToEdit ? paymentToEdit.status : 'pending' as const,
      payment_type: paymentType,
      reminder_notes: reminderNotes,
      is_recurring: isRecurring,
      recurring_interval: recurringInterval,
      // Joined fields
      contact_name: selectedContact?.name,
      account_name: selectedAccount?.name,
    };

    if (paymentToEdit) {
      updatePayment(paymentToEdit.id, paymentData);
    } else {
      addPayment(paymentData);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        
        <div className="modal-header">
          <h2 className="modal-title">
            {paymentToEdit ? 'Planlı Kaydı Düzenle' : 'Yeni Planlı Kayıt'}
          </h2>
          <button className="btn btn-ghost btn-icon sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            
            {!paymentToEdit && (
              <div className="flex bg-tertiary p-1 rounded-md mb-2">
                <button 
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-md transition-colors ${direction === 'payable' ? 'bg-secondary shadow-sm font-medium text-error' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setDirection('payable')}
                >
                  <ArrowUpRight size={16} /> Ödeme Planı (Çıkış)
                </button>
                <button 
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-md transition-colors ${direction === 'receivable' ? 'bg-secondary shadow-sm font-medium text-success' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setDirection('receivable')}
                >
                  <ArrowDownRight size={16} /> Tahsilat Planı (Giriş)
                </button>
              </div>
            )}

            <div className="form-group mb-0">
              <label className="form-label">İlgili Cari / Firma</label>
              <select 
                className="form-input" 
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                required
              >
                <option value="" disabled>Firma Seçin</option>
                {contacts.map(con => (
                  <option key={con.id} value={con.id}>{con.name}</option>
                ))}
              </select>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              <div className="form-group mb-0">
                <label className="form-label">Tutar</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    style={{ paddingLeft: 36, fontSize: 'var(--text-lg)', fontWeight: 600, color: direction === 'payable' ? 'var(--color-error)' : 'var(--color-success)' }}
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Vade Tarihi</label>
                <div style={{ position: 'relative' }}>
                  <CalendarIcon size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                  <input 
                    type="date" 
                    className="form-input" 
                    style={{ paddingLeft: 36 }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              <div className="form-group mb-0">
                <label className="form-label">Ödeme Yöntemi</label>
                <select 
                  className="form-input" 
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as any)}
                >
                  <option value="transfer">Havale / EFT</option>
                  <option value="cash">Nakit</option>
                  <option value="check">Çek</option>
                  <option value="promissory_note">Senet</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Planlanan Hesap (Opsiyonel)</label>
                <select 
                  className="form-input" 
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                >
                  <option value="">Belirtilmemiş</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Açıklama</label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: 36 }}
                  placeholder="Hizmet bedeli, fatura numarası vb."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Hatırlatma / Notlar</label>
              <textarea 
                className="form-input" 
                placeholder="Örn: Vadeden 2 gün önce müşteriyi ara."
                style={{ minHeight: 60, resize: 'vertical' }}
                value={reminderNotes}
                onChange={(e) => setReminderNotes(e.target.value)}
              />
            </div>

            <div className="form-group mb-0 p-4 bg-tertiary rounded-lg border border-primary">
              <label className="flex items-center gap-3 cursor-pointer mb-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-brand rounded border-primary bg-secondary"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <span className="font-medium">Düzenli Ödeme/Tahsilat Planı (Otomatik Tekrar)</span>
              </label>
              
              {isRecurring && (
                <div className="mt-3 pl-7">
                  <label className="form-label text-sm">Tekrar Sıklığı</label>
                  <select 
                    className="form-input text-sm"
                    value={recurringInterval}
                    onChange={(e) => setRecurringInterval(e.target.value as any)}
                  >
                    <option value="weekly">Her Hafta</option>
                    <option value="monthly">Her Ay</option>
                    <option value="yearly">Her Yıl</option>
                  </select>
                  <p className="text-xs text-secondary mt-2">
                    Bu kayıt "Ödendi" olarak işaretlendiğinde, sistem otomatik olarak bir sonraki vade için yeni bir kayıt oluşturacaktır.
                  </p>
                </div>
              )}
            </div>

          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn btn-primary">
              {paymentToEdit ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
