import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface DocumentPreviewProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ url, title, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-sm font-bold">{title}</h3>
        <div className="flex items-center gap-2">
          <a href={url} target="_blank" className="p-1 hover:bg-gray-100 rounded"><ExternalLink className="h-4 w-4" /></a>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="h-4 w-4" /></button>
        </div>
      </div>
      <iframe src={url} className="w-full h-[70vh]" title={title} />
    </div>
  </div>
);