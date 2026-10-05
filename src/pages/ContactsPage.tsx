// ============================================
// Novarion Finans — Contacts Page
// ============================================

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Users, 
  Building2, 
  Phone, 
  Mail,
  Edit2,
  Trash2,
  FileText
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency, getStatusBadgeClass } from '@/utils/helpers';
import Topbar from '@/components/layout/Topbar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ContactModal from '@/components/modals/ContactModal';
import type { Contact } from '@/types';

export default function ContactsPage() {
  const { contacts, deleteContact } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      (c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.tax_number?.includes(searchTerm));
      
    const matchesType = filterType === 'all' ? true : c.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getContactTypeLabel = (type: string) => {
    switch(type) {
      case 'customer': return 'Müşteri';
      case 'supplier': return 'Tedarikçi';
      case 'both': return 'Müşteri & Tedarikçi';
      default: return type;
    }
  };

  const getContactTypeClass = (type: string) => {
    switch(type) {
      case 'customer': return 'badge-info';
      case 'supplier': return 'badge-warning';
      case 'both': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  const handleDeleteClick = (id: string) => {
    setContactToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete);
      setIsDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <Topbar title="Cari Hesaplar" />
      
      <main className="page-content overflow-y-auto">
        
        {/* Header & Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="search-input-wrapper" style={{ width: 280 }}>
              <Search />
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Firma adı, unvan veya VKN ara..." 
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
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filterType === 'customer' ? 'bg-secondary shadow-sm font-medium text-info' : 'text-secondary hover:text-primary'}`}
                onClick={() => setFilterType('customer')}
              >
                Müşteriler
              </button>
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filterType === 'supplier' ? 'bg-secondary shadow-sm font-medium text-warning' : 'text-secondary hover:text-primary'}`}
                onClick={() => setFilterType('supplier')}
              >
                Tedarikçiler
              </button>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="btn btn-secondary">
              <Filter size={16} />
              Gelişmiş Filtre
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setContactToEdit(null);
                setIsContactModalOpen(true);
              }}
            >
              <Plus size={16} />
              Yeni Cari Ekle
            </button>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid-3">
          {filteredContacts.length > 0 ? filteredContacts.map(contact => (
            <div key={contact.id} className="card relative flex flex-col hover:border-brand">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="flex items-center justify-center rounded-lg bg-tertiary shrink-0" style={{ width: 44, height: 44, backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-brand-primary)' }}>
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary truncate" title={contact.name}>{contact.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${getContactTypeClass(contact.type)}`}>
                        {getContactTypeLabel(contact.type)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="dropdown dropdown-hover">
                  <button className="btn btn-ghost btn-icon sm"><MoreVertical size={16} /></button>
                  <div className="dropdown-menu" style={{ right: 0, left: 'auto' }}>
                    <button className="dropdown-item"><FileText size={14} /> Ekstre Görüntüle</button>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setContactToEdit(contact);
                        setIsContactModalOpen(true);
                      }}
                    >
                      <Edit2 size={14} /> Düzenle
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item text-error" onClick={() => handleDeleteClick(contact.id)}>
                      <Trash2 size={14} /> Sil
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4 text-sm text-secondary">
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} /> <span>{contact.phone}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} /> <span className="truncate">{contact.email}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-auto pt-4 border-t border-primary flex justify-between items-end">
                <div>
                  <div className="text-xs text-secondary mb-1">Cari Bakiye</div>
                  <div className={`text-lg font-bold ${contact.balance > 0 ? 'text-success' : contact.balance < 0 ? 'text-error' : 'text-primary'}`}>
                    {contact.balance > 0 ? 'Alacaklı' : contact.balance < 0 ? 'Borçlu' : 'Kapalı'}
                  </div>
                </div>
                <div className={`text-xl font-bold font-display ${contact.balance > 0 ? 'text-success' : contact.balance < 0 ? 'text-error' : 'text-primary'}`}>
                  {formatCurrency(Math.abs(contact.balance))}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3">
              <div className="empty-state py-12">
                <Users className="empty-state-icon" />
                <h3 className="empty-state-title">Cari kayıt bulunamadı</h3>
                <p className="empty-state-description">Arama kriterlerinize uygun firma bulunamadı veya henüz cari eklemediniz.</p>
                <button 
                  className="btn btn-primary mt-4"
                  onClick={() => {
                    setContactToEdit(null);
                    setIsContactModalOpen(true);
                  }}
                >
                  <Plus size={16} /> Yeni Cari Ekle
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Cariyi Sil"
        message="Bu cari kaydı silmek istediğinize emin misiniz? Cariyi sildiğinizde, ona bağlı geçmiş işlemler ve planlı ödemeler etkilenmez, ancak cari detayı kaybolur."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contactToEdit={contactToEdit}
      />
    </div>
  );
}
