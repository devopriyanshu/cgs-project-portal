// src/pages/settings/KycPage.tsx
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useKycStatus } from '@/hooks/organization/useOrganization';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

const STATUS_CONFIG = {
  APPROVED: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: 'KYC Verified' },
  PENDING:  { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', label: 'Under Review' },
  REJECTED: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 border-red-200', label: 'KYC Rejected' },
  NOT_SUBMITTED: { icon: AlertTriangle, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200', label: 'Not Submitted' },
} as const;

export default function KycPage() {
  const { data: kyc, isLoading } = useKycStatus();
  const status = (kyc?.status ?? 'NOT_SUBMITTED') as keyof typeof STATUS_CONFIG;
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.NOT_SUBMITTED;
  const Icon = config.icon;

  return (
    <div className="space-y-6 max-w-lg">
      <PageHeader title="KYC Verification" subtitle="Identity verification for credit listing and payments" />

      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      ) : (
        <div className={cn('rounded-xl border p-6', config.bg)}>
          <div className="flex items-center gap-3">
            <Icon size={28} className={config.color} />
            <div>
              <p className={cn('font-semibold text-lg', config.color)}>{config.label}</p>
              {kyc?.submittedAt && (
                <p className="text-sm text-gray-500">Submitted: {formatDate(kyc.submittedAt)}</p>
              )}
              {kyc?.reviewedAt && (
                <p className="text-sm text-gray-500">Reviewed: {formatDate(kyc.reviewedAt)}</p>
              )}
              {kyc?.reason && (
                <p className="mt-2 text-sm text-red-600">Reason: {kyc.reason}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {(status === 'NOT_SUBMITTED' || status === 'REJECTED') && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-cgs-mist/40 space-y-4">
          <h3 className="font-semibold text-cgs-forest">
            {status === 'REJECTED' ? 'Resubmit KYC' : 'Start KYC Verification'}
          </h3>
          <p className="text-sm text-gray-500">
            KYC verification is required to list credits on the marketplace and receive payout disbursements.
          </p>
          <div className="space-y-3">
            <p className="text-sm font-medium text-cgs-forest">Documents required:</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• PAN Card (Individual or Organization)</li>
              <li>• GST Certificate (if applicable)</li>
              <li>• Bank account proof (cancelled cheque or bank statement)</li>
              <li>• Certificate of Incorporation (for companies)</li>
            </ul>
          </div>
          <button className="w-full rounded-lg bg-cgs-sage py-2.5 text-sm font-semibold text-white hover:bg-cgs-moss">
            {status === 'REJECTED' ? 'Resubmit KYC Documents' : 'Start KYC Process'}
          </button>
        </div>
      )}

      {status === 'PENDING' && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-cgs-mist/40">
          <p className="text-sm text-gray-500">
            Your KYC documents are under review. This typically takes 1–3 business days.
            You'll receive an email notification when the review is complete.
          </p>
        </div>
      )}
    </div>
  );
}
