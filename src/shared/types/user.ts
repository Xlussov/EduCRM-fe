import { Role } from "./roles";

export interface Branch {
  id: string;
  name: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  role: Role;
  branches: Branch[];
}
