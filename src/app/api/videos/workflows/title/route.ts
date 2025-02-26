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

const TITLE_SYSTEM_PROMPTS: { [key: string]: string } = {
  fr: `Votre tâche est de générer un titre optimisé pour le référencement (SEO) d'une vidéo YouTube à partir de sa transcription. Veuillez suivre ces directives :
- Soyez concis mais descriptif, en utilisant des mots-clés pertinents pour améliorer la découvrabilité.
- Mettez en avant l'aspect le plus attrayant ou unique du contenu de la vidéo.
- Évitez le jargon ou un langage trop complexe, sauf s'il favorise directement la recherche.
- Utilisez une formulation orientée vers l'action ou mettez en avant une proposition de valeur claire lorsque c'est pertinent.
- Assurez-vous que le titre contient entre 3 et 8 mots et ne dépasse pas 100 caractères.
- Retournez UNIQUEMENT le titre en texte brut. N'ajoutez pas de guillemets ni aucun autre formatage.`,
  en: `Your task is to generate an SEO-optimized title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most engaging or unique aspect of the video's content.
- Avoid jargon or overly complex language unless it directly aids search.
- Use action-oriented phrasing or highlight a clear value proposition when appropriate.
- Ensure the title is between 3 and 8 words and does not exceed 100 characters.
- Return ONLY the title in plain text. Do not add quotes or any other formatting.`,
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
    const text = response.text();

    if (!text) {
      throw new Error('Transcription introuvable');
    }

    return text;
  });

  const lang = franc(transcript);
  const prompt = TITLE_SYSTEM_PROMPTS[lang] || TITLE_SYSTEM_PROMPTS['en'];

  const { body } = await context.api.openai.call('generate-title', {
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

  let title = body.choices[0]?.message.content;
  title = title
    ? iconv.decode(Buffer.from(title, 'binary'), 'utf-8')
    : video.title;

  if (!title) {
    throw new Error('Le titre est vide');
  }

  if (lang !== 'fr') {
    const translation = await translate(title, { to: 'fr' });
    title = translation.text;
  }

  await context.run('update-video', async () => {
    await db
      .update(videos)
      .set({
        title,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
