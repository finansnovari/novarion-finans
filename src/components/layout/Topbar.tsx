// ============================================
// Novarion Finans — Topbar Component
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  Menu,
  LogOut,
  User,
  ChevronDown,
  X,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, formatDate } from '@/utils/helpers';

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const {
    theme, toggleTheme,
    currentUser, logout,
    notifications, markNotificationRead, markAllNotificationsRead,
    setMobileSidebar,
  } = useStore();

  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setShowQuickAdd(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard shortcut: Ctrl+K for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.link) navigate(notif.link);
    setShowNotifications(false);
  };

  const notifTypeIcon = {
    error: '🔴',
    warning: '🟡',
    info: '🔵',
    success: '🟢',
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="hamburger-btn btn btn-ghost btn-icon"
            onClick={() => setMobileSidebar(true)}
            aria-label="Menüyü aç"
          >
            <Menu size={20} />
          </button>
          <h1 className="topbar-title">{title}</h1>
        </div>

        <div className="topbar-right">
          {/* Search */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setShowSearch(true)}
            aria-label="Ara"
          >
            <Search size={18} />
          </button>

          {/* Quick Add */}
          <div className="dropdown" ref={quickAddRef}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
            >
              <Plus size={16} />
              <span className="sidebar-nav-label">Hızlı Ekle</span>
            </button>
            {showQuickAdd && (
              <div className="dropdown-menu" style={{ minWidth: 200 }}>
                <button className="dropdown-item" onClick={() => { navigate('/islemler?yeni=gelir'); setShowQuickAdd(false); }}>
                  <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
                  Gelir Ekle
                </button>
                <button className="dropdown-item" onClick={() => { navigate('/islemler?yeni=gider'); setShowQuickAdd(false); }}>
                  <TrendingDown size={16} style={{ color: 'var(--color-error)' }} />
                  Gider Ekle
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { navigate('/odemeler?yeni=true'); setShowQuickAdd(false); }}>
                  <Plus size={16} />
                  Ödeme Planı
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={toggleTheme}
            aria-label="Temayı değiştir"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notifications */}
          <div className="dropdown" ref={notifRef}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Bildirimler"
              style={{ position: 'relative' }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: 'var(--color-error)',
                    color: 'white',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="dropdown-menu" style={{ minWidth: 340, maxHeight: 400, overflowY: 'auto' }}>
                <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Bildirimler</span>
                  {unreadCount > 0 && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={markAllNotificationsRead}
                      style={{ fontSize: 'var(--text-xs)' }}
                    >
                      Tümünü okundu işaretle
                    </button>
                  )}
                </div>
                <div className="dropdown-divider" />
                {notifications.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                    Bildirim yok
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      className="dropdown-item"
                      onClick={() => handleNotificationClick(notif)}
                      style={{
                        padding: '10px 12px',
                        opacity: notif.is_read ? 0.6 : 1,
                        background: notif.is_read ? 'transparent' : 'rgba(20, 80, 58, 0.04)',
                      }}
                    >
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{notifTypeIcon[notif.type]}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{notif.title}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: 4 }}>
                          {formatDate(notif.created_at)}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="dropdown" ref={userRef}>
            <button
              className="btn btn-ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ gap: 8 }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-brand-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                }}
              >
                {currentUser?.full_name?.charAt(0) || 'N'}
              </div>
              <span className="sidebar-nav-label" style={{ fontSize: 'var(--text-sm)' }}>
                {currentUser?.full_name || 'Kullanıcı'}
              </span>
              <ChevronDown size={14} className="sidebar-nav-label" />
            </button>
            {showUserMenu && (
              <div className="dropdown-menu">
                <div style={{ padding: '8px 12px' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{currentUser?.full_name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{currentUser?.email}</div>
                  <span className="badge badge-info" style={{ marginTop: 4 }}>
                    {currentUser?.role === 'admin' ? 'Yönetici' : currentUser?.role === 'accountant' ? 'Muhasebeci' : 'Görüntüleyici'}
                  </span>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { navigate('/ayarlar'); setShowUserMenu(false); }}>
                  <User size={16} />
                  Profil
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { logout(); navigate('/giris'); }} style={{ color: 'var(--color-error)' }}>
                  <LogOut size={16} />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && (
        <div className="modal-overlay" onClick={() => setShowSearch(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 560, marginTop: '-20vh' }}
          >
            <div style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Search size={20} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              <input
                type="text"
                className="form-input"
                placeholder="İşlem, cari, hesap ara..."
                autoFocus
                style={{ border: 'none', boxShadow: 'none', padding: 0, fontSize: 'var(--text-md)' }}
              />
              <button className="btn btn-ghost btn-icon sm" onClick={() => setShowSearch(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="dropdown-divider" />
            <div style={{ padding: 'var(--space-4)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
              Aramak için yazmaya başlayın...
            </div>
          </div>
        </div>
      )}
    </>
  );
}
