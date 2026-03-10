// src/types/fpo.types.ts

export interface FpoDetails {
  id: string;
  orgId: string;
  name: string;
  registrationNumber: string;
  promoterName?: string;
  operatingDistricts: string[];
  primaryCrops: string[];
  kycStatus: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface FpoStats {
  totalFarmers: number;
  totalAcres: number;
  totalCreditsGenerated: number;
  totalPayoutsDistributed: number;
  activeFarmers: number;
  pendingKycFarmers: number;
}

export interface Farmer {
  id: string;
  fpoId: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  aadhaarHash: string;
  village: string;
  district: string;
  state: string;
  pincode?: string;
  upiId?: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  status: 'ACTIVE' | 'INACTIVE';
  totalAcres?: number;
  enrolledAt: string;
  farms?: Farm[];
}

export interface Farm {
  id: string;
  farmerId: string;
  lat?: number;
  lng?: number;
  totalAcres: number;
  primaryCrop: string;
  soilType?: string;
  irrigationType?: string;
}

export interface FarmerPayout {
  id: string;
  farmerId: string;
  farmer?: { firstName: string; lastName: string };
  farmerName: string;
  amount: number;
  upiId?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  orderReference?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeChange {
  id: string;
  farmerId: string;
  season: string;
  stubblebBurning: boolean;
  ureaReductionPercent?: number;
  noTill: boolean;
  evidenceUrls?: string[];
  createdAt: string;
}

export interface BatchEnrollmentResult {
  batchId: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalRows: number;
  processedRows: number;
  successRows: number;
  errorRows: number;
  errors?: Array<{ row: number; error: string }>;
}
