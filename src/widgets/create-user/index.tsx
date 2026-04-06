'use client';

import { useBranches } from '@/api/branches/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminForm } from './AdminForm';
import { TeacherForm } from './TeacherForm';

export default function CreateUser() {
  const { data: branches, isLoading } = useBranches();

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight">Create Staff</h2>

      <Tabs defaultValue="admin" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admin">Administrator</TabsTrigger>
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-6">
          <AdminForm branches={branches || []} />
        </TabsContent>

        <TabsContent value="teacher" className="mt-6">
          <TeacherForm branches={branches || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
