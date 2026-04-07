import { Status } from './status';

export type StudentDetails = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  branch_id: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  parent_relationship: string;
  status: Status; 
}


export type StudentFormValues = Omit<StudentDetails, 'id' | 'status'>;


export type Student = Pick<StudentDetails, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'status'>;
