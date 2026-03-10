// src/pages/portal/FpoDashboardPage.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Users, Leaf, TrendingUp, Wallet, Plus, Upload, ClipboardList } from 'lucide-react';
import { useFpoStats, useFpoDetails } from '@/hooks/fpo/useFpo';
import { formatINR, formatNumber } from '@/lib/utils/format';
import { ROUTES } from '@/lib/constants/routes';

export default function FpoDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useFpoStats();
  const { data: details } = useFpoDetails();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold italic text-cgs-forest">
          {details?.name ?? 'FPO Dashboard'}
        </h1>
        {details?.registrationNumber && (
          <p className="mt-1 font-mono-cgs text-xs text-gray-500">
            Reg: {details.registrationNumber}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))
        ) : (
          <>
            {[
              { icon: Users, label: 'Total Farmers', value: formatNumber(stats?.totalFarmers ?? 0), color: 'bg-cgs-sage' },
              { icon: Leaf, label: 'Total Acres', value: formatNumber(stats?.totalAcres ?? 0), color: 'bg-cgs-moss' },
              { icon: TrendingUp, label: 'Credits Generated', value: formatNumber(stats?.totalCreditsGenerated ?? 0), color: 'bg-cgs-earth' },
              { icon: Wallet, label: 'Payouts Distributed', value: formatINR(stats?.totalPayoutsDistributed ?? 0), color: 'bg-cgs-gold/80' },
            ].map(({ icon: Icon, label, value, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: -2 }}
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-cgs-mist/40"
              >
                <div className={`mb-3 inline-flex rounded-lg p-2 ${color}`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-xl font-bold text-cgs-charcoal">{value}</p>
                <p className="mt-0.5 text-sm text-gray-500">{label}</p>
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-semibold text-cgs-forest">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Plus, label: 'Enroll New Farmer', to: ROUTES.FPO.FARMERS },
            { icon: Upload, label: 'Batch Upload CSV', to: ROUTES.FPO.FARMERS },
            { icon: ClipboardList, label: 'Log Practice Changes', to: ROUTES.FPO.PRACTICE_LOG },
            { icon: Wallet, label: 'View Payouts', to: ROUTES.FPO.PAYOUTS },
          ].map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-cgs-mist/40 hover:ring-cgs-sage/40 hover:bg-cgs-sage/5 transition text-sm font-medium text-cgs-forest text-center"
            >
              <div className="rounded-lg bg-cgs-sage/10 p-2.5">
                <Icon size={18} className="text-cgs-sage" />
              </div>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
