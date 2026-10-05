// ============================================
// Novarion Finans — Contact Modal
// ============================================

import { useState, useEffect } from 'react';
import { X, Building2, User, Phone, Mail, Hash, MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Contact } from '@/types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactToEdit?: Contact | null;
}

export default function ContactModal({
  isOpen,
  onClose,
  contactToEdit,
}: ContactModalProps) {
  const { addContact, updateContact } = useStore();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'customer' | 'supplier' | 'both'>('customer');
  const [taxNumber, setTaxNumber] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (contactToEdit) {
      setName(contactToEdit.name);
      setTitle(contactToEdit.title || '');
      setType(contactToEdit.type);
      setTaxNumber(contactToEdit.tax_number || '');
      setTaxOffice(contactToEdit.tax_office || '');
      setPhone(contactToEdit.phone || '');
      setEmail(contactToEdit.email || '');
      setAddress(contactToEdit.address || '');
    } else {
      setName('');
      setTitle('');
      setType('customer');
      setTaxNumber('');
      setTaxOffice('');
      setPhone('');
      setEmail('');
      setAddress('');
    }
  }, [contactToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      alert('Lütfen cari/firma adı girin');
      return;
    }

    const contactData = {
      name,
      title,
      type,
      tax_number: taxNumber,
      tax_office: taxOffice,
      phone,
      email,
      address,
      balance: contactToEdit ? contactToEdit.balance : 0, // Preserve balance if editing, else 0
      currency: '₺',
      is_active: true,
    };

    if (contactToEdit) {
      updateContact(contactToEdit.id, contactData);
    } else {
      addContact(contactData);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        
        <div className="modal-header">
          <h2 className="modal-title">
            {contactToEdit ? 'Cariyi Düzenle' : 'Yeni Cari Ekle'}
          </h2>
          <button className="btn btn-ghost btn-icon sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            
            <div className="form-group mb-0">
              <label className="form-label">Cari Türü</label>
              <div className="flex bg-tertiary p-1 rounded-md mb-2">
                <button 
                  type="button"
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${type === 'customer' ? 'bg-secondary shadow-sm font-medium text-info' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setType('customer')}
                >
                  <User size={14} className="inline-block mr-1" /> Müşteri
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${type === 'supplier' ? 'bg-secondary shadow-sm font-medium text-warning' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setType('supplier')}
                >
                  <Building2 size={14} className="inline-block mr-1" /> Tedarikçi
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${type === 'both' ? 'bg-secondary shadow-sm font-medium' : 'text-secondary hover:text-primary'}`}
                  onClick={() => setType('both')}
                >
                  Her İkisi
                </button>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              <div className="form-group mb-0">
                <label className="form-label">Cari / Firma Adı (Kısa)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Örn: Novarion A.Ş."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Resmi Unvan (Opsiyonel)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Örn: Novarion Danışmanlık ve Ticaret A.Ş."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              <div className="form-group mb-0">
                <label className="form-label">Vergi Numarası / TCKN</label>
                <div style={{ position: 'relative' }}>
                  <Hash size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: 36 }}
                    placeholder="10 Haneli VKN veya 11 Haneli TCKN"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Vergi Dairesi</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Örn: Zincirlikuyu"
                  value={taxOffice}
                  onChange={(e) => setTaxOffice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              <div className="form-group mb-0">
                <label className="form-label">Telefon</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: 36 }}
                    placeholder="+90 555 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">E-posta</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                  <input 
                    type="email" 
                    className="form-input" 
                    style={{ paddingLeft: 36 }}
                    placeholder="ornek@firma.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Açık Adres</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                <textarea 
                  className="form-input" 
                  style={{ paddingLeft: 36, minHeight: 80, resize: 'vertical' }}
                  placeholder="Fatura adresi..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn btn-primary">
              {contactToEdit ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
