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
import { BranchInfo } from "@/shared/types";

const branchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
});

export type BranchFormValues = z.infer<typeof branchSchema>;

interface BranchFormProps {
  initialData?: BranchInfo;
  onSubmit: (data: BranchFormValues) => void;
  onArchive?: () => void;
  isLoading?: boolean;
}

export const BranchForm = ({ initialData, onSubmit, onArchive, isLoading }: BranchFormProps) => {
  const isEditMode = !!initialData;

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      city: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Central Branch" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="New York" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isEditMode ? "Save Changes" : "Create Branch"}
          </Button>

          {isEditMode && initialData?.status !== "ARCHIVED" && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onArchive} 
              disabled={isLoading}
            >
              Archive
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};