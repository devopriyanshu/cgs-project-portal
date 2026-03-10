// src/components/projects/intake/BucketAssignmentResult.tsx
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { useWizardStore } from '@/store/wizard.store';
import { useRazorpayCheckout } from '@/hooks/payments/useRazorpayCheckout';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';

const BUCKET_CONFIG = {
  A: {
    color: 'text-amber-600',
    bg: 'bg-cgs-gold/15 border-2 border-cgs-gold/40',
    label: 'Verified Credits Ready',
    fee: 2500000, // ₹25,000 in paise
    feeLabel: '₹25,000',
    timeline: [
      { step: '①', title: 'Serial Number Validation', duration: '3 business days', desc: 'CGS validates your registry-issued serial numbers' },
      { step: '②', title: 'Quality Score Assignment', duration: '2 business days', desc: 'Multi-dimensional scoring across 5 parameters' },
      { step: '③', title: 'Marketplace Listing', duration: 'Within 7 days', desc: 'Credits listed and visible to verified buyers' },
    ],
  },
  B: {
    color: 'text-cgs-moss',
    bg: 'bg-cgs-sage/15 border-2 border-cgs-sage/40',
    label: 'Pipeline Project — Registry Registered',
    fee: 1500000, // ₹15,000 in paise
    feeLabel: '₹15,000',
    timeline: [
      { step: '①', title: 'Eligibility Assessment', duration: '5 business days', desc: 'CGS team reviews your project documents' },
      { step: '②', title: 'MRV Workflow', duration: '6–14 weeks', desc: 'Satellite monitoring + VVB submission package' },
      { step: '③', title: 'Credit Issuance', duration: 'Upon verification', desc: 'Credits issued to your portfolio' },
    ],
  },
  C: {
    color: 'text-cgs-earth',
    bg: 'bg-cgs-earth/15 border-2 border-cgs-earth/40',
    label: 'Early-Stage Project',
    fee: 1000000, // ₹10,000 in paise
    feeLabel: '₹10,000',
    timeline: [
      { step: '①', title: 'Pre-Feasibility Review', duration: '5 business days', desc: 'CGS assesses carbon creditability' },
      { step: '②', title: 'Structuring Toolkit', duration: 'Ongoing', desc: 'Registry pathway guidance and templates' },
      { step: '③', title: 'Registry Application', duration: '3–6 months', desc: 'Supported registration with chosen standard' },
    ],
  },
} as const;

export function BucketAssignmentResult() {
  const navigate = useNavigate();
  const { data, reset } = useWizardStore();
  const { initiate } = useRazorpayCheckout();

  const bucket = data.bucket as keyof typeof BUCKET_CONFIG;
  const config = BUCKET_CONFIG[bucket];

  const handlePayNow = () => {
    if (!data.projectId) return;
    initiate({
      projectId: data.projectId,
      amount: config.fee,
      purpose: `CGS Project Onboarding — Bucket ${bucket}`,
      onSuccess: () => {
        reset();
        navigate({ to: ROUTES.PROJECTS.DETAIL(data.projectId!) });
      },
      onError: () => {},
    });
  };

  const handlePayLater = () => {
    reset();
    navigate({ to: data.projectId ? ROUTES.PROJECTS.DETAIL(data.projectId) : ROUTES.PROJECTS.LIST });
  };

  return (
    <div className="flex flex-col items-center py-8 text-center">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-400"
      >
        Your project has been classified
      </motion.p>

      {/* Animated bucket badge */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className={cn('mb-4 rounded-2xl px-8 py-5', config.bg)}
      >
        <p className={cn('font-display text-6xl font-bold italic', config.color)}>
          Bucket {bucket}
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-10 text-base font-medium text-cgs-forest"
      >
        {config.label}
      </motion.p>

      {/* Timeline */}
      <div className="mb-10 w-full max-w-md">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          What happens next
        </p>
        <div className="flex flex-col gap-4">
          {config.timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.12 }}
              className="flex items-start gap-4 rounded-xl bg-white border border-gray-100 p-4 text-left shadow-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cgs-sage/10 font-bold text-cgs-sage">
                {i + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-cgs-forest">{item.title}</p>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                    {item.duration}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm rounded-2xl border border-cgs-mist/50 bg-cgs-cream/50 p-6"
      >
        <p className="mb-1 text-sm text-gray-500">One-time onboarding fee</p>
        <p className="mb-4 font-display text-4xl font-bold italic text-cgs-forest">{config.feeLabel}</p>
        <Button onClick={handlePayNow} size="lg" className="mb-3 w-full">
          Pay with Razorpay
        </Button>
        <Button onClick={handlePayLater} variant="ghost" size="lg" className="w-full">
          I'll pay later — Save draft
        </Button>
        <p className="mt-3 text-[11px] text-gray-400">
          Onboarding fee covers eligibility assessment, project structuring consultation, and 12 months of MRV workflow access.
        </p>
      </motion.div>
    </div>
  );
}
