export type DocumentType = 'REGISTRATION' | 'INSURANCE' | 'PERMIT' | 'POLLUTION' | 'LICENSE' | 'MAINTENANCE_RECORD' | 'OTHER';

export type DocumentStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING_VERIFICATION' | 'VERIFIED';

export interface Document {
  id: string;
  vehicle_id: string;
  type: DocumentType;
  document_url: string;
  public_id?: string;
  title: string;
  issue_date?: string;
  expiry_date?: string;
  status: DocumentStatus;
  verified_by?: string;
  verified_at?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentUploadData {
  vehicle_id: string;
  type: DocumentType;
  title: string;
  file: File;
}