// src/types/project.types.ts

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PRE_SCREENING = 'PRE_SCREENING',
  ELIGIBLE = 'ELIGIBLE',
  CONDITIONALLY_ELIGIBLE = 'CONDITIONALLY_ELIGIBLE',
  INELIGIBLE = 'INELIGIBLE',
  MRV_IN_PROGRESS = 'MRV_IN_PROGRESS',
  VVB_SUBMITTED = 'VVB_SUBMITTED',
  REGISTRY_PENDING = 'REGISTRY_PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  SUSPENDED = 'SUSPENDED',
}

export enum ProjectSector {
  AGRICULTURE = 'AGRICULTURE',
  RENEWABLE_ENERGY = 'RENEWABLE_ENERGY',
  WASTE_MANAGEMENT = 'WASTE_MANAGEMENT',
  INDUSTRIAL_DECARBONIZATION = 'INDUSTRIAL_DECARBONIZATION',
  NATURE_BASED_SOLUTIONS = 'NATURE_BASED_SOLUTIONS',
  GREEN_BUILDINGS = 'GREEN_BUILDINGS',
}

export enum ProjectBucket {
  BUCKET_A = 'BUCKET_A', // Verified credits ready
  BUCKET_B = 'BUCKET_B', // Registry registered, verification underway
  BUCKET_C = 'BUCKET_C', // Project idea / operational activity
}

export enum RegistryStandard {
  VERRA_VCS = 'VERRA_VCS',
  GOLD_STANDARD = 'GOLD_STANDARD',
  CCTS_BEE = 'CCTS_BEE',
}

export interface Project {
  id: string;
  name?: string;
  description?: string;
  sector: ProjectSector;
  bucket?: ProjectBucket;
  status: ProjectStatus;
  state?: string;
  district?: string;
  pincode?: string;
  estimatedAnnualCo2?: number;
  registryStatus?: RegistryStandard | 'IN_PROCESS' | 'NONE';
  registryStandard?: RegistryStandard | 'IN_PROCESS' | 'NONE';
  photoUrls?: string[];
  sdgGoals?: number[];
  bufferPoolPercent?: number;
  qualityScore?: number;
  eligibilityStatus?: 'PENDING' | 'PASSED' | 'CONDITIONAL' | 'FAILED';
  totalCreditsIssued?: number;
  creditsListed?: number;
  revenueEarned?: number;
  farmersEnrolled?: number;
  orgId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  version?: number;
  uploadedBy: string;
  isLocked: boolean;
  createdAt: string;
}

export type DocumentType =
  | 'PDD'
  | 'METHODOLOGY_EVIDENCE'
  | 'LAND_RIGHTS'
  | 'BOUNDARY_MAP'
  | 'VVB_ENGAGEMENT'
  | 'BASELINE_ASSESSMENT'
  | 'MONITORING_REPORT'
  | 'REGISTRY_CERTIFICATE'
  | 'OTHER';
