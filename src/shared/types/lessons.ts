export type LessonStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface LessonInfo {
  id: string;
  branch_id: string;
  subject_id: string;
  teacher_id: string;
  student_id?: string;
  group_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  status: LessonStatus;
  subject?: { id: string; name: string };
  teacher?: { id: string; first_name: string; last_name: string };
  student?: { id: string; first_name: string; last_name: string };
  group?: { id: string; name: string };
}

export interface CreateIndividualLessonPayload {
  branch_id: string;
  date: string;
  start_time: string;
  end_time: string;
  student_id: string;
  subject_id: string;
  teacher_id: string;
}

export interface CreateGroupLessonPayload {
  branch_id: string;
  date: string;
  start_time: string;
  end_time: string;
  group_id: string;
  subject_id: string;
  teacher_id: string;
}

export interface CreateTemplatePayload {
  branch_id: string;
  days_of_week: number[]; 
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  subject_id: string;
  teacher_id: string;
  student_id?: string;
  group_id?: string;
}