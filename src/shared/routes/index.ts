import { ROLES, Role } from '../types/roles';

export const ROUTES = {
  ROOT: '/dashboard',
  LOGIN: '/login',
  MY_SCHEDULE: '/my-schedule',
  MY_GROUPS: '/my-groups',
  BRANCHES: '/branches',
  SUBJECTS: '/subjects',
  STUDENTS: '/students',
  GROUPS: '/groups',
  PLANS: '/plans',
  SCHEDULE: '/schedule',
  ATTENDANCE: '/attendance',
  REPORTS: '/reports',
  ADMINS: '/admins',
  TEACHERS: '/teachers',
} as const;

export const ALLOWED_PATHS: Record<Role, string[]> = {
  [ROLES.TEACHER]: [
    ROUTES.ROOT,
    ROUTES.MY_SCHEDULE,
    ROUTES.ATTENDANCE,
    ROUTES.MY_GROUPS,
  ],
  [ROLES.ADMIN]: [
    ROUTES.ROOT,
    ROUTES.BRANCHES,
    ROUTES.SUBJECTS,
    ROUTES.STUDENTS,
    ROUTES.GROUPS,
    ROUTES.SCHEDULE,
    ROUTES.PLANS,
    ROUTES.ATTENDANCE,
    ROUTES.REPORTS,
    ROUTES.TEACHERS
  ],
  [ROLES.SUPERADMIN]: ['*'],
};

