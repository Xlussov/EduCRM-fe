'use client';

import Link from 'next/link';
import { MoreHorizontal, Eye, Pencil, Users } from 'lucide-react';
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
import { Group } from '@/shared/types';
import { ArchivedPlug } from '../archived-plug';

type Props = {
  group: Group;
};

export const GroupCard: FC<Props> = ({ group }) => {
  const isArchived = group.status === 'ARCHIVED';

  return (
    <Card className="flex flex-col justify-between" key={group.id}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold">{group.name}</CardTitle>

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
              <Link href={`/groups/${group.id}`} className="flex items-center cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Manage group
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={`/groups/edit/${group.id}`} className="flex items-center cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit group
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <Users className="mr-2 h-4 w-4 opacity-70" />
          {group.students_count || 0} Students
        </div>
      </CardContent>
    </Card>
  );
};
