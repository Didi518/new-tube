'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { SidebarTrigger } from '@/components/ui/sidebar';

import { AuthButton } from '@/modules/auth/ui/components/auth-button';

import { StudioUploadModal } from '../studio-upload-modal';

export const StudioNavbar = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/studio">
            <div className="p-4 flex items-center gap-1">
              <Image src="/logo.svg" height={32} width={32} alt="Logo" />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>
        <div className="flex-1" />
        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};
