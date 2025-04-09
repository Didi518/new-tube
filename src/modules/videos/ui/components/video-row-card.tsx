import Link from 'next/link';
import { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn, useFormatUserName } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/user-avatar';
import { UserInfo } from '@/modules/users/ui/components/user-info';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { VideoMenu } from './video-menu';
import { VideoGetManyOutput } from '../../types';
import { VideoThumbnail, VideoThumbnailSkeleton } from './video-thumbnail';

const videoRowCardVariants = cva('group flex min-w-0', {
  variants: {
    size: {
      default: 'gap-4',
      compact: 'gap-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const thumbnailVariants = cva('relative flex-none', {
  variants: {
    size: {
      default: 'w-[38%]',
      compact: 'w-[168px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

export const VideoRowCardSkeleton = ({
  size = 'default',
}: {
  size: VariantProps<typeof videoRowCardVariants>['size'];
}) => {
  return (
    <div className={videoRowCardVariants({ size })}>
      <div className={thumbnailVariants({ size })}>
        <VideoThumbnailSkeleton />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-x-2">
          <div className="flex-1 min-w-0">
            <Skeleton
              className={cn('h-5 w-[40%]', size === 'compact' && 'h-4 w-[40%]')}
            />
            {size === 'default' && (
              <>
                <Skeleton className="h-4 w-[20%] mt-1" />
                <div className="flex items-center gap-2 my-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </>
            )}
            {size === 'compact' && <Skeleton className="h-4 w-[50%] mt-1" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoRowCard = ({
  data,
  size = 'default',
  onRemove,
}: VideoRowCardProps) => {
  const formatUserName = useFormatUserName();
  const formattedName = formatUserName(data.user.name);

  const compactViews = useMemo(() => {
    return Intl.NumberFormat('fr', {
      notation: 'compact',
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat('fr', {
      notation: 'compact',
    }).format(data.likeCount);
  }, [data.likeCount]);

  return (
    <div className={videoRowCardVariants({ size })}>
      <Link
        prefetch
        href={`/videos/${data.id}`}
        className={thumbnailVariants({ size })}
      >
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-x-2">
          <Link prefetch href={`/videos/${data.id}`} className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-medium line-clamp-2',
                size === 'compact' ? 'text-sm' : 'text-base'
              )}
            >
              {data.title}
            </h3>
            {size === 'default' && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} {data.viewCount <= 1 ? 'vue' : 'vues'} •{' '}
                {compactLikes} {data.likeCount <= 1 ? 'like' : 'likes'}
              </p>
            )}
            {size === 'default' && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <UserAvatar
                    size="sm"
                    imageUrl={data.user.imageUrl}
                    name={formattedName}
                  />
                  <UserInfo size="sm" name={formattedName} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground w-fit line-clamp-2">
                      {data.description ?? 'Aucune description'}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="bg-black/70"
                  >
                    <p>Depuis la description de la vidéo</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {size === 'compact' && <UserInfo size="sm" name={formattedName} />}
            {size === 'compact' && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} {data.viewCount <= 1 ? 'vue' : 'vues'} •{' '}
                {compactLikes} {data.likeCount <= 1 ? 'like' : 'likes'}
              </p>
            )}
          </Link>
          <div className="flex-none">
            <VideoMenu videoId={data.id} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
};
