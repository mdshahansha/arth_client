/**
 * Format amount with dot thousand-separators (e.g., 1.378.200)
 * Matches the Figma design's number format exactly.
 */
export function formatAmount(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // Split integer and decimal parts
  const parts = absNum.toFixed(0).split('.');
  const intPart = parts[0];

  // Add dot separators for thousands
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format a transaction amount for display (e.g., "-326.800")
 */
export function formatTransactionAmount(amount: number | string, type: 'debit' | 'credit'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = formatAmount(Math.abs(num));
  return type === 'debit' ? `-${formatted}` : `+${formatted}`;
}

/**
 * Group transactions by date, returning human-readable headers.
 * "Today", "Yesterday", or "Monday, 23 March 2020"
 */
export function getDateGroupLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/**
 * Get the date key (YYYY-MM-DD) for grouping
 */
export function getDateKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Format time from ISO string: "5:12 pm"
 */
export function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Format month label from YYYY-MM: "January 2026"
 */
export function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}
