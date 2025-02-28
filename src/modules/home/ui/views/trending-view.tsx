import { TrendingVideosSection } from '../sections/trending-videos-section';

export const TrendingView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tendances</h1>
        <p className="text-xs text-muted-foreground">
          Vidéos les plus populaires du moment
        </p>
      </div>
      <TrendingVideosSection />
    </div>
  );
};
