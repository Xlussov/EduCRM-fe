'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStudentById } from '@/api/students/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Pencil, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  User,
  Contact
} from 'lucide-react';

export default function StudentInfoPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: student, isLoading } = useStudentById(id);

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading student details...</div>;
  if (!student) return <div className="p-8 text-destructive">Student not found.</div>;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/students">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              {student.first_name} {student.last_name}
            </h2>
            <Badge 
              variant={student.status === 'ACTIVE' ? 'default' : 'outline'}
              className={student.status === 'ARCHIVED' ? 'text-amber-500 border-amber-500' : ''}
            >
              {student.status}
            </Badge>
          </div>
        </div>

        <Button asChild disabled={student.status === 'ARCHIVED'}>
          <Link href={`/students/edit/${student.id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Student
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium w-28">Full Name:</span>
              <span className="text-muted-foreground">{student.first_name} {student.last_name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium w-28">Date of Birth:</span>
              <span className="text-muted-foreground">{student.dob}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium w-28">Phone:</span>
              <span className="text-muted-foreground">{student.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium w-28">Email:</span>
              <span className="text-muted-foreground">{student.email || '—'}</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="font-medium w-28">Address:</span>
              <span className="text-muted-foreground">{student.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
              Parent / Guardian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium w-28">Full Name:</span>
              <span className="text-muted-foreground">{student.parent_name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Contact className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium w-28">Relationship:</span>
              <span className="text-muted-foreground">{student.parent_relationship}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium w-28">Phone:</span>
              <span className="text-muted-foreground">{student.parent_phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium w-28">Email:</span>
              <span className="text-muted-foreground">{student.parent_email || '—'}</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}