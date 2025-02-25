import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { UploadThingError, UTApi } from 'uploadthing/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

import { db } from '@/db';
import { users, videos } from '@/db/schema';

const f = createUploadthing();
export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .middleware(async ({ input }) => {
      const { userId: clerkUserId } = await auth();

      if (!clerkUserId) throw new UploadThingError('Non autorisé');

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId));

      if (!user) throw new UploadThingError('Non autorisé');

      const [existingVideo] = await db
        .select({
          thumbnailKey: videos.thumbnailKey,
        })
        .from(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));

      if (!existingVideo) throw new UploadThingError('Vidéo introuvable');

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({
            thumbnailKey: null,
            thumbnailUrl: null,
          })
          .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));
      }

      return { user, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(videos)
        .set({
          thumbnailUrl: file.url,
          thumbnailKey: file.key,
        })
        .where(
          and(
            eq(videos.id, metadata.videoId),
            eq(videos.userId, metadata.user.id)
          )
        );

      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
