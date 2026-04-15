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
  branches: Branch[] | Branch;
}

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  branches: Branch[];
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  branch_id: string;
}