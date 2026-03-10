// src/pages/portal/ProjectIntakePage.tsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useWizardStore } from '@/store/wizard.store';
import { useCreateProject } from '@/hooks/projects/useProjectMutations';
import { ProjectSector, ProjectBucket, RegistryStandard } from '@/types/project.types';
import { INDIAN_STATES, CREDIT_PRICE_CONSERVATIVE, CREDIT_PRICE_BASE, CREDIT_PRICE_OPTIMISTIC } from '@/lib/constants/app.constants';
import { formatINR } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/lib/constants/routes';

const SECTORS = [
  { value: ProjectSector.AGRICULTURE, icon: '🌾', label: 'Agriculture & Farmlands', desc: 'Stubble burning prevention, urea reduction, no-till, soil carbon', tags: ['VM0042', 'Gold Standard SCS', 'APICMO'] },
  { value: ProjectSector.RENEWABLE_ENERGY, icon: '☀️', label: 'Renewable Energy', desc: 'Solar, wind, small hydro, biomass power generation', tags: ['ACM0002', 'AMS-I.D', 'RECs'] },
  { value: ProjectSector.WASTE_MANAGEMENT, icon: '♻️', label: 'Waste Management', desc: 'MSW, landfill gas, industrial waste diversion, composting', tags: ['AMS-III.F', 'ACM0022'] },
  { value: ProjectSector.INDUSTRIAL, icon: '🏭', label: 'Industrial Decarbonization', desc: 'Fuel switching, energy efficiency, cogeneration', tags: ['AM0023', 'ACM0012', 'CCTS'] },
  { value: ProjectSector.NATURE_BASED, icon: '🌳', label: 'Nature-Based Solutions', desc: 'Afforestation, avoided deforestation, forest management', tags: ['VM0007', 'VM0015', 'VCS'] },
  { value: ProjectSector.GREEN_BUILDINGS, icon: '🏢', label: 'Green Buildings', desc: 'Commercial energy efficiency, green construction', tags: ['AMS-II.C', 'IGBC'] },
];

const BUCKETS = [
  {
    value: ProjectBucket.A,
    label: 'We have verified credits ready to sell',
    desc: 'Your project already has registry-issued credits with serial numbers.',
    steps: ['Serial number validation (3 business days)', 'Quality Score assignment', 'Listed on marketplace within 7 days'],
    fee: 25000, feeDisplay: '₹25,000',
    bestFor: 'Mature projects with verified credit inventory',
    color: 'border-cgs-gold bg-cgs-gold/5',
    badge: 'bg-cgs-gold/20 text-cgs-earth',
  },
  {
    value: ProjectBucket.B,
    label: 'Our project is registered, verification is underway',
    desc: 'You have a Project Design Document and have engaged a VVB.',
    steps: ['Eligibility assessment (5 business days)', 'MRV workflow access', 'VVB submission package auto-compiled'],
    fee: 15000, feeDisplay: '₹15,000',
    bestFor: 'Pipeline projects with 6–18 months to first issuance',
    color: 'border-cgs-sage bg-cgs-sage/5',
    badge: 'bg-cgs-sage/20 text-cgs-moss',
  },
  {
    value: ProjectBucket.C,
    label: 'We have a project idea or operational activity',
    desc: 'You believe your activity can generate credits but haven\'t started the registry process.',
    steps: ['Pre-feasibility review (5 business days)', 'Structuring Toolkit access', 'Registry pathway guidance'],
    fee: 10000, feeDisplay: '₹10,000',
    bestFor: 'Early-stage projects exploring carbon monetization',
    color: 'border-cgs-earth/50 bg-cgs-earth/5',
    badge: 'bg-cgs-earth/20 text-cgs-earth',
  },
];

const CO2_RANGES = [
  { value: 500, label: '< 1,000 tonnes' },
  { value: 5000, label: '1,000 – 10,000 tonnes' },
  { value: 50000, label: '10,000 – 1,00,000 tonnes' },
  { value: 150000, label: '> 1,00,000 tonnes' },
];

const REGISTRY_OPTIONS = [
  { value: RegistryStandard.VERRA_VCS, label: 'Verra VCS', desc: 'Project registered with Verra Verified Carbon Standard' },
  { value: RegistryStandard.GOLD_STANDARD, label: 'Gold Standard', desc: 'Project registered with Gold Standard Foundation' },
  { value: RegistryStandard.CCTS_BEE, label: 'CCTS / BEE', desc: 'Project registered under India\'s Carbon Credit Trading Scheme' },
  { value: 'IN_PROCESS', label: 'In Process', desc: 'Registry application submitted, pending registration' },
  { value: 'NONE', label: 'No Registry', desc: 'Not yet engaged with any registry' },
];

