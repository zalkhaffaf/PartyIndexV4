import { supabase } from '../config/supabase';
import { showError, showSuccess } from '../utils/notifications';

export async function handleImageUpload(file: File, vendorId: string, type: 'logo' | 'gallery'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `vendors/${vendorId}/${type}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('vendor-images')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('vendor-images')
    .getPublicUrl(filePath);

  return publicUrl;
}