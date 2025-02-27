import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { useFormatUserName } from '@/hooks/use-format-user-name';
import { UserInfo } from '@/modules/users/ui/components/user-info';
import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription';
import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button';

import { VideoGetOneOutput } from '../../types';

interface VideoOwnerProps {
  user: VideoGetOneOutput['user'];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerkUserId, isLoaded } = useAuth();
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });
  const formatUserName = useFormatUserName();
  const formattedName = formatUserName(user.name);

  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link href={`/utilisateurs/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={formattedName} />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo size="lg" name={formattedName} />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {user.subscriberCount}{' '}
              {user.subscriberCount <= 1 ? 'abonné' : 'abonnés'}
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
          onClick={onClick}
          disabled={isPending || !isLoaded}
          isSubscribed={user.viewerSubscribed}
          className="flex-none"
        />
      )}
    </div>
  );
};
