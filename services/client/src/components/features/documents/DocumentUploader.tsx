import React, { useState } from 'react';
import { FileUploader } from '../../shared/FileUploader';
import { toast } from 'sonner';
import { cloudinary } from '../../../lib/cloudinary';
import api from '../../../lib/axios';

interface DocumentUploaderProps {
  vehicleId: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ vehicleId }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        const result = await cloudinary.upload(file, `transitops/documents/${vehicleId}`);
        await api.post('/documents/upload', {
          vehicle_id: vehicleId,
          type: 'OTHER',
          title: file.name,
          document_url: result.secure_url,
          public_id: result.public_id,
        });
      }
      toast.success('Documents uploaded successfully');
    } catch (err: any) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-bold mb-3">Upload Documents</h3>
      <FileUploader onUpload={handleUpload} accept="image/*,.pdf" multiple />
      {isUploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
    </div>
  );
};