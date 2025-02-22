import { VideosSection } from '../sections/videos-section';

export const StudioView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Contenu de la chaine</h1>
        <p className="text-xs text-muted-foreground">
          Gestion de votre contenu et de vos vidéos
        </p>
      </div>
      <VideosSection />
    </div>
  );
};
