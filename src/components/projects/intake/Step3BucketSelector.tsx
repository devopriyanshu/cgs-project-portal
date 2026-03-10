// src/components/projects/intake/Step3BucketSelector.tsx
import { useWizardStore } from '@/store/wizard.store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectBucket } from '@/types/project.types';

const BUCKETS: {
  value: ProjectBucket;
  label: string;
  tagline: string;
  description: string;
  nextSteps: string[];
  fee: string;
  bestFor: string;
}[] = [
  {
    value: ProjectBucket.A,
    label: 'Bucket A',
    tagline: 'We have verified credits ready to sell',
    description: 'Your project already has registry-issued credits with serial numbers (Verra, Gold Standard, or CCTS).',
    nextSteps: ['Serial number validation (3 business days)', 'Quality Score assignment', 'Listed on marketplace within 7 days'],
    fee: '₹25,000',
    bestFor: 'Mature projects with verified credit inventory',
  },
  {
    value: ProjectBucket.B,
    label: 'Bucket B',
    tagline: 'Our project is registered, verification is underway',
    description: 'You have a Project Design Document with a methodology and have engaged or are engaging a VVB.',
    nextSteps: ['Eligibility assessment (5 business days)', 'MRV workflow access', 'VVB submission package auto-compiled'],
    fee: '₹15,000',
    bestFor: 'Pipeline projects with 6–18 months to first issuance',
  },
  {
    value: ProjectBucket.C,
    label: 'Bucket C',
    tagline: 'We have a project idea or operational activity',
    description: 'You believe your activity can generate carbon credits but haven\'t started the registry process yet.',
    nextSteps: ['Pre-feasibility review (5 business days)', 'Structuring Toolkit access', 'Registry pathway guidance'],
    fee: '₹10,000',
    bestFor: 'Early-stage projects exploring carbon monetization',
  },
];

export function Step3BucketSelector() {
  const { data, updateData, advance, back } = useWizardStore();

  return (
    <div>
      <div className="mb-8">
        <span className="font-display text-8xl font-bold italic text-cgs-forest/5 select-none">03</span>
        <h2 className="-mt-8 font-display text-3xl font-semibold italic text-cgs-forest">
          What stage is your project at?
        </h2>
        <p className="mt-2 text-sm text-gray-500">Be honest — this determines your pathway, not your eligibility.</p>
      </div>

      <div className="flex flex-col gap-4">
        {BUCKETS.map((b, i) => {
          const isSelected = data.bucket === b.value;
          return (
            <motion.button
              key={b.value}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => updateData({ bucket: b.value })}
              className={cn(
                'relative rounded-xl border-2 p-5 text-left transition-all duration-200',
                isSelected
                  ? 'border-cgs-sage bg-cgs-sage/5 shadow-md'
                  : 'border-gray-200 bg-white hover:border-cgs-mist'
              )}
            >
              {isSelected && (
                <CheckCircle2 size={20} className="absolute right-4 top-4 text-cgs-sage" />
              )}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-bold',
                      b.value === ProjectBucket.A && 'bg-cgs-gold/20 text-amber-700',
                      b.value === ProjectBucket.B && 'bg-cgs-sage/20 text-cgs-moss',
                      b.value === ProjectBucket.C && 'bg-cgs-earth/20 text-cgs-earth'
                    )}>
                      {b.label}
                    </span>
                    <span className="text-sm font-medium text-gray-400">Onboarding fee: {b.fee}</span>
                  </div>
                  <p className="font-semibold text-cgs-forest text-lg">{b.tagline}</p>
                  <p className="mt-1 text-sm text-gray-500">{b.description}</p>
                  <p className="mt-2 text-xs text-cgs-moss font-medium">Best for: {b.bestFor}</p>
                </div>
                <div className="sm:w-52">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">What happens next</p>
                  <ul className="flex flex-col gap-1">
                    {b.nextSteps.map((step, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <span className="mt-0.5 font-bold text-cgs-sage">→</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={back}>← Back</Button>
        <Button onClick={advance} disabled={!data.bucket} size="lg">Continue →</Button>
      </div>
    </div>
  );
}
