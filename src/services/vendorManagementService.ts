import { supabase } from '../config/supabase';
import { showError, showSuccess } from '../utils/notifications';
import { loadVendors } from './adminDashboardService';

export async function deleteVendor(vendorId: string) {
  try {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', vendorId);

    if (error) throw error;

    showSuccess('Vendor deleted successfully');
    await loadVendors(); // Refresh the vendors list
  } catch (error) {
    showError('Failed to delete vendor');
    console.error('Delete vendor error:', error);
  }
}

// Add to window object for onclick handlers
(window as any).deleteVendor = deleteVendor;