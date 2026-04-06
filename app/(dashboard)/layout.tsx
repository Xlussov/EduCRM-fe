import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 w-full flex flex-col">
          <header className="h-16 border-b flex items-center px-4">
            <SidebarTrigger />
            <span className="ml-4 font-semibold">EduCRM</span>
          </header>
          <div className="flex-1 p-6">{children}</div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
