export const ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
} as const;


export type Role = keyof typeof ROLES;