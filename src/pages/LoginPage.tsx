import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // If successful, the auth listener in App.tsx will automatically redirect
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'E-posta veya şifre hatalı!' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden p-8" style={{ borderTop: '4px solid var(--color-primary)' }}>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ color: 'var(--text-primary)' }}>Yönetici Girişi</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Novarion Finans paneline erişmek için giriş yapın.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 flex items-start gap-3" style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)' }}>
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="form-group mb-0">
            <label className="form-label">E-posta Adresi</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: 40 }}
                placeholder="admin@novarion.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Şifre</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: 40 }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-6 flex justify-center py-3"
            disabled={loading}
            style={{ marginTop: '32px' }}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <p>Bu alan 256-bit şifreleme ile korunmaktadır.</p>
          <p className="mt-1">Yetkisiz erişim girişimleri kayıt altına alınmaktadır.</p>
        </div>
      </div>
    </div>
  );
}
