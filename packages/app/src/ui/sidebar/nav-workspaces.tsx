import { useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@ltw/ui/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@ltw/ui/components/ui/sidebar';
import { ChevronRight, MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import { api } from '../trpc';

export function NavWorkspaces() {
  const [openWorkspaces, setOpenWorkspaces] = useState<Set<string>>(new Set());

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.workspaces.getAll.useInfiniteQuery(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor
      }
    );

  const workspaces = data?.pages.flatMap((page) => page.items) ?? [];

  const toggleWorkspace = (id: string) => {
    setOpenWorkspaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (status === 'pending') {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="flex justify-center items-center h-20">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (status === 'error') {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="text-red-500">Error loading workspaces</div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.map((workspace) => (
            <Collapsible
              key={workspace.id}
              open={openWorkspaces.has(workspace.id)}
              onOpenChange={() => toggleWorkspace(workspace.id)}
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <span>{workspace.emoji || '🏢'}</span>
                    <span>{workspace.name}</span>
                  </a>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction
                    className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                    showOnHover
                  >
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <SidebarMenuAction showOnHover>
                  <Plus />
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {workspace.goals.map((goal) => (
                      <SidebarMenuSubItem key={goal.id}>
                        <SidebarMenuSubButton asChild>
                          <a href="#">
                            <span>{goal.emoji}</span>
                            <span>{goal.name}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    {workspace.goals.length === 0 && (
                      <SidebarMenuSubItem className="text-muted-foreground text-xs">
                        No goals yet
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
          {hasNextPage && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-sidebar-foreground/70"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal />
                )}
                <span>Load More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
