import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

import { UserAvatar } from '@/components/user-avatar';
import { Button } from '@/components/ui/button';

import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button';
import { UserInfo } from '@/modules/users/ui/components/user-info';

import { VideoGetOneOutput } from '../../types';

interface VideoOwnerProps {
  user: VideoGetOneOutput['user'];
  videoId: string;
}

const formatUserName = (name: string) => {
  return name.replace(/\snull$/, '') || 'Utilisateur inconnu';
};

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerkUserId } = useAuth();

  const formattedName = formatUserName(user.name);

  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link href={`/utilisateurs/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={formattedName} />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo size="lg" name={formattedName} />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {0} abonnés
            </span>
          </div>
        </div>
      </Link>
      {clerkUserId === user.clerkId ? (
        <Button className="rounded-full" asChild variant="secondary">
          <Link href={`/studio/videos/${videoId}`}>Modifier la vidéo</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={() => {}}
          disabled={false}
          isSubscribed={false}
          className="flex-none"
        />
      )}
    </div>
  );
};
