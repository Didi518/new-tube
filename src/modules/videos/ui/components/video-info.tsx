import Link from 'next/link';
import { useMemo } from 'react';
import { fr } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';

import { useFormatUserName } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/user-avatar';
import { UserInfo } from '@/modules/users/ui/components/user-info';

import { VideoMenu } from './video-menu';
import type { VideoGetManyOutput } from '../../types';

interface VideoInfoProps {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

export const VideoInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-10 flex-shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-[90%]" />
        <Skeleton className="h-5 w-[70%]" />
      </div>
    </div>
  );
};

export const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
  const formatUserName = useFormatUserName();
  const formattedName = formatUserName(data.user.name);

  const compactViews = useMemo(() => {
    return Intl.NumberFormat('fr', {
      notation: 'compact',
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true, locale: fr });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <Link prefetch href={`/utilisateurs/${data.user.id}`}>
        <UserAvatar imageUrl={data.user.imageUrl} name={formattedName} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link prefetch href={`videos/${data.id}`}>
          <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
            {data.title}
          </h3>
        </Link>
        <Link prefetch href={`/utilisateurs/${data.user.id}`}>
          <UserInfo name={formattedName} />
        </Link>
        <Link prefetch href={`videos/${data.id}`}>
          <p className="text-sm text-gray-600 line-clamp-1">
            {compactViews} {data.viewCount <= 1 ? 'vue' : 'vues'} •{' '}
            {compactDate}
          </p>
        </Link>
      </div>
      <div className="flex-shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
};
