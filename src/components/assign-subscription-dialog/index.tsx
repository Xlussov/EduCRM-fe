'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { usePlans } from '@/api/plans/queries';
import { Loader2, Plus } from 'lucide-react';
import { AssignSubscriptionValues } from '@/shared/types';
import { useAssignSubscription } from '@/api/subscriptions/mutations';

const assignSchema = z.object({
  plan_id: z.string().min(1, 'Please select a plan'),
  subject_id: z.string().min(1, 'Please select a subject'),
  start_date: z.string().min(1, 'Start date is required'),
});

interface Props {
  studentId: string;
  branchId: string;
}

export const AssignSubscriptionDialog = ({ studentId, branchId }: Props) => {
  const [open, setOpen] = useState(false);
  const { data: plans, isLoading: isPlansLoading } = usePlans(branchId);
  const { mutate: assignSubscription, isPending } = useAssignSubscription(studentId);

  const form = useForm<AssignSubscriptionValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      plan_id: '',
      subject_id: '',
      start_date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedPlanId = form.watch('plan_id');
  const selectedPlan = plans?.find((p) => p.id === selectedPlanId);
  const availableSubjects = selectedPlan?.subjects || [];

  const onSubmit = (data: AssignSubscriptionValues) => {
      console.log(data)

    assignSubscription(data, {
      
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Assign Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Subscription</DialogTitle>
          <DialogDescription>
            Select a pricing plan and subject for this student.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="plan_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Plan</FormLabel>
                  <Select
                    disabled={isPlansLoading || isPending}
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue('subject_id', '');
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plans?.filter(p => p.status !== 'ARCHIVED').map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    disabled={!selectedPlanId || isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign Subscription
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};