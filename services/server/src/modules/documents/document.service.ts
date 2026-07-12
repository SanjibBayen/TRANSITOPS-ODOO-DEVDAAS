import { supabaseAdmin } from '../../config/supabase';
import { CloudinaryService } from '../../config/cloudinary';
import { ApiError } from '../../utils/ApiError';

export class DocumentService {
  async getByVehicle(vehicleId: string) {
    const { data, error } = await supabaseAdmin
      .from('vehicle_documents')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });

    if (error) throw new ApiError(500, 'Failed to fetch documents');
    return data;
  }

  async upload(vehicleId: string, type: string, title: string, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new ApiError(400, 'No files provided');
    }

    const uploadResults = await CloudinaryService.uploadMultiple(files, `transitops/documents/${vehicleId}`);

    const documents = uploadResults.map((result: any) => ({
      vehicle_id: vehicleId,
      type,
      title: title || result.original_filename,
      document_url: result.secure_url,
      public_id: result.public_id,
      status: 'PENDING_VERIFICATION',
    }));

    const { data, error } = await supabaseAdmin.from('vehicle_documents').insert(documents).select();
    if (error) throw new ApiError(500, 'Failed to save documents');

    return data;
  }

  async verify(documentId: string, verifiedBy: string) {
    const { data, error } = await supabaseAdmin
      .from('vehicle_documents')
      .update({
        status: 'VERIFIED',
        verified_by: verifiedBy,
        verified_at: new Date().toISOString(),
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw new ApiError(500, 'Failed to verify document');
    return data;
  }

  async delete(documentId: string) {
    const { data: doc } = await supabaseAdmin.from('vehicle_documents').select('public_id').eq('id', documentId).single();

    if (doc?.public_id) {
      await CloudinaryService.deleteFile(doc.public_id);
    }

    const { error } = await supabaseAdmin.from('vehicle_documents').delete().eq('id', documentId);
    if (error) throw new ApiError(500, 'Failed to delete document');
  }
}