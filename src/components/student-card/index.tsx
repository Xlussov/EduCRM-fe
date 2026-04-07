import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil } from 'lucide-react';
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

type Props = {
  student: Student;
};

export const StudentCard: FC<Props> = ({ student }) => {
  const isArchived = student.status === 'ARCHIVED';

  return (
    <div className="p-4 border rounded-xl bg-card text-card-foreground flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">
          {student.first_name} {student.last_name}
        </h3>

        {isArchived && (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500 mt-2">
            ARCHIVED
          </Badge>
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

          <DropdownMenuItem>
            <Eye className="h-4 w-4" />
            <Link href={`/students/${student.id}`}>View details</Link>
          </DropdownMenuItem>

          <DropdownMenuItem disabled={isArchived}>
            <Pencil className="h-4 w-4" />
            <Link href={`/students/edit/${student.id}`}>Edit student</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
