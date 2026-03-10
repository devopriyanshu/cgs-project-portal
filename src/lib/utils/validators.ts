// src/lib/utils/validators.ts
import { z } from 'zod';

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Valid Indian mobile number required (starts with 6–9)');

export const gstinSchema = z
  .string()
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    'Invalid GSTIN format'
  )
  .optional()
  .or(z.literal(''));

export const pincodeSchema = z
  .string()
  .regex(/^[1-9][0-9]{5}$/, 'Invalid PIN code')
  .optional()
  .or(z.literal(''));

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character');

export const aadhaarSchema = z
  .string()
  .regex(/^\d{12}$/, 'Aadhaar must be 12 digits');

export const emailSchema = z.string().email('Enter a valid email address');
