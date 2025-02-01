import { createBooking } from '../services/bookingService';
import { showError, showSuccess } from '../utils/notifications';
import { Vendor } from '../types';
import { generateTimeSlots } from '../utils/timeSlots';

export function renderBookingForm(vendor: Vendor): string {
  const timeSlots = generateTimeSlots();
  const today = new Date().toISOString().split('T')[0];

  return `
    <div class="booking-form bg-white p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-6">Book ${vendor.name}</h2>
      <form id="booking-form" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Event Date</label>
          <input 
            type="date" 
            id="event-date"
            required
            min="${today}"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Event Time</label>
          <select 
            id="event-time"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="">Select a time</option>
            ${timeSlots.map(time => `
              <option value="${time}">${time}</option>
            `).join('')}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Your Name</label>
          <input 
            type="text" 
            id="customer-name"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Your Email</label>
          <input 
            type="email" 
            id="customer-email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Requirements</label>
          <textarea 
            id="requirements"
            rows="4"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            placeholder="Please describe your requirements..."
          ></textarea>
        </div>

        <button 
          type="submit"
          class="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Submit Booking
        </button>
      </form>
    </div>
  `;
}

export function initBookingForm(vendor: Vendor): void {
  const form = document.getElementById('booking-form');
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const dateInput = document.getElementById('event-date') as HTMLInputElement;
      const timeInput = document.getElementById('event-time') as HTMLSelectElement;
      
      // Combine date and time
      const eventDateTime = new Date(`${dateInput.value}T${timeInput.value}`);
      
      if (isNaN(eventDateTime.getTime())) {
        throw new Error('Invalid date and time');
      }

      const bookingData = {
        vendor_id: vendor.id,
        event_date: eventDateTime.toISOString(),
        customer_name: (document.getElementById('customer-name') as HTMLInputElement).value,
        customer_email: (document.getElementById('customer-email') as HTMLInputElement).value,
        requirements: (document.getElementById('requirements') as HTMLTextAreaElement).value,
        status: 'pending'
      };

      await createBooking(bookingData);
      showSuccess('Booking submitted successfully! You will receive a confirmation email shortly.');
      (window as any).closeVendorModal();
    } catch (error) {
      showError('Failed to submit booking. Please ensure all fields are filled correctly.');
      console.error('Booking error:', error);
    }
  });
}