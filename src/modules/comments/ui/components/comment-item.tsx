import Link from 'next/link';
import { fr } from 'date-fns/locale/fr';
import { formatDistanceToNow } from 'date-fns';

import { UserAvatar } from '@/components/user-avatar';
import { useFormatUserName } from '@/hooks/use-format-user-name';

import type { CommentsGetManyOutput } from '../../types';

interface CommentItemProps {
  comment: CommentsGetManyOutput[number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const formatUserName = useFormatUserName();
  const formattedName = formatUserName(comment.user.name);
  const locale = fr;

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
      </div>
    </div>
  );
};
