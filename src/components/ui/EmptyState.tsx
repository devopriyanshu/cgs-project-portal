// src/components/ui/EmptyState.tsx
import { cn } from '@/lib/utils/cn';

const PRESETS = {
  projects: {
    emoji: '🌱',
    title: 'No projects yet',
    description: 'Start by registering your first carbon project',
    actionLabel: '+ Register First Project',
  },
  farmers: {
    emoji: '👨‍🌾',
    title: 'No farmers enrolled yet',
    description: 'Enroll your first farmer to begin tracking practice changes and payouts',
    actionLabel: '+ Enroll Your First Farmer',
  },
  credits: {
    emoji: '🌿',
    title: 'No credits issued yet',
    description: 'Credits are issued after your project completes MRV verification',
    actionLabel: 'Go to MRV',
  },
  notifications: {
    emoji: '✅',
    title: "You're all caught up!",
    description: 'No new notifications at this time',
    actionLabel: undefined,
  },
  documents: {
    emoji: '📄',
    title: 'No documents uploaded',
    description: 'Upload project documents to support your eligibility assessment',
    actionLabel: 'Upload Document',
  },
  payouts: {
    emoji: '💸',
    title: 'No payouts yet',
    description: 'Farmer payouts will appear here once credits are sold',
    actionLabel: undefined,
  },
  generic: {
    emoji: '📭',
    title: 'Nothing here yet',
    description: 'Add some data to get started',
    actionLabel: undefined,
  },
} as const;

type Preset = keyof typeof PRESETS;

interface EmptyStateProps {
  preset?: Preset;
  emoji?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  preset = 'generic', emoji, title, description, action, className
}: EmptyStateProps) {
  const config = PRESETS[preset];
  const displayEmoji = emoji ?? config.emoji;
  const displayTitle = title ?? config.title;
  const displayDesc = description ?? config.description;

  return (
    <div className={cn('flex flex-col items-center py-16 text-center', className)}>
      <span className="mb-4 text-6xl">{displayEmoji}</span>
      <h3 className="mb-2 font-display text-xl font-semibold italic text-cgs-forest">
        {displayTitle}
      </h3>
      {displayDesc && (
        <p className="mb-6 max-w-sm text-sm text-gray-500">{displayDesc}</p>
      )}
      {action && action}
    </div>
  );
}
