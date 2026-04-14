'use client';

import Link from 'next/link';
import { MoreHorizontal, Phone, Building2, Pencil } from 'lucide-react';
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
import { Admin } from '@/shared/types';
import { ArchivedPlug } from '../archived-plug';

type Props = {
  admin: Admin;
};

export const AdminCard: FC<Props> = ({ admin }) => {
  const isArchived = admin.status === 'ARCHIVED';
  
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold">
            {admin.first_name} {admin.last_name}
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
            <DropdownMenuItem asChild>
              <Link href={`/admins/edit/${admin.id}`} className="flex items-center cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit admin
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 opacity-70" />
            {admin.phone}
          </div>
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 opacity-70 mt-0.5" />
            <span className="line-clamp-2">
              {admin.branches.length > 0 
                ? admin.branches.map(b => b.name).join(', ') 
                : 'No branches assigned'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};