import { SubscriptionsSection } from '../sections/subscriptions-section';

export const SubscriptionsView = () => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tous les abonnements</h1>
        <p className="text-xs text-muted-foreground">
          Voir et gérer tous vos abonnements
        </p>
      </div>
      <SubscriptionsSection />
    </div>
  );
};
