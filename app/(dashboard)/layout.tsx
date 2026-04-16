'use client';

import { AppSidebar } from '@/widgets/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BranchProvider } from '@/providers/branch-provider';
import { GlobalBranchSwitcher } from '@/components/global-branch-switcher';
import { useUser } from '@/api/auth/queries';
import { ROLES } from '@/shared/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: userData, isLoading } = useUser();
  const userRole = userData?.role;

  return (
    <TooltipProvider>
      <SidebarProvider>
        <BranchProvider>
          <AppSidebar user={userData} isLoading={isLoading} />
          <main className="flex-1 w-full flex flex-col">
            <header className="h-16 border-b flex items-center px-4">
              <SidebarTrigger />
              <div className="flex justify-between w-full items-center">
                <div className="ml-4 font-semibold">EduCRM</div>
                {userRole !== ROLES.TEACHER && <GlobalBranchSwitcher />}
              </div>
            </header>
            <div className="flex-1 p-6">{children}</div>
          </main>
        </BranchProvider>
      </SidebarProvider>
    </TooltipProvider>
  );
}
