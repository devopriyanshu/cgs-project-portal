// src/types/credit.types.ts

export enum CreditStatus {
  ISSUED = 'ISSUED',
  LISTED = 'LISTED',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  RETIRED = 'RETIRED',
  BUFFER = 'BUFFER',
}

export interface CarbonCredit {
  id: string;
  serialNumber: string;
  projectId: string;
  vintageYear: number;
  quantity: number;
  status: CreditStatus;
  qualityScore?: number;
  pricePerTonne?: number;
  listingId?: string;
  retiredBy?: string;
  retiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditLedgerEntry {
  id: string;
  creditId: string;
  action: string;
  fromStatus: CreditStatus;
  toStatus: CreditStatus;
  performedBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CreateListingPayload {
  pricePerTonne: number;
  minPurchaseQty: number;
  durationDays: 30 | 60 | 90;
  description?: string;
}
