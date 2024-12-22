import { useEffect } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { GoalIcon, HomeIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@ltw/ui/components/ui/sidebar';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const data = {
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: HomeIcon
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = useRouterState().location.pathname;
  const { setOpenMobile, isMobile } = useSidebar();

  useEffect(() => {
    if (!isMobile) return;
    setOpenMobile(false);
  }, [pathname, isMobile]);

  return (
    <Sidebar collapsible="offcanvas" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GoalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Log the Way</span>
                  <span className="truncate text-xs text-muted-foreground">v0.0.1</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hidden">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
