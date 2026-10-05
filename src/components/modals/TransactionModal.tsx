// ============================================
// Novarion Finans — Transaction Modal
// ============================================

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, DollarSign, Type, FileText } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Transaction } from '@/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
  defaultType?: 'income' | 'expense';
}

export default function TransactionModal({
  isOpen,
  onClose,
  transactionToEdit,
  defaultType = 'income',
}: TransactionModalProps) {
  const { 
    addTransaction, 
    updateTransaction,
    accounts,
    categories,
    contacts
  } = useStore();

  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [contactId, setContactId] = useState('');
  const [description, setDescription] = useState('');
  
  // Removed transfer state

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type as any);
      setAmount(transactionToEdit.amount.toString());
      setDate(transactionToEdit.date.split('T')[0]);
      setAccountId(transactionToEdit.account_id);
      setCategoryId(transactionToEdit.category_id || '');
      setContactId(transactionToEdit.contact_id || '');
      setDescription(transactionToEdit.description || '');
    } else {
      // Reset form
      setType(defaultType);
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setAccountId(accounts[0]?.id || '');
      setCategoryId('');
      setContactId('');
      setDescription('');
    }
  }, [transactionToEdit, defaultType, isOpen, accounts]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Lütfen geçerli bir tutar girin');
      return;
    }
    if (!accountId) {
      alert('Lütfen hesap seçin');
      return;
    }

    const selectedAccount = accounts.find(a => a.id === accountId);
    const selectedCategory = categories.find(c => c.id === categoryId);
    const selectedContact = contacts.find(c => c.id === contactId);

    const transactionData = {
      type,
      amount: Number(amount),
      currency: selectedAccount?.currency || '₺',
      date: new Date(date).toISOString(),
      account_id: accountId,
      category_id: categoryId,
      contact_id: contactId,
      description,
      status: 'completed' as const,
      // Joined fields
      account_name: selectedAccount?.name,
      category_name: selectedCategory?.name,
      contact_name: selectedContact?.name,
      is_recurring: false,
    };

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        
        <div className="modal-header">
          <h2 className="modal-title">
            {transactionToEdit ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}
          </h2>
          <button className="btn btn-ghost btn-icon sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            
            {!transactionToEdit && (
              <div className="flex bg-tertiary p-1 rounded-md mb-2">
                <button 
                  type="button"
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${type === 'income' ? 'bg-secondary shadow-sm font-medium text-success' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setType('income')}
                >
                  Gelir
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${type === 'expense' ? 'bg-secondary shadow-sm font-medium text-error' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setType('expense')}
                >
                  Gider
                </button>
              </div>
            )}

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              <div className="form-group mb-0">
                <label className="form-label">Tutar</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    style={{ paddingLeft: 36, fontSize: 'var(--text-lg)', fontWeight: 600, color: type === 'expense' ? 'var(--color-error)' : type === 'income' ? 'var(--color-success)' : 'var(--text-primary)' }}
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Tarih</label>
                <div style={{ position: 'relative' }}>
                  <CalendarIcon size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                  <input 
                    type="date" 
                    className="form-input" 
                    style={{ paddingLeft: 36 }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Hesap</label>
              <select 
                className="form-input" 
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
              >
                <option value="" disabled>Hesap seçin</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
                <div className="form-group mb-0">
                  <label className="form-label">Kategori</label>
                  <select 
                    className="form-input" 
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Kategori Seçin</option>
                    {filteredCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">İlgili Cari</label>
                  <select 
                    className="form-input" 
                    value={contactId}
                    onChange={(e) => setContactId(e.target.value)}
                  >
                    <option value="">Cari Seçin</option>
                    {contacts.map(con => (
                      <option key={con.id} value={con.id}>{con.name}</option>
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
                  placeholder="İşlem açıklaması"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn btn-primary">
              {transactionToEdit ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
