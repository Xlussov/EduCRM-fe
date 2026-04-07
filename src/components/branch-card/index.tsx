'use client';

import Link from 'next/link';
import { MoreHorizontal, MapPin, Pencil } from 'lucide-react';
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
import { BranchInfo } from '@/shared/types';

type Props = {
  branch: BranchInfo;
};

export const BranchCard: FC<Props> = ({ branch }) => {
  return (
    <Card className="flex flex-col justify-between" key={branch.id}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold">{branch.name}</CardTitle>
          {branch.status === 'ARCHIVED' && (
            <span
              className="
                      inline-block w-fit h-fit whitespace-nowrap leading-none flex-shrink-0 
                      rounded border-2 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider 
                      border-amber-500 text-amber-700 bg-amber-500/10 
                      dark:border-amber-400 dark:text-amber-400
                    "
            >
              ARCHIVED
            </span>
          )}
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

            <DropdownMenuItem disabled={branch.status === 'ARCHIVED'}>
              <Pencil className="h-4 w-4" />
              <Link href={`/branches/edit/${branch.id}`}>Edit branch</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <MapPin className="mr-2 h-4 w-4 opacity-70" />
          {branch.address}, {branch.city}
        </div>
      </CardContent>
    </Card>
  );
};
