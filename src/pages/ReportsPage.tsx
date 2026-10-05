import React, { useState } from 'react';
import { FileText, Download, Calendar as CalendarIcon, Filter, Search } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/utils/helpers';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ReportsPage() {
  const { contacts, transactions, payments } = useStore();
  const [selectedContact, setSelectedContact] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExportPDF = () => {
    if (!selectedContact) {
      alert('Lütfen raporlanacak firmayı seçin');
      return;
    }

    const sanitizeForPDF = (text: string) => {
      if (!text) return '';
      return String(text)
        .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
        .replace(/Ü/g, 'U').replace(/ü/g, 'u')
        .replace(/Ş/g, 'S').replace(/ş/g, 's')
        .replace(/İ/g, 'I').replace(/ı/g, 'i')
        .replace(/Ö/g, 'O').replace(/ö/g, 'o')
        .replace(/Ç/g, 'C').replace(/ç/g, 'c')
        .replace(/₺/g, 'TL');
    };

    const contact = contacts.find(c => c.id === selectedContact);
    if (!contact) return;

    // Filter data
    const contactTransactions = transactions.filter(t => t.contact_id === selectedContact);
    const contactPayments = payments.filter(p => p.contact_id === selectedContact);

    // Apply date filters if any
    let filteredTransactions = contactTransactions;
    if (startDate) {
      filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= new Date(endDate));
    }

    const doc = new jsPDF();
    
    // --- TOP HEADER ---
    doc.setFillColor(20, 80, 58); // #14503A Dark Green
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('NOVARION', 15, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(201, 168, 76); // Gold #C9A84C
    doc.text('HORECA & SUPPLY SOLUTIONS', 15, 33);
    
    doc.rect(15, 35, 60, 1, 'F'); // Gold line under left text

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'normal');
    doc.text(sanitizeForPDF('CARİ EKSTRE'), 195, 25, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(sanitizeForPDF(`Düzenleme: ${formatDate(new Date().toISOString())}`), 195, 33, { align: 'right' });

    doc.setFillColor(201, 168, 76);
    doc.rect(0, 45, 210, 2, 'F');

    // --- CUSTOMER BLOCK ---
    doc.setFillColor(253, 251, 247); // Light beige
    doc.rect(15, 55, 180, 15, 'F');
    doc.setFillColor(201, 168, 76);
    doc.rect(15, 55, 3, 15, 'F'); // Gold left border

    doc.setFontSize(10);
    doc.setTextColor(201, 168, 76);
    doc.setFont('helvetica', 'bold');
    doc.text('SAYIN', 22, 64);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(sanitizeForPDF(contact.name.toUpperCase()), 38, 64);

    // --- TABLE DATA PREPARATION ---
    filteredTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    const tableData = filteredTransactions.map(t => {
      const isIncome = t.type === 'income';
      const isExpense = t.type === 'expense';
      
      const borc = isExpense ? t.amount : 0;
      const alacak = isIncome ? t.amount : 0;
      
      runningBalance += (borc - alacak);
      
      if (isIncome) totalIncome += t.amount;
      if (isExpense) totalExpense += t.amount;

      return [
        formatDate(t.date),
        '-', // BELGE NO
        sanitizeForPDF(t.description || '-'),
        borc > 0 ? sanitizeForPDF(formatCurrency(borc, '₺')) : '',
        alacak > 0 ? sanitizeForPDF(formatCurrency(alacak, '₺')) : '',
        sanitizeForPDF(formatCurrency(runningBalance, '₺'))
      ];
    });

    // --- TABLE DRAW ---
    autoTable(doc, {
      startY: 80,
      head: [[
        sanitizeForPDF('TARİH'), 
        sanitizeForPDF('BELGE NO'),
        sanitizeForPDF('AÇIKLAMA'), 
        sanitizeForPDF('BORÇ'), 
        sanitizeForPDF('ALACAK'), 
        sanitizeForPDF('BAKİYE')
      ]],
      body: tableData,
      headStyles: { fillColor: [20, 80, 58], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [253, 251, 247] },
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 4 },
      columnStyles: {
        3: { halign: 'right', fontStyle: 'italic' },
        4: { halign: 'right', fontStyle: 'italic' },
        5: { halign: 'right', fontStyle: 'bold' }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // --- GOLD LINE BELOW TABLE ---
    doc.setFillColor(201, 168, 76);
    doc.rect(15, finalY + 5, 180, 1, 'F');
    doc.rect(15, finalY + 7, 180, 2, 'F');

    // --- FOOTER INFO ---
    const footerY = finalY + 20;
    
    doc.setFontSize(11);
    doc.setTextColor(20, 80, 58);
    doc.setFont('helvetica', 'bold');
    doc.text('NOVARION SUPPLY', 15, footerY);
    
    doc.setFontSize(9);
    doc.setTextColor(201, 168, 76);
    doc.setFont('helvetica', 'normal');
    doc.text('HORECA & SUPPLY SOLUTIONS', 15, footerY + 6);

    doc.setFontSize(8);
    doc.setTextColor(20, 80, 58);
    doc.setFont('helvetica', 'bold');
    doc.text('Tel ', 140, footerY);
    doc.text('E-posta ', 140, footerY + 5);
    doc.text('Web ', 140, footerY + 10);
    
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('+90 531 400 89 99', 148, footerY);
    doc.text('novarionsupply@gmail.com', 155, footerY + 5);
    doc.text('novarionsupply.com', 148, footerY + 10);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(sanitizeForPDF('Bu ekstre bilgilendirme amacli hazirlanmistir. Itirazlarinizi 7 gun icinde bildiriniz.'), 105, footerY + 25, { align: 'center' });

    // --- SUMMARY BOX ---
    const boxY = footerY + 35;
    const boxWidth = 80;
    const boxX = 115;
    
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(255, 255, 255);
    doc.rect(boxX, boxY, boxWidth, 24, 'FD'); 
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(sanitizeForPDF('Toplam Borç'), boxX + 4, boxY + 8);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(sanitizeForPDF(formatCurrency(totalExpense, '₺')), boxX + boxWidth - 4, boxY + 8, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(sanitizeForPDF('Toplam Alacak'), boxX + 4, boxY + 18);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(sanitizeForPDF(formatCurrency(totalIncome, '₺')), boxX + boxWidth - 4, boxY + 18, { align: 'right' });

    doc.setFillColor(20, 80, 58);
    doc.rect(boxX, boxY + 24, boxWidth, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(sanitizeForPDF('BAKİYE'), boxX + 4, boxY + 32);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(sanitizeForPDF(formatCurrency(Math.abs(runningBalance), '₺')), boxX + boxWidth - 4, boxY + 32, { align: 'right' });

    doc.save(`${contact.name.replace(/\s+/g, '_')}_Hesap_Ekstresi.pdf`);
  };

  const handleExportExcel = () => {
    if (!selectedContact) {
      alert('Lütfen raporlanacak firmayı seçin');
      return;
    }

    const contact = contacts.find(c => c.id === selectedContact);
    if (!contact) return;

    let filteredTransactions = transactions.filter(t => t.contact_id === selectedContact);
    if (startDate) {
      filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= new Date(endDate));
    }

    filteredTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = 0;
    
    const data = filteredTransactions.map(t => {
      const isIncome = t.type === 'income';
      const isExpense = t.type === 'expense';
      const borc = isExpense ? t.amount : 0;
      const alacak = isIncome ? t.amount : 0;
      runningBalance += (borc - alacak);

      return {
        'Tarih': formatDate(t.date),
        'Açıklama': t.description || '-',
        'Kategori / Tür': t.category_name || (isIncome ? 'Tahsilat' : 'Ödeme'),
        'Borç (Satış/Ödeme)': borc > 0 ? borc : null,
        'Alacak (Tahsilat)': alacak > 0 ? alacak : null,
        'Güncel Bakiye': runningBalance,
        'Para Birimi': 'TL'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ekstre');
    XLSX.writeFile(workbook, `${contact.name.replace(/\s+/g, '_')}_Hesap_Ekstresi.xlsx`);
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <Topbar title="Raporlar & Dışa Aktarım" />
      
      <main className="page-content overflow-y-auto">
        <div className="max-w-3xl mx-auto mt-6">
          <div className="card p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="text-brand" /> 
              Firma Cari Ekstresi Dışa Aktar
            </h2>
            
            <div className="space-y-6">
              <div className="form-group mb-0">
                <label className="form-label">Firma Seçin</label>
                <select 
                  className="form-input" 
                  value={selectedContact}
                  onChange={(e) => setSelectedContact(e.target.value)}
                >
                  <option value="">Firma seçin...</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
                <div className="form-group mb-0">
                  <label className="form-label">Başlangıç Tarihi</label>
                  <div style={{ position: 'relative' }}>
                    <CalendarIcon size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                    <input 
                      type="date" 
                      className="form-input" 
                      style={{ paddingLeft: 36 }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Bitiş Tarihi</label>
                  <div style={{ position: 'relative' }}>
                    <CalendarIcon size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                    <input 
                      type="date" 
                      className="form-input" 
                      style={{ paddingLeft: 36 }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-primary">
                <button 
                  className="btn btn-primary flex-1 py-3 text-base"
                  onClick={handleExportPDF}
                >
                  <Download size={18} />
                  PDF Olarak İndir
                </button>
                <button 
                  className="btn btn-secondary flex-1 py-3 text-base"
                  onClick={handleExportExcel}
                  style={{ borderColor: '#10B981', color: '#10B981' }}
                >
                  <Download size={18} />
                  Excel Olarak İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
