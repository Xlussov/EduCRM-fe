'use client';

import Link from 'next/link';
import { MoreHorizontal, Phone, Building2, Pencil, User, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { FC } from 'react';
import { ArchivedPlug } from '../archived-plug';
import { User as UserType } from '@/shared/types';

type Props = {
  user: UserType;
  path: 'teachers' | 'admins';
};

export const UserCard: FC<Props> = ({ user, path }) => {
  const isArchived = user.status === 'ARCHIVED';

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold">
            {user.first_name} {user.last_name}
          </CardTitle>
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
            {path === 'teachers' && (
              <DropdownMenuItem asChild>
                <Link
                  href={`/${path}/${user.id}/statistics`}
                  className="flex items-center cursor-pointer"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  View Statistics
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={`/${path}/edit/${user.id}`} className="flex items-center cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit user
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 opacity-70" />
            {user.phone}
          </div>
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 opacity-70 mt-0.5" />
            <span className="line-clamp-2">{user.branches.map(b => b.name).join(', ')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
