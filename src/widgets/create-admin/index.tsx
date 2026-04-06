'use client';

import { useActiveBranches } from '@/api/branches/queries';
import { AdminForm } from './AdminForm';

export default function CreateUser() {
  const { data: branches, isLoading } = useActiveBranches();

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight">Create Admin</h2>
      <AdminForm branches={branches || []} />
    </div>
  );
}
