// src/components/projects/intake/Step1Sector.tsx
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useWizardStore } from '@/store/wizard.store';
import { ProjectSector } from '@/types/project.types';
import { useCreateProject } from '@/hooks/projects/useProjectMutations';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const SECTORS: {
  value: ProjectSector;
  icon: string;
  label: string;
  description: string;
  tags: string[];
}[] = [
  {
    value: ProjectSector.AGRICULTURE,
    icon: '🌾',
    label: 'Agriculture & Farmlands',
    description: 'Stubble burning prevention, urea reduction, no-till practices, soil carbon',
    tags: ['VM0042', 'Gold Standard SCS', 'APICMO'],
  },
  {
    value: ProjectSector.RENEWABLE_ENERGY,
    icon: '☀️',
    label: 'Renewable Energy',
    description: 'Solar, wind, small hydro, biomass power generation',
    tags: ['ACM0002', 'AMS-I.D', 'RECs'],
  },
  {
    value: ProjectSector.WASTE_MANAGEMENT,
    icon: '♻️',
    label: 'Waste Management',
    description: 'MSW, landfill gas, industrial waste diversion, composting',
    tags: ['AMS-III.F', 'ACM0022'],
  },
  {
    value: ProjectSector.INDUSTRIAL,
    icon: '🏭',
    label: 'Industrial Decarbonization',
    description: 'Fuel switching, energy efficiency, cogeneration',
    tags: ['AM0023', 'ACM0012', 'CCTS Eligible'],
  },
  {
    value: ProjectSector.NATURE_BASED,
    icon: '🌳',
    label: 'Nature-Based Solutions',
    description: 'Afforestation, avoided deforestation, forest management',
    tags: ['VM0007', 'VM0015', 'VCS'],
  },
  {
    value: ProjectSector.GREEN_BUILDINGS,
    icon: '🏢',
    label: 'Green Buildings',
    description: 'Commercial energy efficiency, green construction, district cooling',
    tags: ['AMS-II.C', 'IGBC'],
  },
];

export function Step1Sector() {
  const { data, updateData, advance } = useWizardStore();
  const createProject = useCreateProject();

  const handleSelect = async (sector: ProjectSector) => {
    updateData({ sector });
    if (!data.projectId) {
      createProject.mutate(
        { sector, status: 'DRAFT' as never },
        { onSuccess: (proj) => updateData({ projectId: proj.id }) }
      );
    }
  };

  return (
    <div>
      <div className="mb-8">
        <span className="font-display text-8xl font-bold italic text-cgs-forest/5 select-none">01</span>
        <h2 className="-mt-8 font-display text-3xl font-semibold italic text-cgs-forest">
          What sector is your project in?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          This determines which methodology and MRV pathway we recommend.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SECTORS.map((s, i) => {
          const isSelected = data.sector === s.value;
          return (
            <motion.button
              key={s.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(s.value)}
              className={cn(
                'relative rounded-xl border-2 p-4 text-left transition-all duration-200',
                isSelected
                  ? 'border-cgs-sage bg-cgs-sage/5 shadow-md'
                  : 'border-gray-200 bg-white hover:border-cgs-mist hover:bg-cgs-cream'
              )}
            >
              {isSelected && (
                <CheckCircle2
                  size={18}
                  className="absolute right-3 top-3 text-cgs-sage"
                />
              )}
              <span className="mb-2 block text-3xl">{s.icon}</span>
              <p className="font-semibold text-cgs-forest">{s.label}</p>
              <p className="mt-1 text-xs text-gray-500">{s.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {s.tags.map((tag) => (
                  <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={advance} disabled={!data.sector} size="lg">
          Continue →
        </Button>
      </div>
    </div>
  );
}
