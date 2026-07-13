import React from 'react';
import { DocumentUploader } from './DocumentUploader';
import { DocumentList } from './DocumentList';

interface DocumentManagerProps {
  vehicleId: string;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ vehicleId }) => (
  <div className="space-y-6">
    <DocumentUploader vehicleId={vehicleId} />
    <DocumentList vehicleId={vehicleId} />
  </div>
);