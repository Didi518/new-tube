import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from '@/trpc/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/responsive-modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const PlaylistCreateModal = ({
  open,
  onOpenChange,
}: PlaylistCreateModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });
  const utils = trpc.useUtils();

  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      utils.playlists.getMany.invalidate();
      toast.success('Playlist créée');
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Une erreur est survenue');
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutate(values);
  };

  return (
    <ResponsiveModal
      title="Créer une playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompteur</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Mes vidéos préférées" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={create.isPending}>
              Créer
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
