// ============================================
// Novarion Finans — Accounts Page
// ============================================

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Landmark, 
  CreditCard, 
  Wallet,
  ArrowLeftRight,
  Edit2,
  Trash2
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/utils/helpers';
import Topbar from '@/components/layout/Topbar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import AccountModal from '@/components/modals/AccountModal';
import type { Account } from '@/types';

export default function AccountsPage() {
  const { accounts, deleteAccount } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (acc.bank_name && acc.bank_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAccountIcon = (type: string) => {
    switch(type) {
      case 'bank': return <Landmark size={20} className="text-info" />;
      case 'credit_card': return <CreditCard size={20} className="text-warning" />;
      case 'cash': return <Wallet size={20} className="text-success" />;
      default: return <Landmark size={20} />;
    }
  };

  const getAccountTypeName = (type: string) => {
    switch(type) {
      case 'bank': return 'Banka Hesabı';
      case 'credit_card': return 'Kredi Kartı';
      case 'cash': return 'Nakit Kasa';
      default: return type;
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleDeleteClick = (acc: Account) => {
    setAccountToDelete(acc);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      deleteAccount(accountToDelete.id);
      setIsDeleteModalOpen(false);
      setAccountToDelete(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <Topbar title="Kasa ve Bankalar" />
      
      <main className="page-content overflow-y-auto">
        
        {/* Header & Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="search-input-wrapper" style={{ width: 300 }}>
            <Search />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Hesap adı veya banka ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <ArrowLeftRight size={16} />
              Transfer
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setAccountToEdit(null);
                setIsAccountModalOpen(true);
              }}
            >
              <Plus size={16} />
              Yeni Hesap Ekle
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="card mb-6" style={{ background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-primary-dark) 100%)', color: 'white', border: 'none' }}>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm opacity-80 mb-1">Toplam Bakiye</div>
              <div className="text-3xl font-bold font-display">{formatCurrency(totalBalance)}</div>
            </div>
            <div className="flex gap-6 opacity-80 text-sm">
              <div>
                <div className="mb-1">Banka & Kasa</div>
                <div className="font-semibold">{formatCurrency(accounts.filter(a => a.type !== 'credit_card').reduce((sum, a) => sum + a.balance, 0))}</div>
              </div>
              <div>
                <div className="mb-1">Kredi Kartları</div>
                <div className="font-semibold">{formatCurrency(accounts.filter(a => a.type === 'credit_card').reduce((sum, a) => sum + a.balance, 0))}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid-3">
          {filteredAccounts.map(account => (
            <div key={account.id} className="card relative flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-lg bg-tertiary" style={{ width: 40, height: 40, backgroundColor: 'var(--bg-tertiary)' }}>
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{account.name}</h3>
                    <p className="text-xs text-secondary">{getAccountTypeName(account.type)} {account.bank_name && `• ${account.bank_name}`}</p>
                  </div>
                </div>
                <div className="dropdown dropdown-hover">
                  <button className="btn btn-ghost btn-icon sm"><MoreVertical size={16} /></button>
                  <div className="dropdown-menu" style={{ right: 0, left: 'auto' }}>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setAccountToEdit(account);
                        setIsAccountModalOpen(true);
                      }}
                    >
                      <Edit2 size={14} /> Düzenle
                    </button>
                    <button className="dropdown-item"><ArrowLeftRight size={14} /> Transfer Yap</button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item text-error" onClick={() => handleDeleteClick(account)}>
                      <Trash2 size={14} /> Sil
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-primary">
                <div className="text-xs text-secondary mb-1">Güncel Bakiye</div>
                <div className={`text-xl font-bold ${account.balance < 0 ? 'text-error' : 'text-primary'}`}>
                  {formatCurrency(account.balance, account.currency)}
                </div>
                {account.iban && (
                  <div className="text-xs text-secondary mt-2 font-mono bg-tertiary p-1 rounded inline-block" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    {account.iban}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="empty-state">
            <Landmark className="empty-state-icon" />
            <h3 className="empty-state-title">Hesap bulunamadı</h3>
            <p className="empty-state-description">Arama kriterlerinize uygun hesap bulunamadı veya henüz hesap eklemediniz.</p>
            <button 
              className="btn btn-primary mt-4"
              onClick={() => {
                setAccountToEdit(null);
                setIsAccountModalOpen(true);
              }}
            >
              <Plus size={16} /> Yeni Hesap Ekle
            </button>
          </div>
        )}

      </main>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Hesabı Sil"
        message={`"${accountToDelete?.name}" hesabını silmek istediğinize emin misiniz? Bu hesaba bağlı işlemler varsa silme işlemi başarısız olabilir.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        accountToEdit={accountToEdit}
      />
    </div>
  );
}
