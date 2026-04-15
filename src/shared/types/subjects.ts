export interface SubjectInfo {
  id: string;
  name: string;
  description: string;
  branch_id: string;
  status: 'ACTIVE' | 'ARCHIVED';
  created_at?: string;
  updated_at?: string;
}
