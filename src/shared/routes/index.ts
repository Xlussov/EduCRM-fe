import { ROLES, Role } from '../types/roles';

export const ROUTES = {
  ROOT: '/dashboard',
  LOGIN: '/login',
  STATISTICS: '/statistics', // Новый роут
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
    ROUTES.LESSONS,
    ROUTES.ATTENDANCE,
    ROUTES.STATISTICS,
    ROUTES.STUDENTS,
    ROUTES.GROUPS,
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

export type DeniedPath = { path: string; exact: boolean };

export const DENIED_PATHS: Partial<Record<Role, DeniedPath[]>> = {
  [ROLES.TEACHER]: [
    { path: ROUTES.STUDENTS, exact: true },
    { path: ROUTES.GROUPS, exact: true },
    { path: `${ROUTES.STUDENTS}/edit`, exact: false },
    { path: `${ROUTES.STUDENTS}/create`, exact: false },
    { path: `${ROUTES.GROUPS}/edit`, exact: false },
    { path: `${ROUTES.GROUPS}/create`, exact: false },
  ],
};

export const GLOBAL_SWITCHER_HIDDEN_ROUTES = [ROUTES.BRANCHES, ROUTES.ADMINS, ROUTES.TEACHERS, ROUTES.LESSONS];