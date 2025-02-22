'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { ErrorBoundary } from 'react-error-boundary';
import { Globe2Icon, LockIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { snakeCaseToTitle } from '@/lib/utils';
import { DEFAULT_LIMIT } from '@/constants';
import { InfiniteScroll } from '@/components/infinite-scroll';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { VideoThumbnail } from '@/modules/videos/ui/components/video-thumbnail';

export const VideosSection = () => {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <ErrorBoundary fallback={<p>Erreur...</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSuspense = () => {
  const locale = fr;
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Vidéo</TableHead>
              <TableHead>Visibilité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Vues</TableHead>
              <TableHead className="text-right">Commentaires</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <Link
                  href={`/studio/videos/${video.id}`}
                  key={video.id}
                  legacyBehavior
                >
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative aspect-video w-36 shrink-0">
                          <VideoThumbnail
                            imageUrl={video.thumbnailUrl}
                            previewUrl={video.previewUrl}
                            title={video.title}
                            duration={video.duration || 0}
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden gap-y-1">
                          <span className="text-sm line-clamp-1">
                            {video.title}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {video.description || 'Aucune description'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {video.visibility === 'private' ? (
                          <LockIcon className="size-4 mr-2" />
                        ) : (
                          <Globe2Icon className="size-4 mr-2" />
                        )}
                        {snakeCaseToTitle(
                          video.visibility === 'private' ? 'privée' : 'publique'
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {snakeCaseToTitle(
                          video.muxStatus === 'ready'
                            ? 'prête'
                            : video.muxStatus === 'waiting'
                            ? 'en attente'
                            : video.muxStatus === 'error'
                            ? 'erreur'
                            : 'en cours'
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {format(new Date(video.createdAt), 'd MMM yyyy', {
                        locale,
                      })}
                    </TableCell>
                    <TableCell>Vues</TableCell>
                    <TableCell>Commentaires</TableCell>
                    <TableCell>Likes</TableCell>
                  </TableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
