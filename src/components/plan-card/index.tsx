'use client';

import Link from 'next/link';
import { MoreHorizontal, Pencil, Users, User, BookOpen, DollarSign } from 'lucide-react';
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
import { PlanInfo } from '@/shared/types';
import { ArchivedPlug } from '@/components/archived-plug';

type Props = {
  plan: PlanInfo;
};

export const PlanCard: FC<Props> = ({ plan }) => {
  const isArchived = plan.status === 'ARCHIVED';
  const TypeIcon = plan.type === 'GROUP' ? Users : User;

  const MAX_DISPLAY_TIERS = 3;
  const displayedGrid = plan.pricing_grid.slice(0, MAX_DISPLAY_TIERS);
  const hasMoreTiers = plan.pricing_grid.length > MAX_DISPLAY_TIERS;
  const hiddenTiersCount = plan.pricing_grid.length - MAX_DISPLAY_TIERS;

  return (
    <Card className="flex flex-col justify-between" key={plan.id}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
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
              <Link href={`/plans/${plan.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                View plan
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4 mt-4">
        <div className="flex items-center text-sm font-medium">
          <TypeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {plan.type === 'GROUP' ? 'Group Lessons' : 'Individual Lessons'}
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Subjects</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plan.subjects.map(subject => (
              <span
                key={subject.id}
                className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {subject.name}
              </span>
            ))}
            {plan.subjects.length === 0 && (
              <span className="text-xs text-muted-foreground italic">No subjects linked</span>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Pricing Grid</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium text-muted-foreground">Lessons/mo</div>
            <div className="font-medium text-muted-foreground text-right">Price/lesson</div>

            {displayedGrid.map((tier, index) => (
              <div key={index} className="contents">
                <div>{tier.lessons}</div>
                <div className="text-right font-medium">${tier.price}</div>
              </div>
            ))}

            {hasMoreTiers && (
              <div className="contents text-muted-foreground">
                <div className="pt-1">...</div>
                <div className="text-right pt-1 text-xs italic">+{hiddenTiersCount} more</div>
              </div>
            )}

            {plan.pricing_grid.length === 0 && (
              <div className="col-span-2 text-xs text-muted-foreground italic">
                No pricing tiers defined
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
