"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StudentDetails, StudentFormValues } from "@/shared/types";

export const studentSchema = z.object({
  branch_id: z.string().min(1, "Branch is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  parent_name: z.string().min(1, "Parent name is required"),
  parent_phone: z.string().min(1, "Parent phone is required"),
  parent_email: z.string().email("Invalid parent email address"),
  parent_relationship: z.string().min(1, "Relationship is required (e.g. Mother, Father)"),
});

interface StudentFormProps {
  initialData?: StudentDetails;
  defaultBranchId: string;
  onSubmit: (data: StudentFormValues) => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  isLoading?: boolean;
}

export const StudentForm = ({ initialData, defaultBranchId, onSubmit, onArchive, onUnarchive, isLoading }: StudentFormProps) => {
  const isEditMode = !!initialData;
  const isArchived = initialData?.status === "ARCHIVED";
  const isDisabled = isLoading || isArchived;

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      branch_id: defaultBranchId,
      first_name: "",
      last_name: "",
      dob: "",
      email: "",
      phone: "",
      address: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      parent_relationship: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Student Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="first_name" render={({ field }) => (
              <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="last_name" render={({ field }) => (
              <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="dob" render={({ field }) => (
              <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+1 234 567 890" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="student@example.com" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Parent / Guardian Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="parent_name" render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="parent_relationship" render={({ field }) => (
              <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input placeholder="Mother" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="parent_phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+1 987 654 321" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="parent_email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="parent@example.com" disabled={isDisabled} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          {!isArchived && (
            <Button type="submit" disabled={isLoading}>
              {isEditMode ? "Save Changes" : "Create Student"}
            </Button>
          )}

          {isEditMode && !isArchived && onArchive && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onArchive} 
              disabled={isLoading}
            >
              Archive Student
            </Button>
          )}

          {isEditMode && isArchived && onUnarchive && (
            <Button 
              type="button" 
              variant="default" 
              onClick={onUnarchive} 
              disabled={isLoading}
            >
              Unarchive Student
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};