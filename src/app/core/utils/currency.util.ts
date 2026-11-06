/**
 * Indian Rupee (INR) Formatting Utilities for VERTEX Enterprise Work OS
 * Complies with Indian numbering conventions (Lakhs and Crores).
 */

export function formatINR(amount: number, options?: { compact?: boolean; precision?: number }): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';

  if (options?.compact) {
    const abs = Math.abs(amount);
    if (abs >= 10000000) {
      const cr = amount / 10000000;
      const prec = options.precision !== undefined ? options.precision : 2;
      return `₹${cr.toFixed(prec).replace(/\.00$/, '')} Cr`;
    }
    if (abs >= 100000) {
      const lakh = amount / 100000;
      const prec = options.precision !== undefined ? options.precision : (lakh % 1 === 0 ? 0 : 1);
      return `₹${lakh.toFixed(prec)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatIndianDate(dateInput: string | Date): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

