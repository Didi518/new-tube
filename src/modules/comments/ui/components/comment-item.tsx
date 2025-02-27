import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { fr } from 'date-fns/locale/fr';
import { formatDistanceToNow } from 'date-fns';
import { useAuth, useClerk } from '@clerk/nextjs';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
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

import { CommentForm } from './comment-form';
import { CommentReplies } from './comment-replies';
import type { CommentsGetManyOutput } from '../../types';

interface CommentItemProps {
  comment: CommentsGetManyOutput['items'][number];
  variant?: 'reply' | 'comment';
}

export const CommentItem = ({
  comment,
  variant = 'comment',
}: CommentItemProps) => {
  const { userId } = useAuth();
  const clerk = useClerk();
  const formatUserName = useFormatUserName();
  const formattedName = formatUserName(comment.user.name);
  const locale = fr;
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

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

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error('Une erreur est survenue');

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    },
  });

  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
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
            size={variant === 'comment' ? 'lg' : 'sm'}
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
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Button
                disabled={like.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => {
                  like.mutate({ commentId: comment.id });
                }}
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction === 'like' && 'fill-black'
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.likeCount}
              </span>
              <Button
                disabled={dislike.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => {
                  dislike.mutate({ commentId: comment.id });
                }}
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction === 'dislike' && 'fill-black'
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.dislikeCount}
              </span>
            </div>
            {variant === 'comment' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => {
                  setIsReplyOpen(true);
                }}
              >
                Répondre
              </Button>
            )}
          </div>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setIsReplyOpen(true);
              }}
            >
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
      {isReplyOpen && variant === 'comment' && (
        <div className="mt-4 pl-14">
          <CommentForm
            variant="reply"
            parentId={comment.id}
            videoId={comment.videoId}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
            onCancel={() => setIsReplyOpen(false)}
          />
        </div>
      )}
      {comment.replyCount > 0 && variant === 'comment' && (
        <div className="pl-14">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setIsRepliesOpen((current) => !current)}
          >
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {comment.replyCount}{' '}
            {comment.replyCount <= 1 ? 'Réponse' : 'Réponses'}
          </Button>
        </div>
      )}
      {comment.replyCount > 0 && variant === 'comment' && isRepliesOpen && (
        <CommentReplies parentId={comment.id} videoId={comment.videoId} />
      )}
    </div>
  );
};
