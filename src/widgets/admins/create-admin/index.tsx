'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminForm, AdminFormValues } from '@/components/admin-form';
import { useActiveBranches } from '@/api/branches/queries';
import { useCreateAdmin } from '@/api/admins/mutations';

export default function CreateAdmin() {
  const { data: branches, isLoading: isBranchesLoading } = useActiveBranches();
  const createAdmin = useCreateAdmin();

  const onSubmit = (data: AdminFormValues) => {
    createAdmin.mutate(data);
  };

  if (isBranchesLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admins">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Administrator</h2>
          <p className="text-muted-foreground">Add a new administrator and assign branches.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <AdminForm
          branches={branches || []}
          onSubmit={onSubmit}
          isLoading={createAdmin.isPending}
        />
      </div>
    </div>
  );
}