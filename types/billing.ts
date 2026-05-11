import type { BillingPlan } from "./node";

export type PlanLimit = {
  projectLimit: number | null;
  nodeLimit: number;
  storageLimitMb: number;
  aiExtractionLimit: number;
};

export const planLimits: Record<BillingPlan, PlanLimit> = {
  FREE: {
    projectLimit: 3,
    nodeLimit: 100,
    storageLimitMb: 500,
    aiExtractionLimit: 100
  },
  TEAM: {
    projectLimit: 30,
    nodeLimit: 5000,
    storageLimitMb: 51200,
    aiExtractionLimit: 10000
  },
  BUSINESS: {
    projectLimit: null,
    nodeLimit: 100000,
    storageLimitMb: 1048576,
    aiExtractionLimit: 100000
  },
  ENTERPRISE: {
    projectLimit: null,
    nodeLimit: 1000000,
    storageLimitMb: 10485760,
    aiExtractionLimit: 1000000
  }
};
