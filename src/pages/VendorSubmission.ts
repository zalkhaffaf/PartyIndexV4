import { renderPostcodeSelector, initPostcodeSelector, getSelectedPostcodes } from '../components/PostcodeSelector';
import { createVendor } from '../services/vendorService';
import { showError, showSuccess } from '../utils/notifications';
import { VENDOR_CATEGORIES } from '../utils/constants';

export function renderVendorSubmission(): string {
  return `
    <div class="max-w-2xl mx-auto py-12 px-6">
      <h1 class="text-3xl font-bold mb-8">List Your Service</h1>
      <form id="vendor-form" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Business Logo</label>
          <input type="file" id="logo" accept="image/*" class="mt-1 block w-full">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Gallery Images</label>
          <input type="file" id="gallery" accept="image/*" multiple class="mt-1 block w-full">
          <p class="text-sm text-gray-500 mt-1">You can select multiple images</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Business Name</label>
          <input type="text" id="name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Category</label>
          <select id="category" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
            <option value="">Select a category...</option>
            ${VENDOR_CATEGORIES.map(category => `
              <option value="${category}">${category}</option>
            `).join('')}
          </select>
        </div>

        ${renderPostcodeSelector()}

        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" required rows="4" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
        </div>

        <!-- Pricing Section -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Pricing Type</label>
            <select id="pricing-type" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
              <option value="hourly">Hourly Rate</option>
              <option value="flat">Flat Rate</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Price Amount (£)</label>
            <input type="number" id="price-amount" required min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
          </div>

          <div id="minimum-hours-container">
            <label class="block text-sm font-medium text-gray-700">Minimum Hours</label>
            <input type="number" id="minimum-hours" min="1" step="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Contact Email</label>
          <input type="email" id="contact_email" required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" id="phone_number" required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
        </div>
        
        <button type="submit" 
          class="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
          Submit Listing
        </button>
      </form>
    </div>
  `;
}

export function initVendorSubmission(): void {
  const form = document.getElementById('vendor-form');
  const pricingTypeSelect = document.getElementById('pricing-type') as HTMLSelectElement;
  const minimumHoursContainer = document.getElementById('minimum-hours-container');

  initPostcodeSelector();
  
  // Show/hide minimum hours based on pricing type
  pricingTypeSelect?.addEventListener('change', () => {
    if (minimumHoursContainer) {
      minimumHoursContainer.style.display = 
        pricingTypeSelect.value === 'hourly' ? 'block' : 'none';
      const minimumHoursInput = document.getElementById('minimum-hours') as HTMLInputElement;
      minimumHoursInput.required = pricingTypeSelect.value === 'hourly';
    }
  });

  // Trigger initial state
  pricingTypeSelect?.dispatchEvent(new Event('change'));
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const formData = {
        name: (document.getElementById('name') as HTMLInputElement).value,
        category: (document.getElementById('category') as HTMLSelectElement).value,
        postcodes: getSelectedPostcodes(),
        description: (document.getElementById('description') as HTMLTextAreaElement).value,
        contact_email: (document.getElementById('contact_email') as HTMLInputElement).value,
        phone_number: (document.getElementById('phone_number') as HTMLInputElement).value,
        pricing_type: pricingTypeSelect.value as 'hourly' | 'flat',
        price_amount: parseFloat((document.getElementById('price-amount') as HTMLInputElement).value),
        minimum_hours: pricingTypeSelect.value === 'hourly' 
          ? parseInt((document.getElementById('minimum-hours') as HTMLInputElement).value)
          : undefined
      };

      if (formData.postcodes.length === 0) {
        showError('Please select at least one service area');
        return;
      }

      const { data: vendor } = await createVendor(formData);
      
      if (vendor) {
        showSuccess('Your service has been successfully listed!');
        form.reset();
      }
    } catch (error) {
      showError('Failed to submit your listing. Please try again.');
      console.error('Submission error:', error);
    }
  });
}