"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { BranchInfo, GroupDetails, GroupFormValues, groupSchema } from "@/shared/types";


interface GroupFormProps {
  initialData?: GroupDetails;
  defaultBranchId: string;
  branches: BranchInfo[];
  onSubmit: (data: GroupFormValues) => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  isLoading?: boolean;
}

export const GroupForm = ({ 
  initialData, 
  defaultBranchId, 
  branches,
  onSubmit, 
  onArchive, 
  onUnarchive, 
  isLoading 
}: GroupFormProps) => {
  const isEditMode = !!initialData;
  const isArchived = initialData?.status === "ARCHIVED";
  const isDisabled = isLoading || isArchived;

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: initialData || {
      branch_id: defaultBranchId,
      name: "",
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
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Frontend A1" disabled={isDisabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branch_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Branch</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={isDisabled}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? branches.find((b) => b.id === field.value)?.name
                        : "Select a branch"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Search branch..." />
                    <CommandList>
                      <CommandEmpty>No branch found.</CommandEmpty>
                      <CommandGroup>
                        {branches.map((branch) => (
                          <CommandItem
                            value={branch.name}
                            key={branch.id}
                            onSelect={() => {
                              form.setValue("branch_id", branch.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                branch.id === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {branch.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4 pt-4">
          {!isArchived && (
            <Button type="submit" disabled={isLoading}>
              {isEditMode ? "Save Changes" : "Create Group"}
            </Button>
          )}

          {isEditMode && !isArchived && onArchive && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onArchive} 
              disabled={isLoading}
            >
              Archive Group
            </Button>
          )}

          {isEditMode && isArchived && onUnarchive && (
            <Button 
              type="button" 
              variant="default" 
              onClick={onUnarchive} 
              disabled={isLoading}
            >
              Unarchive Group
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};