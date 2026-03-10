// src/types/notification.types.ts

// Must be an enum (not a type alias) so it can be used as both a type and a value.
export enum NotificationCategory {
  PROJECT = 'PROJECTS',
  PAYMENT = 'PAYMENTS',
  MRV = 'MRV',
  KYC = 'KYC',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  body: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}
