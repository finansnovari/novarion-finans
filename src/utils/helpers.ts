// ============================================
// Novarion Finans — Utility Functions
// ============================================

/**
 * Format currency with Turkish locale
 */
export function formatCurrency(amount: number, currency = '₺'): string {
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  
  const sign = amount < 0 ? '-' : '';
  return `${sign}${formatted} ${currency}`;
}

/**
 * Format number with Turkish locale
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('tr-TR').format(value);
}

/**
 * Format date as DD.MM.YYYY
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Format date as DD.MM.YYYY HH:mm
 */
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Parse DD.MM.YYYY to ISO string
 */
export function parseDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('.');
  return `${year}-${month}-${day}`;
}

/**
 * Get relative time description
 */
export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Yarın';
  if (diffDays === -1) return 'Dün';
  if (diffDays > 0 && diffDays <= 7) return `${diffDays} gün sonra`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} gün önce`;
  return formatDate(dateStr);
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date(new Date().toDateString());
}

/**
 * Check if date is within N days
 */
export function isDueWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return date >= now && date <= futureDate;
}

/**
 * Get status badge class
 */
export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    completed: 'badge-success',
    paid: 'badge-success',
    pending: 'badge-warning',
    partial: 'badge-info',
    overdue: 'badge-error',
    cancelled: 'badge-neutral',
  };
  return map[status] || 'badge-neutral';
}

/**
 * Get status label in Turkish
 */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    completed: 'Tamamlandı',
    paid: 'Ödendi',
    pending: 'Bekliyor',
    partial: 'Kısmi Ödendi',
    overdue: 'Gecikmiş',
    cancelled: 'İptal',
  };
  return map[status] || status;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get date range helpers
 */
export function getDateRangePreset(preset: string): { start: string; end: string } {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  switch (preset) {
    case 'today':
      return { start: today, end: today };
    case 'this_week': {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      return { start: startOfWeek.toISOString().split('T')[0], end: today };
    }
    case 'this_month': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: startOfMonth.toISOString().split('T')[0], end: today };
    }
    case 'last_month': {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        start: startOfLastMonth.toISOString().split('T')[0],
        end: endOfLastMonth.toISOString().split('T')[0],
      };
    }
    case 'this_year': {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return { start: startOfYear.toISOString().split('T')[0], end: today };
    }
    default:
      return { start: today, end: today };
  }
}

/**
 * Calculate percentage change
 */
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * CN - Combine class names
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
