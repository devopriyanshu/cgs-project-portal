// src/components/projects/intake/IntakeWizard.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useWizardStore } from '@/store/wizard.store';
import { Step1Sector } from './Step1Sector';
import { Step2Location } from './Step2Location';
import { Step3BucketSelector } from './Step3BucketSelector';
import { Step4CarbonEstimate } from './Step4CarbonEstimate';
import { Step5RegistryStatus } from './Step5RegistryStatus';
import { BucketAssignmentResult } from './BucketAssignmentResult';
import { Progress } from '@/components/ui/Progress';

const STEPS = [
  Step1Sector,
  Step2Location,
  Step3BucketSelector,
  Step4CarbonEstimate,
  Step5RegistryStatus,
];

export function IntakeWizard() {
  const { data } = useWizardStore();
  const step = data.step;
  const isResult = step >= STEPS.length;
  const progress = isResult ? 100 : Math.round((step / STEPS.length) * 100);
  const StepComponent = STEPS[step];

  return (
    <div className="min-h-[80vh] py-8">
      {/* Progress bar */}
      {!isResult && (
        <div className="mb-10">
          <div className="mb-2 flex justify-between text-xs text-gray-400">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} size="sm" />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {isResult ? <BucketAssignmentResult /> : <StepComponent />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
