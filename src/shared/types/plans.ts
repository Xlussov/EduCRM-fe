import { Status } from "./status";

export type PlanType = 'INDIVIDUAL' | 'GROUP';


export interface PlanPricingGrid {
  lessons: number;
  price: number;
}

export interface PlanSubject {
  id: string;
  name: string;
}

export interface PlanInfo {
  id: string;
  name: string;
  type: PlanType;
  pricing_grid: PlanPricingGrid[];
  subjects: PlanSubject[];
  status?: Status;
}