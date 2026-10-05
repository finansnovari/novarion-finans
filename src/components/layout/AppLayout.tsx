// ============================================
// Novarion Finans — App Layout
// ============================================

import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import ToastContainer from '@/components/ui/ToastContainer';

export default function AppLayout() {
  const { theme } = useStore();
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
}
