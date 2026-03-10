// src/lib/constants/query-keys.ts

export const QUERY_KEYS = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  organizations: {
    mine: () => ['organizations', 'mine'] as const,
    members: (orgId: string) => ['organizations', orgId, 'members'] as const,
  },
  kyc: {
    status: () => ['kyc', 'status'] as const,
  },
  projects: {
    all: () => ['projects'] as const,
    list: (filters?: Record<string, unknown>) => ['projects', 'list', filters] as const,
    detail: (id: string) => ['projects', id] as const,
    documents: (id: string) => ['projects', id, 'documents'] as const,
    eligibility: (id: string) => ['projects', id, 'eligibility'] as const,
    qualityScore: (id: string) => ['projects', id, 'quality-score'] as const,
  },
  mrv: {
    list: (projectId: string) => ['mrv', 'list', projectId] as const,
    detail: (projectId: string, mrvId: string) => ['mrv', projectId, mrvId] as const,
    satelliteStatus: (projectId: string, mrvId: string) => ['mrv', projectId, mrvId, 'satellite'] as const,
    soilSamples: (mrvId: string) => ['mrv', mrvId, 'soil-samples'] as const,
  },
  credits: {
    list: (filters?: Record<string, unknown>) => ['credits', 'list', filters] as const,
    detail: (id: string) => ['credits', id] as const,
    ledger: (id: string) => ['credits', id, 'ledger'] as const,
    myListings: () => ['credits', 'my-listings'] as const,
  },
  fpo: {
    details: () => ['fpo', 'details'] as const,
    stats: () => ['fpo', 'stats'] as const,
    farmers: (filters?: Record<string, unknown>) => ['fpo', 'farmers', filters] as const,
    farmer: (id: string) => ['fpo', 'farmers', id] as const,
    farms: (farmerId: string) => ['fpo', 'farmers', farmerId, 'farms'] as const,
    batchStatus: (batchId: string) => ['fpo', 'batch', batchId] as const,
    practiceChanges: () => ['fpo', 'practice-changes'] as const,
    payouts: (filters?: Record<string, unknown>) => ['fpo', 'payouts', filters] as const,
  },
  notifications: {
    list: (page?: number) => ['notifications', page] as const,
    unreadCount: () => ['notifications', 'unread-count'] as const,
  },
} as const;
