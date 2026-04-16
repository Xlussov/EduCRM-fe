import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  User,
  Contact
} from 'lucide-react';
import { StudentDetails } from '@/shared/types'; 

interface Props {
  student: StudentDetails;
}

export const StudentInfoCard = ({ student }: Props) => {
  return (
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
  );
};
