import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import { cloudinary } from '../lib/cloudinary';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDocuments = useCallback(async (vehicleId: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/documents/vehicle/${vehicleId}`);
      setDocuments(response.data.data || []);
    } catch (err: any) {
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (vehicleId: string, type: string, title: string, file: File) => {
    try {
      const uploaded = await cloudinary.upload(file, `transitops/documents/${vehicleId}`);
      
      const response = await api.post('/documents/upload', {
        vehicle_id: vehicleId,
        type,
        title,
        document_url: uploaded.secure_url,
        public_id: uploaded.public_id,
      });

      toast.success('Document uploaded');
      await loadDocuments(vehicleId);
      return response.data.data;
    } catch (err: any) {
      toast.error('Upload failed');
      throw err;
    }
  }, [loadDocuments]);

  const verifyDocument = useCallback(async (documentId: string, vehicleId: string) => {
    try {
      await api.patch(`/documents/${documentId}/verify`);
      toast.success('Document verified');
      await loadDocuments(vehicleId);
    } catch (err: any) {
      toast.error('Verification failed');
    }
  }, [loadDocuments]);

  const deleteDocument = useCallback(async (documentId: string, vehicleId: string) => {
    try {
      await api.delete(`/documents/${documentId}`);
      toast.success('Document deleted');
      await loadDocuments(vehicleId);
    } catch (err: any) {
      toast.error('Delete failed');
    }
  }, [loadDocuments]);

  return {
    documents,
    isLoading,
    loadDocuments,
    uploadDocument,
    verifyDocument,
    deleteDocument,
  };
};