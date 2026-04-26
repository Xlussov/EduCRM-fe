'use client';

import { useState, useMemo } from 'react';
import { useActiveStudents } from '@/api/students/queries';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Loader2, ChevronRight, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Student } from '@/shared/types';

interface StudentLookupProps {
  branchId?: string | null;
  preloadedStudents?: Student[];
  onSelectStudent?: (studentId: string) => void;
  selectedStudentId?: string | null;
  actionLabel?: string;
}

export const StudentLookup = ({ 
  branchId, 
  preloadedStudents,
  onSelectStudent, 
  selectedStudentId,
  actionLabel = 'Select'
}: StudentLookupProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: fetchedStudents, isLoading: isFetching } = useActiveStudents(branchId || null);

  const studentsData = preloadedStudents || fetchedStudents;
  const isLoading = !preloadedStudents && isFetching;

  const filteredStudents = useMemo(() => {
    if (!studentsData) return [];
    if (!searchTerm) return studentsData;
    
    const lowercasedTerm = searchTerm.toLowerCase();
    return studentsData.filter(student => 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(lowercasedTerm) ||
      student.phone?.toLowerCase().includes(lowercasedTerm)
    );
  }, [studentsData, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name or phone..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border max-h-[300px] overflow-y-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                {onSelectStudent && <TableHead className="text-right">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={onSelectStudent ? 3 : 2} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={onSelectStudent ? 3 : 2} className="h-24 text-center text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow 
                    key={student.id}
                    className={selectedStudentId === student.id ? 'bg-muted/50' : ''}
                  >
                    <TableCell className="font-medium">
                      <Link 
                        href={`/students/${student.id}`} 
                        className="flex items-center gap-2 hover:underline hover:text-primary transition-colors w-fit"
                      >
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        {student.first_name} {student.last_name}
                      </Link>
                    </TableCell>
                    <TableCell>{student.phone || '—'}</TableCell>
                    {onSelectStudent && (
                      <TableCell className="text-right">
                        <Button 
                          variant={selectedStudentId === student.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => onSelectStudent(student.id)}
                        >
                          {selectedStudentId === student.id ? 'Viewing' : actionLabel}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};