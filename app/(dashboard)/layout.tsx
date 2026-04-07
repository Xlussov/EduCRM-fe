import { AppSidebar } from '@/widgets/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BranchProvider } from '@/providers/branch-provider';
import { GlobalBranchSwitcher } from '@/components/global-branch-switcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <BranchProvider>
          <AppSidebar />
          <main className="flex-1 w-full flex flex-col">
            <header className="h-16 border-b flex items-center px-4">
              <SidebarTrigger />
              <div className='flex justify-between w-full items-center'>
                <div className="ml-4 font-semibold">EduCRM</div>
              <GlobalBranchSwitcher/>
              </div>
            </header>
            <div className="flex-1 p-6">{children}</div>
          </main>
        </BranchProvider>
      </SidebarProvider>
    </TooltipProvider>
  );
}
