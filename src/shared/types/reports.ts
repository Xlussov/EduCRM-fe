export interface BranchStatistics {
  active_students: number;
  attendance_percentage: number;
  cancelled_lessons: number;
  completed_lessons: number;
}

export interface StudentAttendanceItem {
  date: string;
  is_present: boolean;
  notes: string;
  subject_name: string;
  time: string;
}

export interface StudentAttendanceSummary {
  attendance_percentage: number;
  attended: number;
  missed: number;
  total_lessons: number;
}

export interface StudentAttendanceReport {
  items: StudentAttendanceItem[];
  summary: StudentAttendanceSummary;
}

export interface TeacherStatistics {
  cancelled_lessons: number;
  completed_lessons: number;
  scheduled_lessons: number;
}
