import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

import { UserAvatar } from '@/components/user-avatar';
import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="flex flex-col items-center mt-2 gap-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </SidebarHeader>
    );
  }

  if (state === 'collapsed') {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Votre profil" asChild>
          <Link prefetch href="/utilisateurs/current">
            <UserAvatar
              imageUrl={user.imageUrl}
              name={user.fullName ?? 'Utilisateur'}
              size="xs"
            />
            <span className="text-sm">Votre profil</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link prefetch href="/utilisateurs/current">
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.fullName ?? 'Utilisateur'}
          className="size-[112px] hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex flex-col items-center mt-2 gap-y-1">
        <p className="text-sm font-medium">Votre profil</p>
        <p className="text-xs text-muted-foreground">{user.fullName}</p>
      </div>
    </SidebarHeader>
  );
};
