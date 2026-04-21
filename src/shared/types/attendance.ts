export interface AttendanceRecord {
  student_id: string;
  first_name: string;
  last_name: string;
  is_present: boolean;
  notes: string;
  status: string;
}

export interface UpdateAttendancePayload {
  attendance: {
    student_id: string;
    is_present: boolean;
    notes: string;
  }[];
}