'use client';

import { toast } from 'sonner';
import { Loader2Icon, PlusIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';

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
  );
};
