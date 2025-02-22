'use client';

import { toast } from 'sonner';
import { Loader2Icon, PlusIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/responsive-modal';

import { StudioUploader } from './studio-uploader';

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success('Vidéo ajoutée');
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      toast.error('Une erreur est survenue');
    },
  });

  return (
    <>
      <ResponsiveModal
        title="Upload de vidéo"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={() => {}} />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Créer
      </Button>
    </>
  );
};
