// ============================================
// Novarion Finans — Sidebar Component
// ============================================

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Users,
  CreditCard,
  HandCoins,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/helpers';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/islemler', icon: ArrowLeftRight, label: 'Gelir / Gider' },
  { to: '/hesaplar', icon: Landmark, label: 'Hesaplar' },
  { to: '/cariler', icon: Users, label: 'Cariler' },
  { to: '/odemeler', icon: CreditCard, label: 'Ödemeler' },
  { to: '/tahsilatlar', icon: HandCoins, label: 'Tahsilatlar' },
  { to: '/raporlar', icon: BarChart3, label: 'Raporlar' },
  { to: '/ayarlar', icon: Settings, label: 'Ayarlar' },
];

export default function Sidebar() {
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setMobileSidebar } = useStore();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn('sidebar-overlay', sidebarMobileOpen && 'visible')}
        onClick={() => setMobileSidebar(false)}
      />

      <aside
        className={cn(
          'sidebar',
          sidebarCollapsed && 'collapsed',
          sidebarMobileOpen && 'mobile-open'
        )}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">N</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">Novarion</span>
            <span className="sidebar-logo-subtitle">Finans Yönetimi</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn('sidebar-nav-item', isActive && 'active')
              }
              onClick={() => setMobileSidebar(false)}
            >
              <item.icon />
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Toggle */}
        <div className="sidebar-footer">
          <button 
            className="sidebar-toggle text-error" 
            style={{ marginBottom: '8px', color: 'var(--color-error)' }}
            onClick={async () => {
              const { supabase } = await import('@/lib/supabase');
              await supabase.auth.signOut();
            }}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span className="sidebar-nav-label" style={{ marginLeft: 8 }}>Çıkış Yap</span>}
          </button>
          
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!sidebarCollapsed && <span className="sidebar-nav-label" style={{ marginLeft: 8 }}>Daralt</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
