'use client';

import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminForm, AdminFormValues } from '@/components/admin-form';
import { useActiveBranches } from '@/api/branches/queries';
import { useAdminById } from '@/api/admins/queries';
import { useUpdateAdmin, useArchiveAdmin, useUnarchiveAdmin } from '@/api/admins/mutations';

export default function EditAdmin() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: branches, isLoading: isBranchesLoading } = useActiveBranches();
  const { data: admin, isLoading: isAdminLoading } = useAdminById(id);

  const updateAdmin = useUpdateAdmin(id);
  const archiveAdmin = useArchiveAdmin(id);
  const unarchiveAdmin = useUnarchiveAdmin(id);

  const isPending = updateAdmin.isPending || archiveAdmin.isPending || unarchiveAdmin.isPending;

  const onSubmit = (data: AdminFormValues) => {
    const { password, ...payload } = data;

    updateAdmin.mutate(payload);
  };

  if (isBranchesLoading || isAdminLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!admin) {
    return <div className="p-8">Administrator not found.</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Administrator</h2>
          <p className="text-muted-foreground">
            Update administrator details and branch assignments.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <AdminForm
          branches={branches || []}
          initialData={admin}
          onSubmit={onSubmit}
          onArchive={() => archiveAdmin.mutate()}
          onUnarchive={() => unarchiveAdmin.mutate()}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
