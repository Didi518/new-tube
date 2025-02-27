import Link from 'next/link';
import { toast } from 'sonner';
import { fr } from 'date-fns/locale/fr';
import { formatDistanceToNow } from 'date-fns';
import { useAuth, useClerk } from '@clerk/nextjs';
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { useFormatUserName } from '@/hooks/use-format-user-name';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { CommentsGetManyOutput } from '../../types';

interface CommentItemProps {
  comment: CommentsGetManyOutput['items'][number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { userId } = useAuth();
  const clerk = useClerk();
  const formatUserName = useFormatUserName();
  const formattedName = formatUserName(comment.user.name);
  const locale = fr;

  const utils = trpc.useUtils();
  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success('Commentaire supprimé');
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error('Une erreur est survenue');
      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    },
  });

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/utilisateurs/${comment.userId}`}>
          <UserAvatar
            size="lg"
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/utilisateurs/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {formattedName}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                  locale,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4" />
              Répondre
            </DropdownMenuItem>
            {comment.user.clerkId === userId && (
              <DropdownMenuItem
                onClick={() => {
                  remove.mutate({ id: comment.id });
                }}
              >
                <Trash2Icon className="size-4" />
                Supprimer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
