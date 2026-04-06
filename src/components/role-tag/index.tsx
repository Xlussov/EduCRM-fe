import { Role, ROLES } from '@/shared/types';
import { FC } from 'react';

type Props = {
  role: Role;
};

const roleBadgeStyles = {
  [ROLES.SUPERADMIN]:
    'border-amber-500 text-amber-700 bg-amber-500/10 dark:border-amber-400 dark:text-amber-400',
  [ROLES.ADMIN]:
    'border-blue-500 text-blue-700 bg-blue-500/10 dark:border-blue-400 dark:text-blue-400',
  [ROLES.TEACHER]:
    'border-emerald-500 text-emerald-700 bg-emerald-500/10 dark:border-emerald-400 dark:text-emerald-400',
};

export const RoleTag: FC<Props> = ({ role }) => {
  return (
    <span
      className={`
        inline-block 
        w-fit 
        h-fit 
        whitespace-nowrap 
        leading-none 
        flex-shrink-0 
        rounded border-2 px-1 py-0.5 
        text-[9px] font-bold uppercase tracking-wider 
        ${roleBadgeStyles[role]}
      `}
    >
      {role}
    </span>
  );
};
