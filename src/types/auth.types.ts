// src/types/auth.types.ts
// ⚠️ Keep in sync with backend Prisma enums

export enum UserRole {
  PROJECT_DEVELOPER = 'PROJECT_DEVELOPER',
  FPO_OFFICER = 'FPO_OFFICER',
  FARMER = 'FARMER',
  CORPORATE_BUYER = 'CORPORATE_BUYER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// Matches Prisma enum OrganizationType exactly
export enum OrganizationType {
  CORPORATE = 'CORPORATE',
  FPO = 'FPO',
  NGO = 'NGO',
  MUNICIPAL_BODY = 'MUNICIPAL_BODY',
  RENEWABLE_DEVELOPER = 'RENEWABLE_DEVELOPER',
  WASTE_MANAGEMENT_FIRM = 'WASTE_MANAGEMENT_FIRM',
  INDUSTRIAL = 'INDUSTRIAL',
  INVESTOR = 'INVESTOR',
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  profile?: UserProfile;
  // Derived convenience fields (populated in UI from profile)
  firstName?: string;
  lastName?: string;
  orgId?: string;
  orgName?: string;
  kycStatus?: KycStatus;
  createdAt: string;
  updatedAt: string;
}

export type KycStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Matches backend RegisterDto
export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  phone?: string;
}

// Matches backend CreateOrgDto
export interface CreateOrgPayload {
  name: string;
  legalName: string;
  type: OrganizationType;
  registeredAddress: string;
  state: string;
  district: string;
  pincode: string;
  gstin?: string;
  cinNumber?: string;
  panNumber?: string;
  website?: string;
}
