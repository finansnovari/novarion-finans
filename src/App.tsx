import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { useStore } from '@/store/useStore';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AccountsPage from '@/pages/AccountsPage';
import TransactionsPage from '@/pages/TransactionsPage';
import ContactsPage from '@/pages/ContactsPage';
import PayablesPage from '@/pages/PayablesPage';
import ReceivablesPage from '@/pages/ReceivablesPage';
import ReportsPage from '@/pages/ReportsPage';

// Placeholder pages for incomplete routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col flex-1 h-full w-full">
    <div className="topbar">
      <h1 className="topbar-title">{title}</h1>
    </div>
    <main className="page-content flex items-center justify-center">
      <div className="empty-state">
        <h2 className="empty-state-title">{title} Modülü</h2>
        <p className="empty-state-description">Bu modül henüz geliştirme aşamasındadır.</p>
      </div>
    </main>
  </div>
);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        useStore.getState().initSupabase();
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        useStore.getState().initSupabase();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/giris" 
          element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        
        <Route element={session ? <AppLayout /> : <Navigate to="/giris" replace />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route path="/islemler" element={<TransactionsPage />} />
          <Route path="/hesaplar" element={<AccountsPage />} />
          <Route path="/cariler" element={<ContactsPage />} />
          <Route path="/odemeler" element={<PayablesPage />} />
          <Route path="/tahsilatlar" element={<ReceivablesPage />} />
          
          <Route path="/raporlar" element={<ReportsPage />} />
          <Route path="/ayarlar" element={<Placeholder title="Ayarlar" />} />
        </Route>
        
        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
