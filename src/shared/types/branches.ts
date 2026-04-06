type Status = 'ACTIVE' | 'ARCHIVED';

export type BranchInfo = {
  id: string;
  name: string;
  address: string;
  city: string;
  status: Status;
};