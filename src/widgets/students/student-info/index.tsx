'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStudentById } from '@/api/students/queries';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Pencil } from 'lucide-react';
import { ArchivedPlug } from '@/components/archived-plug';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentInfoCard } from '@/components/student-info-card';
import { StudentSubscriptions } from '@/components/student-subscriptions';

export default function StudentInfoPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: student, isLoading } = useStudentById(id);

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading student details...</div>;
  if (!student) return <div className="p-8 text-destructive">Student not found.</div>;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/students">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              {student.first_name} {student.last_name}
            </h2>
            {student.status === 'ARCHIVED' && <ArchivedPlug />}
          </div>
        </div>

        <Button asChild disabled={student.status === 'ARCHIVED'}>
          <Link href={`/students/edit/${student.id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Student
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <StudentInfoCard student={student} />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <StudentSubscriptions studentId={student.id} branchId={student.branch_id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
