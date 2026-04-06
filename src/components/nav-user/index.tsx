'use client';

import { ChevronsUpDown,  LogOut, } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { FC } from 'react';
import { User } from '@/shared/types';
import { RoleTag } from '../role-tag';
import { useLogout } from '@/api/auth/mutations';

type Props = {
  user: User;
};

export const NavUser: FC<Props> = ({ user }) => {
  const { isMobile } = useSidebar();
  const logoutMutation = useLogout();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center justify-between">
                  <span className="truncate font-medium">{user?.first_name}</span>

                  <RoleTag role={user?.role} />
                </div>
                <span className="truncate text-xs">{user?.phone}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-medium">
                      {user.first_name} {user.last_name}{' '}
                    </span>

                    <RoleTag role={user?.role} />
                  </div>
                  <span className="truncate text-xs">{user?.phone}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
