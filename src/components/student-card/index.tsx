"use client";

import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Phone, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FC } from 'react';
import { Student } from '@/shared/types';
import Link from 'next/link';
import { ArchivedPlug } from '../archived-plug';

type Props = {
  student: Student;
};

export const StudentCard: FC<Props> = ({ student }) => {
  const isArchived = student.status === 'ARCHIVED';

  return (
    <div className="p-4 border rounded-xl bg-card text-card-foreground flex justify-between items-start">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {student.first_name} {student.last_name}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          {student.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              <span>{student.phone}</span>
            </div>
          )}
          {student.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <span>{student.email}</span>
            </div>
          )}
        </div>

        {isArchived && (
          <div className="pt-1">
            <ArchivedPlug />
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link href={`/students/${student.id}`} className="flex items-center cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/students/edit/${student.id}`}
              className="flex items-center cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit student
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
