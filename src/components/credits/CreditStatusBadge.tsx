// src/components/credits/CreditStatusBadge.tsx
import type { CreditStatus } from '@/types/credit.types';
import { Badge } from '@/components/ui/Badge';

const STATUS_MAP: Record<CreditStatus, { label: string; variant: 'info' | 'primary' | 'warning' | 'success' | 'default' | 'error' }> = {
  ISSUED:   { label: 'Issued',   variant: 'info' },
  LISTED:   { label: 'Listed',   variant: 'primary' },
  RESERVED: { label: 'Reserved', variant: 'warning' },
  SOLD:     { label: 'Sold',     variant: 'success' },
  RETIRED:  { label: 'Retired',  variant: 'default' },
  BUFFER:   { label: 'Buffer',   variant: 'default' },
};

export function CreditStatusBadge({ status }: { status: CreditStatus }) {
  const cfg = STATUS_MAP[status] ?? { label: status, variant: 'default' as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
