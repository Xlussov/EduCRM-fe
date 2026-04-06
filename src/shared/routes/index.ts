import { ROLES, Role } from '../types/roles';

export const ALLOWED_PATHS: Record<Role, string[]> = {
  [ROLES.TEACHER]: [
    '/dashboard',      
    '/my-schedule', 
    '/attendance',  
    '/my-groups',   
  ],
  [ROLES.ADMIN]: [
    '/dashboard',          
    '/branches',     
    '/subjects',     
    '/students',     
    '/groups',       
    '/schedule',     
    '/plans',        
    '/attendance',   
    '/teachers',     
    '/reports',      
  ],
  [ROLES.SUPERADMIN]: ['*'], 
};
