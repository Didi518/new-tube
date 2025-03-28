import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/db';
import { users } from '@/db/schema';

export const GET = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/connexion');
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId));

  if (!existingUser) {
    return redirect('/connexion');
  }

  return redirect(`/utilisateurs/${existingUser.id}`);
};
