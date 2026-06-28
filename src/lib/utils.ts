import { cn } from 'cnfast';
import { format, parseISO } from 'date-fns';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
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
