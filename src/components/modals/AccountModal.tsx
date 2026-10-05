// ============================================
// Novarion Finans — Account Modal
// ============================================

import { useState, useEffect } from 'react';
import { X, Landmark, Hash, CreditCard, Wallet } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Account } from '@/types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountToEdit?: Account | null;
}

export default function AccountModal({
  isOpen,
  onClose,
  accountToEdit,
}: AccountModalProps) {
  const { addAccount, updateAccount } = useStore();

  const [name, setName] = useState('');
  const [type, setType] = useState<'bank' | 'cash' | 'credit_card'>('bank');
  const [balance, setBalance] = useState('');
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');

  useEffect(() => {
    if (accountToEdit) {
      setName(accountToEdit.name);
      setType(accountToEdit.type);
      setBalance(accountToEdit.balance.toString());
      setBankName(accountToEdit.bank_name || '');
      setIban(accountToEdit.iban || '');
    } else {
      setName('');
      setType('bank');
      setBalance('0');
      setBankName('');
      setIban('');
    }
  }, [accountToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      alert('Lütfen hesap adı girin');
      return;
    }

    const accountData = {
      name,
      type,
      currency: '₺',
      balance: Number(balance) || 0,
      bank_name: bankName,
      iban,
      is_active: true,
    };

    if (accountToEdit) {
      updateAccount(accountToEdit.id, accountData);
    } else {
      addAccount(accountData);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        
        <div className="modal-header">
          <h2 className="modal-title">
            {accountToEdit ? 'Hesabı Düzenle' : 'Yeni Hesap Ekle'}
          </h2>
          <button className="btn btn-ghost btn-icon sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            
            <div className="form-group mb-0">
              <label className="form-label">Hesap Türü</label>
              <div className="flex bg-tertiary p-1 rounded-md mb-2">
                <button 
                  type="button"
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${type === 'bank' ? 'bg-secondary shadow-sm font-medium text-info' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setType('bank')}
                >
                  <Landmark size={14} className="inline-block mr-1" /> Banka
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${type === 'cash' ? 'bg-secondary shadow-sm font-medium text-success' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setType('cash')}
                >
                  <Wallet size={14} className="inline-block mr-1" /> Kasa
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${type === 'credit_card' ? 'bg-secondary shadow-sm font-medium text-warning' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setType('credit_card')}
                >
                  <CreditCard size={14} className="inline-block mr-1" /> Kredi Kartı
                </button>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              <div className="form-group mb-0">
                <label className="form-label">Hesap Adı</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Örn: Garanti Ana Hesap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Açılış Bakiyesi</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-tertiary)' }}>₺</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    style={{ paddingLeft: 28 }}
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {(type === 'bank' || type === 'credit_card') && (
              <>
                <div className="form-group mb-0">
                  <label className="form-label">Banka Adı (Opsiyonel)</label>
                  <div style={{ position: 'relative' }}>
                    <Landmark size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ paddingLeft: 36 }}
                      placeholder="Örn: Garanti BBVA"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">IBAN / Hesap No (Opsiyonel)</label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ paddingLeft: 36 }}
                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn btn-primary">
              {accountToEdit ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
