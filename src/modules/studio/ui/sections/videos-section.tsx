'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';

import { trpc } from '@/trpc/client';
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
                    <TableCell>{video.title}</TableCell>
                    <TableCell>Visibilité</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date</TableCell>
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
