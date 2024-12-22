import { MoreHorizontal, Star, LinkIcon, ArrowUpRight, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { api } from '../../components/trpc';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@ltw/ui/components/ui/dropdown-menu';
import {
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton
} from '@ltw/ui/components/ui/sidebar';
import { type Goal } from 'backend/types/goal';

const LoadingSkeleton = () => (
  <ul className="space-y-1">
    {[1, 2, 3, 4, 5].map((idx) => (
      <SidebarMenuItem key={idx}>
        <SidebarMenuSkeleton />
      </SidebarMenuItem>
    ))}
  </ul>
);

const NavGoal = ({ goal }: { goal: Goal }) => {
  const { isMobile } = useSidebar();

  const utils = api.useUtils();
  const updateMutation = api.goals.update.useMutation({
    onSuccess: () => {
      utils.goals.listFavorites.invalidate();
      utils.goals.getByName.invalidate({ name: goal.name });
    }
  });

  const handleRemoveFavorite = () => {
    updateMutation.mutate({ id: goal.id, favorite: false });
  };

  const handleCopyLink = () => {
    // Implement copy link functionality
    console.log('Copy link for', goal.name);
  };

  const handleOpenInNewTab = () => {
    // Implement open in new tab functionality
    console.log('Open in new tab', goal.name);
  };

  const handleDelete = () => {
    // Implement delete functionality
    console.log('Delete', goal.name);
  };

  return (
    <SidebarMenuItem key={goal.id}>
      <SidebarMenuButton asChild>
        <Link to="/goals/$name" params={{ name: goal.name }}>
          {goal.emoji}
          <span>{goal.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
        >
          <DropdownMenuItem onClick={handleRemoveFavorite}>
            <Star className="text-muted-foreground" />
            <span>Remove from Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyLink}>
            <LinkIcon className="text-muted-foreground" />
            <span>Copy Link</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenInNewTab}>
            <ArrowUpRight className="text-muted-foreground" />
            <span>Open in New Tab</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center border-2 border-dotted">
    <p className="text-xs text-muted-foreground">Add goals to your favorites for quick access</p>
  </div>
);

export function NavFavorites() {
  const { data, status } = api.goals.listFavorites.useQuery({ limit: 10 }, { retry: 0 });

  const goals = data?.items;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span>Favorites</span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        {status === 'pending' ? (
          <LoadingSkeleton />
        ) : status === 'error' ? (
          <div className="p-2 text-sm text-red-500">Failed to load favorites</div>
        ) : goals && goals.length > 0 ? (
          <ul className="space-y-1">
            {goals.map((goal) => (
              <NavGoal key={goal.id} goal={goal} />
            ))}
          </ul>
        ) : (
          <EmptyState />
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
