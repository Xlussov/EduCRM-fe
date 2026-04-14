import z from "zod";
import { Student } from "./students";
import { Status } from "./status";

export type Group = {
  id: string;
  name: string;
  status: Status;
  students_count: number;
};


// todo add status to group details in backend
export type GroupDetails = {
  id: string;
  name: string;
  branch_id: string;
  status: Status;
  students: Student[]
};

export const groupSchema = z.object({
  branch_id: z.string().min(1, "Branch is required"),
  name: z.string().min(1, "Group name is required"),
});

export type GroupFormValues = z.infer<typeof groupSchema>;