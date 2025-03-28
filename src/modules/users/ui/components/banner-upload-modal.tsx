import { useState } from 'react';

import { trpc } from '@/trpc/client';
import { UploadDropzone } from '@/lib/uploadthing';
import { ResponsiveModal } from '@/components/responsive-modal';

interface BannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BannerUploadModal = ({
  userId,
  open,
  onOpenChange,
}: BannerUploadModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.users.getOne.invalidate({ id: userId });
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      title="Uploader une bannière"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone<'bannerUploader'>
        endpoint="bannerUploader"
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
