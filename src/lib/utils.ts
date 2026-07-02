import { cn } from 'cnfast';
import { format, parseISO } from 'date-fns';
import { getCurrencyInfo } from './currencies';

function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const currency = getCurrencyInfo(currencyCode);
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch {
    // Fallback if locale/currency combination is unsupported
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  }
}

function formatDate(date: string | Date, fmt: string = 'MMM dd, yyyy'): string {
  if (typeof date === 'string') {
    return format(parseISO(date), fmt);
  }
  return format(date, fmt);
}

function getMonthName(month: number): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[month - 1] || '';
}

export { cn, formatCurrency, formatDate, getMonthName };
