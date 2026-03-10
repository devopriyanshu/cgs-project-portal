// src/components/projects/intake/Step5RegistryStatus.tsx
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWizardStore } from '@/store/wizard.store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { RegistryStandard } from '@/types/project.types';

type RegistryOption = RegistryStandard | 'IN_PROCESS' | 'NONE';

const OPTIONS: { value: RegistryOption; icon: string; label: string; description: string }[] = [
  {
    value: RegistryStandard.VERRA_VCS,
    icon: '✅',
    label: 'Verra VCS',
    description: 'Project registered with Verra Verified Carbon Standard',
  },
  {
    value: RegistryStandard.GOLD_STANDARD,
    icon: '🥇',
    label: 'Gold Standard',
    description: 'Project registered with Gold Standard Foundation',
  },
  {
    value: RegistryStandard.CCTS_BEE,
    icon: '🇮🇳',
    label: 'CCTS / BEE',
    description: "Project registered under India's Carbon Credit Trading Scheme",
  },
  {
    value: 'IN_PROCESS',
    icon: '⏳',
    label: 'In Process',
    description: 'Registry application submitted, pending registration',
  },
  {
    value: 'NONE',
    icon: '📋',
    label: 'No Registry',
    description: 'Not yet engaged with any registry',
  },
];

export function Step5RegistryStatus() {
  const { data, updateData, advance, back } = useWizardStore();

  return (
    <div>
      <div className="mb-8">
        <span className="font-display text-8xl font-bold italic text-cgs-forest/5 select-none">05</span>
        <h2 className="-mt-8 font-display text-3xl font-semibold italic text-cgs-forest">
          What is your registry status?
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
        {OPTIONS.map((opt, i) => {
          const isSelected = data.registryStatus === opt.value;
          return (
            <motion.button
              key={String(opt.value)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => updateData({ registryStatus: opt.value as RegistryStandard | 'IN_PROCESS' | 'NONE' })}
              className={cn(
                'relative rounded-xl border-2 p-4 text-left transition-all duration-200',
                isSelected
                  ? 'border-cgs-sage bg-cgs-sage/5 shadow-md'
                  : 'border-gray-200 bg-white hover:border-cgs-mist hover:bg-cgs-cream'
              )}
            >
              {isSelected && (
                <CheckCircle2 size={16} className="absolute right-3 top-3 text-cgs-sage" />
              )}
              <span className="mb-2 block text-2xl">{opt.icon}</span>
              <p className="font-semibold text-cgs-forest">{opt.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{opt.description}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between max-w-2xl">
        <Button variant="ghost" onClick={back}>← Back</Button>
        <Button onClick={advance} disabled={!data.registryStatus} size="lg">
          See My Result →
        </Button>
      </div>
    </div>
  );
}
