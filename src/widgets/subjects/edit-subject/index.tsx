'use client';

import { useParams } from 'next/navigation';
import { SubjectForm, SubjectFormValues } from '@/components/subject-form';
import { useUpdateSubject, useArchiveSubject, useUnarchiveSubject } from '@/api/subjects/mutations';
import { useSubjectById } from '@/api/subjects/queries';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditSubject() {
  const params = useParams();
  const subjectId = params.id as string;

  const { data: subject, isLoading: isFetching, isError } = useSubjectById(subjectId);
  const updateSubject = useUpdateSubject(subjectId);
  const archiveSubject = useArchiveSubject(subjectId);
  const unarchiveSubject = useUnarchiveSubject(subjectId);

  const onSubmit = (data: SubjectFormValues) => {
    updateSubject.mutate(data);
  };

  const onArchive = () => {
    archiveSubject.mutate();
  };

  const onUnarchive = () => {
    unarchiveSubject.mutate();
  };

  const isPending = updateSubject.isPending || archiveSubject.isPending || unarchiveSubject.isPending;

  if (isFetching) {
    return <div className="p-8 pt-6">Loading...</div>;
  }

  if (isError || !subject) {
    return (
      <div className="p-8 pt-6">
        <div className="text-destructive">Failed to load subject data.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/subjects">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Subject</h2>
      </div>

        <SubjectForm
          initialData={subject}
          defaultBranchId={subject.branch_id}
          onSubmit={onSubmit}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          isLoading={isPending}
        />
    </div>
  );
}