export default function ProjectIntakePage() {
  const { data, advance, back, updateData, reset } = useWizardStore();
  const createProject = useCreateProject();
  const navigate = useNavigate();

  const step = data.step;
  const TOTAL_STEPS = 5;
  const progress = ((step) / TOTAL_STEPS) * 100;

  const handleSectorSelect = async (sector: ProjectSector) => {
    updateData({ sector });
    // Fire-and-forget draft creation
    if (!data.projectId) {
      createProject.mutate({ sector, status: undefined } as any, {
        onSuccess: (project) => updateData({ projectId: project.id }),
      });
    }
    advance();
  };

  if (step >= TOTAL_STEPS) {
    // Result screen
    const bucket = data.bucket;
    const bucketConfig = BUCKETS.find(b => b.value === bucket) ?? BUCKETS[1];
    return (
      <div className="mx-auto max-w-2xl py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-cgs-mist/50 text-center"
        >
          <p className="mb-2 text-sm text-gray-500 font-medium">Your project has been classified</p>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className={cn('mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-8 py-3 text-3xl font-bold', bucketConfig.badge)}
          >
            🏆 Bucket {bucket}
          </motion.div>
          <h2 className="font-display text-xl font-bold italic text-cgs-forest mb-6">
            {bucketConfig.bestFor}
          </h2>

          {/* Timeline */}
          <div className="mb-8 space-y-3 text-left">
            {bucketConfig.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cgs-sage text-white text-xs font-bold">
                  {i + 1}
                </div>
                <p className="text-sm text-cgs-charcoal">{step}</p>
              </div>
            ))}
          </div>

          {/* Fee */}
          <div className="rounded-xl border border-cgs-mist bg-cgs-cream/50 p-5 mb-6">
            <p className="text-sm text-gray-500 mb-1">One-time onboarding fee</p>
            <p className="text-4xl font-bold text-cgs-forest">{bucketConfig.feeDisplay}</p>
            <p className="mt-2 text-xs text-gray-400">
              Covers eligibility assessment, project structuring consultation, and 12 months of MRV workflow access.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 rounded-lg bg-cgs-sage px-4 py-3 font-semibold text-white hover:bg-cgs-moss">
              Pay with Razorpay
            </button>
            <button
              onClick={() => {
                if (data.projectId) navigate({ to: ROUTES.PROJECTS.DETAIL(data.projectId) });
                else navigate({ to: ROUTES.PROJECTS.LIST });
                reset();
              }}
              className="flex-1 rounded-lg border border-cgs-mist bg-white px-4 py-3 font-medium text-cgs-forest hover:bg-cgs-mist/30"
            >
              Save draft
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span>Step {step + 1} of {TOTAL_STEPS}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cgs-mist">
          <motion.div
            className="h-full rounded-full bg-cgs-sage"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {/* STEP 1: Sector */}
          {step === 0 && (
            <div>
              <p className="mb-1 text-7xl font-bold text-cgs-mist/60 font-display leading-none">01</p>
              <h2 className="mb-1 font-display text-2xl font-bold italic text-cgs-forest">
                What sector is your project in?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                This determines which methodology and MRV pathway we recommend.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SECTORS.map((sector) => (
                  <button
                    key={sector.value}
                    onClick={() => handleSectorSelect(sector.value)}
                    className={cn(
                      'rounded-xl border p-4 text-left transition hover:border-cgs-sage hover:bg-cgs-sage/5',
                      data.sector === sector.value
                        ? 'border-cgs-sage bg-cgs-sage/10'
                        : 'border-cgs-mist bg-white'
                    )}
                  >
                    <div className="mb-2 text-3xl">{sector.icon}</div>
                    <p className="font-semibold text-cgs-forest">{sector.label}</p>
                    <p className="mt-1 text-xs text-gray-500">{sector.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {sector.tags.map((tag) => (
                        <span key={tag} className="rounded bg-cgs-mist/60 px-1.5 py-0.5 text-[10px] text-cgs-moss">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 1 && (
            <div>
              <p className="mb-1 text-7xl font-bold text-cgs-mist/60 font-display leading-none">02</p>
              <h2 className="mb-1 font-display text-2xl font-bold italic text-cgs-forest">
                Where is your project located?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Projects in priority districts receive eligibility fast-track within 24 hours.
              </p>
              <div className="space-y-4 rounded-xl bg-white p-6 ring-1 ring-cgs-mist/50">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">State</label>
                  <select
                    value={data.state ?? ''}
                    onChange={(e) => updateData({ state: e.target.value, district: '' })}
                    className="w-full rounded-lg border border-cgs-mist px-3 py-2.5 text-sm outline-none focus:border-cgs-sage"
                  >
                    <option value="">Select state…</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">District</label>
                  <input
                    value={data.district ?? ''}
                    onChange={(e) => updateData({ district: e.target.value })}
                    placeholder="Enter district name"
                    className="w-full rounded-lg border border-cgs-mist px-3 py-2.5 text-sm outline-none focus:border-cgs-sage"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Pincode (optional)</label>
                  <input
                    value={data.pincode ?? ''}
                    onChange={(e) => updateData({ pincode: e.target.value })}
                    placeholder="e.g. 110001"
                    maxLength={6}
                    className="w-full rounded-lg border border-cgs-mist px-3 py-2.5 text-sm outline-none focus:border-cgs-sage"
                  />
                </div>
              </div>
              <WizardNav
                onBack={back}
                onNext={() => advance()}
                canNext={!!data.state}
              />
            </div>
          )}

          {/* STEP 3: Bucket */}
          {step === 2 && (
            <div>
              <p className="mb-1 text-7xl font-bold text-cgs-mist/60 font-display leading-none">03</p>
              <h2 className="mb-1 font-display text-2xl font-bold italic text-cgs-forest">
                What stage is your project at?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Be honest — this determines your pathway, not your eligibility.
              </p>
              <div className="space-y-3">
                {BUCKETS.map((bucket) => (
                  <button
                    key={bucket.value}
                    onClick={() => updateData({ bucket: bucket.value })}
                    className={cn(
                      'w-full rounded-xl border p-5 text-left transition',
                      data.bucket === bucket.value ? bucket.color : 'border-cgs-mist bg-white hover:border-cgs-sage/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', bucket.badge)}>
                            Bucket {bucket.value}
                          </span>
                          <span className="text-xs text-gray-400">{bucket.feeDisplay}</span>
                        </div>
                        <p className="font-semibold text-cgs-forest">{bucket.label}</p>
                        <p className="mt-1 text-sm text-gray-500">{bucket.desc}</p>
                      </div>
                      {data.bucket === bucket.value && (
                        <div className="shrink-0 rounded-full bg-cgs-sage p-1">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <WizardNav onBack={back} onNext={() => advance()} canNext={!!data.bucket} />
            </div>
          )}

          {/* STEP 4: CO2 estimate */}
          {step === 3 && (
            <div>
              <p className="mb-1 text-7xl font-bold text-cgs-mist/60 font-display leading-none">04</p>
              <h2 className="mb-1 font-display text-2xl font-bold italic text-cgs-forest">
                Estimated annual CO₂ reduction?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                An honest estimate. Overestimates hurt your credibility assessment.
              </p>
              <div className="space-y-3">
                {CO2_RANGES.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => updateData({ estimatedAnnualCo2: range.value })}
                    className={cn(
                      'w-full rounded-xl border p-4 text-left transition font-medium',
                      data.estimatedAnnualCo2 === range.value
                        ? 'border-cgs-sage bg-cgs-sage/10 text-cgs-forest'
                        : 'border-cgs-mist bg-white hover:border-cgs-sage/40'
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              {data.estimatedAnnualCo2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl border border-cgs-mist bg-cgs-cream/60 p-5"
                >
                  <p className="mb-3 text-sm font-medium text-cgs-forest">
                    Based on your estimate, your project could generate:
                  </p>
                  {[
                    { label: 'Conservative', price: CREDIT_PRICE_CONSERVATIVE },
                    { label: 'Base case', price: CREDIT_PRICE_BASE },
                    { label: 'Optimistic', price: CREDIT_PRICE_OPTIMISTIC },
                  ].map(({ label, price }) => (
                    <div key={label} className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-semibold text-cgs-forest">
                        {formatINR(data.estimatedAnnualCo2! * price)} / year
                      </span>
                    </div>
                  ))}
                  <p className="mt-3 text-xs text-gray-400">
                    Estimates only. Actual revenue depends on verification outcome, quality score, and market conditions.
                  </p>
                </motion.div>
              )}
              <WizardNav onBack={back} onNext={() => advance()} canNext={!!data.estimatedAnnualCo2} />
            </div>
          )}

          {/* STEP 5: Registry */}
          {step === 4 && (
            <div>
              <p className="mb-1 text-7xl font-bold text-cgs-mist/60 font-display leading-none">05</p>
              <h2 className="mb-1 font-display text-2xl font-bold italic text-cgs-forest">
                What is your registry status?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Select the option that best describes your current registry position.
              </p>
              <div className="space-y-3">
                {REGISTRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateData({ registryStatus: opt.value as any })}
                    className={cn(
                      'w-full rounded-xl border p-4 text-left transition',
                      data.registryStatus === opt.value
                        ? 'border-cgs-sage bg-cgs-sage/10'
                        : 'border-cgs-mist bg-white hover:border-cgs-sage/40'
                    )}
                  >
                    <p className="font-semibold text-cgs-forest">{opt.label}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <WizardNav
                onBack={back}
                onNext={() => advance()}
                canNext={!!data.registryStatus}
                nextLabel="See My Results →"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WizardNav({
  onBack,
  onNext,
  canNext,
  nextLabel = 'Continue →',
}: {
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-8 flex gap-3">
      <button
        onClick={onBack}
        className="flex items-center gap-2 rounded-lg border border-cgs-mist px-5 py-2.5 text-sm font-medium text-cgs-forest hover:bg-gray-50"
      >
        <ChevronLeft size={16} /> Back
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cgs-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-cgs-moss disabled:cursor-not-allowed disabled:opacity-50"
      >
        {nextLabel} <ChevronRight size={16} />
      </button>
    </div>
  );
}
