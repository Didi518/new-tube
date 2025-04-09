'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, useClerk } from '@clerk/nextjs';
import { FlameIcon, HomeIcon, PlaySquareIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
  {
    title: 'Acceuil',
    url: '/',
    icon: HomeIcon,
  },
  {
    title: 'Abonnements',
    url: '/flux/abonnements',
    icon: PlaySquareIcon,
    auth: true,
  },
  {
    title: 'Tendances',
    url: '/flux/tendances',
    icon: FlameIcon,
  },
];

export const MainSection = () => {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={pathname === item.url}
                onClick={(e) => {
                  if (!isSignedIn && item.auth) {
                    e.preventDefault();
                    return clerk.openSignIn();
                  }
                }}
              >
                <Link
                  prefetch
                  href={item.url}
                  className="flex items-center gap-4"
                >
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
