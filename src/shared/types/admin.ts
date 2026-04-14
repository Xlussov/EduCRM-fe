export interface AdminBranch {
  id: string;
  name: string;
}

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  branches: AdminBranch[];
}