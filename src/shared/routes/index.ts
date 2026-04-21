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
  LESSONS: '/lessons',
} as const;

export const ALLOWED_PATHS: Record<Role, string[]> = {
  [ROLES.TEACHER]: [
    ROUTES.ROOT,
    // ROUTES.MY_SCHEDULE,
    ROUTES.SCHEDULE,
    ROUTES.ATTENDANCE,
    ROUTES.LESSONS,

    // ROUTES.MY_GROUPS,
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
    ROUTES.TEACHERS,
    ROUTES.LESSONS,
  ],
  [ROLES.SUPERADMIN]: ['*'],
};

export const GLOBAL_SWITCHER_HIDDEN_ROUTES = [ROUTES.BRANCHES, ROUTES.ADMINS, ROUTES.TEACHERS, ROUTES.LESSONS];