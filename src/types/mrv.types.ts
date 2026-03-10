// src/types/mrv.types.ts

export enum MrvStatus {
  DATA_COLLECTION = 'DATA_COLLECTION',
  MONITORING_ACTIVE = 'MONITORING_ACTIVE',
  REPORT_COMPILED = 'REPORT_COMPILED',
  VVB_SUBMITTED = 'VVB_SUBMITTED',
  VVB_UNDER_REVIEW = 'VVB_UNDER_REVIEW',
  REGISTRY_PENDING = 'REGISTRY_PENDING',
  VERIFIED = 'VERIFIED',
}

export enum SatelliteStatus {
  NOT_STARTED = 'NOT_STARTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface MrvRecord {
  id: string;
  projectId: string;
  period: string; // e.g. "Kharif 2024"
  startDate: string;
  endDate?: string;
  status: MrvStatus;
  satelliteStatus: SatelliteStatus;
  estimatedCredits?: number;
  satelliteData?: SatelliteData;
  vvbQueryCount?: number;
  estimatedIssuanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SatelliteData {
  ndviValues: Array<{ date: string; value: number }>;
  burnDetection: boolean;
  tillageSignatures: Array<{ farmId: string; value: number }>;
  processedAt: string;
}

export interface SoilSample {
  id: string;
  mrvId: string;
  farmName: string;
  sampleDate: string;
  organicCarbonPercent: number;
  phLevel: number;
  status: 'PENDING' | 'VALIDATED' | 'REJECTED';
  labName?: string;
  createdAt: string;
}

export interface VvbQuery {
  id: string;
  mrvId: string;
  queryText: string;
  status: 'OPEN' | 'RESPONDED' | 'RESOLVED';
  response?: string;
  raisedAt: string;
  resolvedAt?: string;
}
