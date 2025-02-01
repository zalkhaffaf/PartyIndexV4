import { supabase } from '../../config/supabase';
import { showError, showSuccess } from '../../utils/notifications';

export function renderVendorsTab(): string {
  return `
    <div id="vendors-content" class="py-6">
      <h2 class="text-xl font-semibold mb-4">All Vendors</h2>
      <div id="vendors-list" class="space-y-4"></div>
    </div>
  `;
}

export async function loadVendors(): Promise<void> {
  try {
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const container = document.getElementById('vendors-list');
    if (container) {
      container.innerHTML = vendors?.length
        ? vendors.map(vendor => `
            <div class="border p-4 rounded-lg" id="vendor-${vendor.id}">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="font-semibold">${vendor.name}</h3>
                  <p class="text-sm text-gray-600">${vendor.category}</p>
                </div>
                <button 
                  onclick="deleteVendor('${vendor.id}')"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          `).join('')
        : '<p class="text-gray-500">No vendors found</p>';
    }
  } catch (error) {
    showError('Failed to load vendors');
    console.error('Error loading vendors:', error);
  }
}

export async function deleteVendor(vendorId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', vendorId);

    if (error) throw error;

    // Remove the vendor element from the DOM
    const vendorElement = document.getElementById(`vendor-${vendorId}`);
    if (vendorElement) {
      vendorElement.remove();
    }

    showSuccess('Vendor deleted successfully');

    // Reload the vendors list
    await loadVendors();
  } catch (error) {
    showError('Failed to delete vendor');
    console.error('Error deleting vendor:', error);
  }
}