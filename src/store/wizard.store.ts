// src/store/wizard.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProjectSector, ProjectBucket, RegistryStandard } from '@/types/project.types';

export interface WizardData {
  step: number;
  sector?: ProjectSector;
  state?: string;
  district?: string;
  pincode?: string;
  bucket?: ProjectBucket;
  estimatedAnnualCo2?: number;
  registryStatus?: RegistryStandard | 'IN_PROCESS' | 'NONE';
  projectId?: string;
}

interface WizardStore {
  data: WizardData;
  setStep: (step: number) => void;
  updateData: (partial: Partial<WizardData>) => void;
  reset: () => void;
  advance: () => void;
  back: () => void;
}

const INITIAL_DATA: WizardData = { step: 0 };

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      data: INITIAL_DATA,
      setStep: (step) => set((s) => ({ data: { ...s.data, step } })),
      updateData: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),
      reset: () => set({ data: INITIAL_DATA }),
      advance: () => set((s) => ({ data: { ...s.data, step: s.data.step + 1 } })),
      back: () =>
        set((s) => ({ data: { ...s.data, step: Math.max(0, s.data.step - 1) } })),
    }),
    { name: 'cgs-intake-wizard' }
  )
);
