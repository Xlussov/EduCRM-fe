'use client';

import { useUser } from '@/api/auth/queries';
import { ROLES } from '@/shared/types';
import Dashboard from '@/widgets/statistics/dashboard';
import TeacherStatistics from '@/widgets/statistics/teacher-statistics';

export default function Page() {
  const { data: userData, isLoading } = useUser();
  const isAdmin = userData?.role === ROLES.ADMIN || userData?.role === ROLES.SUPERADMIN;

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading...</div>;

  return isAdmin ? <Dashboard /> : <TeacherStatistics />;
}
