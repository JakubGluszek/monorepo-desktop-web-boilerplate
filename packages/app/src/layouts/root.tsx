import { Separator } from '@ltw/ui/components/ui/separator';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@ltw/ui/components/ui/sidebar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@ltw/ui/components/ui/tooltip';
import { AppSidebar } from '../ui/sidebar/app-sidebar';

function Header() {
  return (
    <header className="sticky top-0 h-12 flex border-b shrink-0 bg-background z-[50] rounded-t-xl">
      <div className="flex items-center gap-2 px-4 w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="min-w-7" />
          </TooltipTrigger>
          <TooltipContent align="start">Toggle sidebar</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
    </header>
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
