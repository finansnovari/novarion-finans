// ============================================
// Novarion Finans — Transactions Page
// ============================================

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  MoreHorizontal,
  Edit2,
  Trash2
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/utils/helpers';
import Topbar from '@/components/layout/Topbar';
import { useSearchParams } from 'react-router-dom';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import TransactionModal from '@/components/modals/TransactionModal';
import type { Transaction } from '@/types';

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [defaultTransactionType, setDefaultTransactionType] = useState<'income' | 'expense'>('income');

  useEffect(() => {
    const yeni = searchParams.get('yeni');
    if (yeni === 'gelir' || yeni === 'gider') {
      const typeMap = { gelir: 'income', gider: 'expense' } as const;
      setDefaultTransactionType(typeMap[yeni]);
      setTransactionToEdit(null);
      setIsTransactionModalOpen(true);
      
      // Remove query param without reloading page
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      (t.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.category_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'income': return <TrendingUp size={16} className="text-success" />;
      case 'expense': return <TrendingDown size={16} className="text-error" />;
      default: return null;
    }
  };

  const getTypeName = (type: string) => {
    switch(type) {
      case 'income': return 'Gelir';
      case 'expense': return 'Gider';
      default: return type;
    }
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <Topbar title="Gelir / Gider İşlemleri" />
      
      <main className="page-content flex flex-col flex-1 overflow-hidden" style={{ paddingBottom: 0 }}>
        
        {/* Header & Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="search-input-wrapper" style={{ width: 280 }}>
              <Search />
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="İşlem, kategori veya cari ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex bg-tertiary p-1 rounded-md" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filterType === 'all' ? 'bg-secondary shadow-sm font-medium' : 'text-secondary hover:text-primary'}`}
                onClick={() => setFilterType('all')}
              >
                Tümü
              </button>
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filterType === 'income' ? 'bg-secondary shadow-sm font-medium text-success' : 'text-secondary hover:text-primary'}`}
                onClick={() => setFilterType('income')}
              >
                Gelirler
              </button>
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filterType === 'expense' ? 'bg-secondary shadow-sm font-medium text-error' : 'text-secondary hover:text-primary'}`}
                onClick={() => setFilterType('expense')}
              >
                Giderler
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
                setTransactionToEdit(null);
                setDefaultTransactionType('income');
                setIsTransactionModalOpen(true);
              }}
            >
              <Plus size={16} />
              Yeni İşlem
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="table-container flex-1 mb-6 relative">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Tarih</th>
                <th>İşlem Detayı</th>
                <th>Kategori</th>
                <th>Hesap</th>
                <th className="text-right">Tutar</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? filteredTransactions.map(tr => (
                <tr key={tr.id}>
                  <td className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      {getTypeIcon(tr.type)}
                    </div>
                  </td>
                  <td>{formatDate(tr.date)}</td>
                  <td>
                    <div className="font-medium">{tr.description || 'İşlem'}</div>
                    {tr.contact_name && <div className="text-xs text-secondary mt-1">{tr.contact_name}</div>}
                  </td>
                  <td>
                    <span className="badge badge-neutral">{tr.category_name || getTypeName(tr.type)}</span>
                  </td>
                  <td>{tr.account_name}</td>
                  <td className="text-right">
                    <span className={`table-amount ${tr.type === 'income' ? 'positive' : tr.type === 'expense' ? 'negative' : ''}`}>
                      {tr.type === 'expense' ? '-' : tr.type === 'income' ? '+' : ''}
                      {formatCurrency(tr.amount, tr.currency)}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown dropdown-hover">
                      <button className="btn btn-ghost btn-icon sm"><MoreHorizontal size={16} /></button>
                      <div className="dropdown-menu" style={{ right: 0, left: 'auto' }}>
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            setTransactionToEdit(tr);
                            setIsTransactionModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} /> Düzenle
                        </button>
                        <div className="dropdown-divider" />
                        <button className="dropdown-item text-error" onClick={() => handleDeleteClick(tr.id)}>
                          <Trash2 size={14} /> Sil
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state py-12">
                      <ArrowLeftRight className="empty-state-icon" />
                      <h3 className="empty-state-title">İşlem bulunamadı</h3>
                      <p className="empty-state-description">Arama veya filtreleme kriterlerinize uygun finansal işlem bulunamadı.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="İşlemi Sil"
        message="Bu finansal işlemi silmek istediğinize emin misiniz? Bu eylem hesap bakiyesini etkileyecektir ve geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        transactionToEdit={transactionToEdit}
        defaultType={defaultTransactionType}
      />
    </div>
  );
}
