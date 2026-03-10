// src/types/organization.types.ts

import type { OrganizationType } from '@/types/auth.types';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  gstin?: string;
  cin?: string;
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  district?: string;
  pincode?: string;
  kycStatus: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  orgId: string;
  role: string;
  email: string;
  name: string;
  joinedAt: string;
}
