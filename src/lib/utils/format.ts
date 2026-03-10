// src/lib/utils/format.ts
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(date: string | Date, fmt = 'DD MMM YYYY'): string {
  return dayjs(date).format(fmt);
}

export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function formatCO2(tonnes: number): string {
  if (tonnes >= 100000) return `${(tonnes / 100000).toFixed(1)}L tonnes`;
  if (tonnes >= 1000) return `${(tonnes / 1000).toFixed(1)}K tonnes`;
  return `${formatNumber(tonnes)} tonnes`;
}

export function estimateRevenue(
  tonnes: number,
  pricePerTonne: number
): number {
  return tonnes * pricePerTonne;
}

export function hashAadhaar(aadhaar: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(aadhaar);
  return crypto.subtle.digest('SHA-256', data).then((hash) =>
    Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}
