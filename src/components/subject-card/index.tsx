'use client';

import Link from 'next/link';
import { MoreHorizontal, BookOpen, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FC } from 'react';
import { SubjectInfo } from '@/shared/types';
import { ArchivedPlug } from '@/components/archived-plug';

type Props = {
  subject: SubjectInfo;
};

export const SubjectCard: FC<Props> = ({ subject }) => {
  const isArchived = subject.status === 'ARCHIVED';

  return (
    <Card className="flex flex-col justify-between" key={subject.id}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold">{subject.name}</CardTitle>
          {isArchived && <ArchivedPlug />}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/subjects/edit/${subject.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit subject
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-start text-sm text-muted-foreground mt-4">
          <BookOpen className="mr-2 h-4 w-4 opacity-70 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{subject.description || 'No description'}</span>
        </div>
      </CardContent>
    </Card>
  );
};