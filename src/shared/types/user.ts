import { Role } from "./roles";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: Role;
}