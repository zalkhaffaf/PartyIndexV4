import { supabase } from '../config/supabase';
import { showError } from '../utils/notifications';

export async function loadPendingSubmissions() {
  try {
    const { data: submissions, error } = await supabase
      .from('vendor_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const container = document.getElementById('pending-submissions');
    if (container) {
      container.innerHTML = submissions?.length 
        ? submissions.map(submission => `
            <div class="border p-4 rounded-lg">
              <h3 class="font-semibold">${submission.name}</h3>
              <p class="text-sm text-gray-600">${submission.category}</p>
              <div class="mt-2 flex gap-2">
                <button 
                  onclick="approveSubmission('${submission.id}')"
                  class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button 
                  onclick="rejectSubmission('${submission.id}')"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          `).join('')
        : '<p class="text-gray-500">No pending submissions</p>';
    }
  } catch (error) {
    showError('Failed to load submissions');
  }
}

export async function loadVendors() {
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
            <div class="border p-4 rounded-lg">
              <h3 class="font-semibold">${vendor.name}</h3>
              <p class="text-sm text-gray-600">${vendor.category}</p>
              <button 
                onclick="deleteVendor('${vendor.id}')"
                class="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          `).join('')
        : '<p class="text-gray-500">No vendors found</p>';
    }
  } catch (error) {
    showError('Failed to load vendors');
  }
}

export async function loadBookings() {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, vendors(name)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const container = document.getElementById('bookings-list');
    if (container) {
      container.innerHTML = bookings?.length
        ? bookings.map(booking => `
            <div class="border p-4 rounded-lg">
              <h3 class="font-semibold">${booking.vendors.name}</h3>
              <p class="text-sm text-gray-600">
                ${booking.customer_name} - ${new Date(booking.event_date).toLocaleDateString()}
              </p>
              <span class="inline-block px-2 py-1 text-xs rounded ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }">
                ${booking.status}
              </span>
            </div>
          `).join('')
        : '<p class="text-gray-500">No recent bookings</p>';
    }
  } catch (error) {
    showError('Failed to load bookings');
  }
}