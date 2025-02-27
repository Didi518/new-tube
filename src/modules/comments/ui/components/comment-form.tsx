import type { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useClerk, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { commentInsertSchema } from '@/db/schema';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/user-avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: 'comment' | 'reply';
}

export const CommentForm = ({
  videoId,
  parentId,
  onSuccess,
  onCancel,
  variant = 'comment',
}: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();

  const utils = trpc.useUtils();
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();
      toast.success('Commentaire ajouté');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Une erreur est survenue');

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    },
  });

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
    defaultValues: {
      parentId,
      videoId,
      value: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
    create.mutate(values);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-4 group"
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || '/user-placeholder.svg'}
          name={user?.username || 'Utilisateur'}
        />
        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === 'reply'
                        ? 'Répondre à ce commentaire...'
                        : 'Ajouter un commentaire...'
                    }
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            {onCancel && (
              <Button variant="ghost" type="button" onClick={handleCancel}>
                Annuler
              </Button>
            )}
            <Button disabled={create.isPending} type="submit" size="sm">
              {variant === 'reply' ? 'Répondre' : 'Commenter'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
