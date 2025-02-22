import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from '@mux/mux-node/resources/webhooks';

import { mux } from '@/lib/mux';
import { db } from '@/db';
import { videos } from '@/db/schema';

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackReadyWebhookEvent;

export const POST = async (request: Request) => {
  if (!SIGNING_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET n'est pas paramétré");
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get('mux-signature');

  if (!muxSignature) {
    return new Response('Signature introuvable', { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    {
      'mux-signature': muxSignature,
    },
    SIGNING_SECRET
  );

  switch (payload.type as WebhookEvent['type']) {
    case 'video.asset.created': {
      const data = payload.data as VideoAssetCreatedWebhookEvent['data'];

      if (!data.upload_id) {
        return new Response("ID de l'upload introuvable", { status: 400 });
      }

      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
  }

  return new Response('OK', { status: 200 });
};
