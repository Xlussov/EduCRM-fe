'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmins } from '@/api/admins/queries';
import { ListSkeleton } from '@/components/list-skeleton';
import { AdminCard } from '@/components/admin-card';


export const AdminsList = () => {
  const { data: admins, isLoading, isError } = useAdmins();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Administrators</h2>
        <Button asChild>
          <Link href="/admins/create">
            <Plus className="h-4 w-4" />
            Create new admin
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="text-sm text-destructive">Failed to load administrators.</div>
      ) : admins?.length === 0 ? (
        <div className="text-sm text-muted-foreground">No administrators found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {admins?.map(admin => (
            <AdminCard admin={admin} key={admin.id} />
          ))}
        </div>
      )}
    </div>
  );
};