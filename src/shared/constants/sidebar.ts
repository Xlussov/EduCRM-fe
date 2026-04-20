import { ROUTES } from "../routes";
import { ROLES } from "../types";

export const sidebarPaths = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', url: ROUTES.ROOT, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
      { title: 'My Schedule', url: ROUTES.MY_SCHEDULE, roles: [ROLES.TEACHER] },
      { title: 'My Groups', url: ROUTES.MY_GROUPS, roles: [ROLES.TEACHER] },
    ],
  },
  {
    title: 'Management',
    items: [
      { title: 'Branches', url: ROUTES.BRANCHES, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
      { title: 'Subjects', url: ROUTES.SUBJECTS, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
      { title: 'Students', url: ROUTES.STUDENTS, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
      { title: 'Groups', url: ROUTES.GROUPS, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
      { title: 'Plans', url: ROUTES.PLANS, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
      { title: 'Admins', url: ROUTES.ADMINS, roles: [ROLES.SUPERADMIN] },
      { title: 'Teachers', url: ROUTES.TEACHERS, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
    ],
  },
  {
    title: 'Academics',
    items: [
      { title: 'Schedule', url: ROUTES.LESSONS, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
      // { title: 'Schedule', url: ROUTES.SCHEDULE, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
      { title: 'Attendance', url: ROUTES.ATTENDANCE, roles: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.TEACHER] },
      { title: 'Reports', url: ROUTES.REPORTS, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
    ],
  },
];