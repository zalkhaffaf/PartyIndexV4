import { supabase } from '../../config/supabase';
import { showError } from '../../utils/notifications';

export function renderBookingsTab(): string {
  return `
    <div id="bookings-content" class="py-6">
      <h2 class="text-xl font-semibold mb-4">All Bookings</h2>
      <div id="bookings-list" class="space-y-4"></div>
    </div>
  `;
}

export async function loadBookings(): Promise<void> {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        vendors (
          name,
          category
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const container = document.getElementById('bookings-list');
    if (container) {
      container.innerHTML = bookings?.length
        ? bookings.map(booking => `
            <div class="border p-4 rounded-lg">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold">${booking.vendors?.name}</h3>
                  <p class="text-sm text-gray-600">${booking.vendors?.category}</p>
                  <div class="mt-2">
                    <p class="text-sm"><strong>Customer:</strong> ${booking.customer_name}</p>
                    <p class="text-sm"><strong>Email:</strong> ${booking.customer_email}</p>
                    <p class="text-sm"><strong>Date:</strong> ${new Date(booking.event_date).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                    <p class="text-sm mt-2"><strong>Requirements:</strong><br>${booking.requirements}</p>
                  </div>
                </div>
                <span class="inline-block px-2 py-1 text-xs rounded ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }">
                  ${booking.status}
                </span>
              </div>
            </div>
          `).join('')
        : '<p class="text-gray-500">No bookings found</p>';
    }
  } catch (error) {
    showError('Failed to load bookings');
    console.error('Error loading bookings:', error);
  }
}