'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { IndividualLessonForm } from '@/components/lessons/individual-lesson-form';
import { GroupLessonForm } from '@/components/lessons/group-lesson-form';
import { TemplateLessonForm } from '@/components/lessons/template-lesson-form';
import { useBranchContext } from '@/providers/branch-provider';

export const CreateLesson = () => {
  const { currentBranchId } = useBranchContext();

  if (!currentBranchId) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/lessons">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Schedule New Lesson</h2>
      </div>
      <Tabs defaultValue="individual" className="max-w-xl mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="group">Group</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="focus-visible:outline-none focus-visible:ring-0">
          <IndividualLessonForm branchId={currentBranchId}/>
        </TabsContent>

        <TabsContent value="group" className="focus-visible:outline-none focus-visible:ring-0">
          <GroupLessonForm branchId={currentBranchId}/>
        </TabsContent>

        <TabsContent value="template" className="focus-visible:outline-none focus-visible:ring-0">
          <TemplateLessonForm branchId={currentBranchId}/>
        </TabsContent>
      </Tabs>
    </div>
  );
};
