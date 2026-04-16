export interface SubscriptionPlanRef {
  id: string;
  name: string;
}

export interface SubscriptionSubjectRef {
  id: string;
  name: string;
}

export interface StudentSubscription {
  id: string;
  plan: SubscriptionPlanRef;
  subject: SubscriptionSubjectRef;
  start_date: string;
  created_at: string;
}

export interface AssignSubscriptionValues {
  plan_id: string;
  subject_id: string;
  start_date: string;
}