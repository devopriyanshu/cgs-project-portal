// src/components/fpo/FpoStatCards.tsx
import { Users, Maximize, Leaf, IndianRupee } from 'lucide-react';
import { useFpoStats } from '@/hooks/fpo/useFpo';
import { StatCard } from '@/components/ui/Card';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { formatINR, formatNumber } from '@/lib/utils/format';

export function FpoStatCards() {
  const { data: stats, isLoading } = useFpoStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Farmers"
        value={formatNumber(stats?.totalFarmers ?? 0)}
        icon={<Users size={16} />}
      />
      <StatCard
        label="Total Acres"
        value={formatNumber(stats?.totalAcres ?? 0)}
        icon={<Maximize size={16} />}
      />
      <StatCard
        label="Credits Generated"
        value={formatNumber(stats?.totalCreditsGenerated ?? 0)}
        icon={<Leaf size={16} />}
      />
      <StatCard
        label="Payouts Distributed"
        value={formatINR(stats?.totalPayoutsDistributed ?? 0)}
        icon={<IndianRupee size={16} />}
      />
    </div>
  );
}
