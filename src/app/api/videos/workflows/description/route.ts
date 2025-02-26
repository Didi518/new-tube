import { and, eq } from 'drizzle-orm';
import { serve } from '@upstash/workflow/nextjs';
import { Buffer } from 'buffer';
import iconv from 'iconv-lite';
import { franc } from 'franc';
import { translate } from '@vitalets/google-translate-api';

import { db } from '@/db';
import { videos } from '@/db/schema';

interface InputType {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPTS: { [key: string]: string } = {
  fr: `Votre tâche est de résumer la transcription d'une vidéo. Veuillez suivre ces directives :
    - Soyez bref. Condensez le contenu en un résumé qui capture les points clés et les idées principales sans perdre d'informations importantes.
    - Évitez le jargon ou un langage trop complexe, sauf si cela est nécessaire pour le contexte.
    - Concentrez-vous sur les informations essentielles en ignorant les remplissages, les répétitions ou les digressions inutiles.
    - Retournez UNIQUEMENT le résumé, sans autre texte, annotation ou commentaire.
    - Visez un résumé de 3 à 5 phrases ne dépassant pas 200 caractères.`,
  en: `Your task is to summarize the transcript of a video. Please follow these guidelines:
    - Be brief. Condense the content into a summary that captures the key points and main ideas without losing important information.
    - Avoid jargon or overly complex language unless necessary for context.
    - Focus on essential information, ignoring fillers, repetitions, or unnecessary digressions.
    - Return ONLY the summary, without any additional text, annotation, or commentary.
    - Aim for a summary of 3 to 5 sentences not exceeding 200 characters.`,
};

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  const video = await context.run('get-video', async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error('Introuvable');
    }

    return existingVideo;
  });

  const transcript = await context.run('get-transcript', async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = await response.text();

    if (!text) {
      throw new Error('Transcription introuvable');
    }

    return text;
  });

  const lang = franc(transcript);
  const prompt =
    DESCRIPTION_SYSTEM_PROMPTS[lang] || DESCRIPTION_SYSTEM_PROMPTS['en'];

  const { body } = await context.api.openai.call('generate-description', {
    token: process.env.OPENAI_API_KEY!,
    operation: 'chat.completions.create',
    body: {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
    },
  });

  let description = body.choices[0]?.message.content;
  description = description
    ? iconv.decode(Buffer.from(description, 'binary'), 'utf-8')
    : video.description;

  if (!description) {
    throw new Error('La description est vide');
  }

  if (lang !== 'fr') {
    const translation = await translate(description, { to: 'fr' });
    description = translation.text;
  }

  await context.run('update-video', async () => {
    await db
      .update(videos)
      .set({
        description,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
