'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LogOutIcon, VideoIcon } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { StudioSidebarHeader } from './studio-sidebar-header';

export const StudioSidebar = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Sidebar className="pt-16 z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === '/studio'}
                tooltip="Contenu"
                asChild
              >
                <Link prefetch href="/studio">
                  <VideoIcon className="size-5" />
                  <span className="text-sm">Contenu</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Separator />
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Quitter le studio" asChild>
                <Link prefetch href="/">
                  <LogOutIcon className="size-5" />
                  <span className="text-sm">Quitter le studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
