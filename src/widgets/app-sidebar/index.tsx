'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from '../../components/nav-user';
import { ComponentProps, useMemo } from 'react';
import { sidebarPaths } from '@/shared/constants';
import { useUser } from '@/api/auth/queries';
import { NavUserSkeleton } from '@/components/nav-user/NavUserSkeleton';

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useUser();
  const pathname = usePathname();

  const userRole = userData?.role;

  const filteredNav = useMemo(() => {
    if (!userRole) return [];

    return sidebarPaths
      .map(group => {
        return {
          ...group,
          items: group.items.filter(item => (item.roles as string[]).includes(userRole)),
        };
      })
      .filter(group => group.items.length > 0);
  }, [userRole]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {userData ? <NavUser user={userData} /> : isLoading ? <NavUserSkeleton /> : null}
      </SidebarHeader>

      <SidebarContent>
        {!isLoading &&
          filteredNav.map(group => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(item => {
                    const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                          <Link href={item.url}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
