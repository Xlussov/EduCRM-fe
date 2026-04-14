"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useGroupById, useGroupStudents } from "@/api/groups/queries";
import { useActiveStudents } from "@/api/students/queries";
import { ManageGroupStudents } from "@/components/manage-group-students";
import { Student } from "@/shared/types";

export default function GroupStudents() {
  const params = useParams();
  const id = params.id as string;

  const { data: group, isLoading: isGroupLoading } = useGroupById(id);
  const { data: branchStudents = [], isLoading: isBranchStudentsLoading } = useActiveStudents(group?.branch_id || null);
  const { data: groupStudents = [], isLoading: isGroupStudentsLoading } = useGroupStudents(id);

  const isLoading = isGroupLoading || isBranchStudentsLoading || isGroupStudentsLoading;

  const allTableStudents = useMemo(() => {
    const map = new Map<string, Student>();

    branchStudents.forEach((s) => map.set(s.id, s));

    groupStudents.forEach((s) => {
      if (!map.has(s.id)) {
        map.set(s.id, s);
      }
    });

    return Array.from(map.values());
  }, [branchStudents, groupStudents]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!group) {
    return <div className="p-8">Group not found</div>;
  }

  const initialStudentIds = groupStudents.map((s) => s.id);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/groups`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{group.name}</h2>
          <p className="text-muted-foreground">Manage students for this group</p>
        </div>
      </div>

      <ManageGroupStudents
        groupId={id} 
        allStudents={allTableStudents} 
        initialStudentIds={initialStudentIds} 
      />
    </div>
  );
}