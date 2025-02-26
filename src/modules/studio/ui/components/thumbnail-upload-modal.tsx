import { useEffect, useState } from 'react';

import { trpc } from '@/trpc/client';
import { UploadDropzone } from '@/lib/uploadthing';
import { ResponsiveModal } from '@/components/responsive-modal';

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isClient, setIsClient] = useState(false);
  const utils = trpc.useUtils();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const onUploadComplete = () => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ id: videoId });
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      title="Uploader une miniature"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone<'thumbnailUploader'>
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
        onChange={(acceptedFiles) => {
          setSelectedFiles(acceptedFiles);
        }}
        content={{
          label: ({ isDragActive }) =>
            isDragActive
              ? 'Déposez les fichiers ici...'
              : 'Glissez et déposez des fichiers ici, ou cliquez pour sélectionner des fichiers',
          button:
            selectedFiles.length > 0
              ? `Uploader ${selectedFiles.length} fichier${
                  selectedFiles.length > 1 ? 's' : ''
                }`
              : 'Choisir un fichier',
        }}
      />
    </ResponsiveModal>
  );
};
