import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { FileText, Download, Trash2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentListProps {
  vehicleId: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({ vehicleId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [vehicleId]);

  const loadDocuments = async () => {
    try {
      const res = await api.get(`/documents/vehicle/${vehicleId}`);
      setDocuments(res.data.data || []);
    } catch { /* silent */ } finally { setIsLoading(false); }
  };

  const handleVerify = async (id: string) => {
    try {
      await api.patch(`/documents/${id}/verify`);
      toast.success('Document verified');
      loadDocuments();
    } catch { toast.error('Verification failed'); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/documents/${id}`);
      toast.success('Document deleted');
      loadDocuments();
    } catch { toast.error('Delete failed'); }
  };

  if (isLoading) return <div className="animate-pulse h-20 bg-gray-100 dark:bg-zinc-800 rounded-xl" />;

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-bold mb-3">Documents ({documents.length})</h3>
      <div className="space-y-2">
        {documents.map(doc => (
          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <div>
                <p className="font-bold">{doc.title}</p>
                <p className="text-gray-500">{doc.type} • {doc.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a href={doc.document_url} target="_blank" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-zinc-700"><Download className="h-3.5 w-3.5" /></a>
              {doc.status !== 'VERIFIED' && (
                <button onClick={() => handleVerify(doc.id)} className="p-1.5 rounded hover:bg-green-100 text-green-600"><ShieldCheck className="h-3.5 w-3.5" /></button>
              )}
              <button onClick={() => handleDelete(doc.id)} className="p-1.5 rounded hover:bg-red-100 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
        {documents.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No documents uploaded</p>}
      </div>
    </div>
  );
};