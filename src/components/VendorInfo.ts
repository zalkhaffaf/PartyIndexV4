import { Vendor } from '../types';

export function renderVendorInfo(vendor: Vendor): string {
  return `
    <div class="grid md:grid-cols-2 gap-8 mb-8">
      <div>
        <div class="flex items-center gap-4 mb-6">
          ${vendor.logo_url ? 
            `<img src="${vendor.logo_url}" alt="${vendor.name} logo" class="w-20 h-20 object-contain">` : 
            `<div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span class="text-3xl text-gray-400">${vendor.name.charAt(0)}</span>
            </div>`
          }
          <div>
            <h1 class="text-3xl font-bold">${vendor.name}</h1>
            <p class="text-blue-600 text-lg">${vendor.category}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h2 class="text-xl font-semibold mb-2">About Us</h2>
            <p class="text-gray-600">${vendor.description}</p>
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-2">Service Areas</h2>
            <div class="flex flex-wrap gap-2">
              ${vendor.postcodes.map(postcode => `
                <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">${postcode}</span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold mb-4">Pricing</h2>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-lg font-medium">
              ${vendor.pricing_type === 'hourly' 
                ? `£${vendor.price_amount}/hour${vendor.minimum_hours 
                    ? ` (minimum ${vendor.minimum_hours} hours)`
                    : ''}`
                : `£${vendor.price_amount} flat rate`
              }
            </p>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-4">Contact Information</h2>
          <div class="space-y-3">
            <p class="flex items-center gap-2">
              <span class="text-gray-500">📧</span>
              <a href="mailto:${vendor.contact_email}" class="text-blue-600 hover:underline">
                ${vendor.contact_email}
              </a>
            </p>
            <p class="flex items-center gap-2">
              <span class="text-gray-500">📞</span>
              <a href="tel:${vendor.phone_number}" class="text-blue-600 hover:underline">
                ${vendor.phone_number}
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-4">Rating</h2>
          <div class="flex items-center gap-2">
            <div class="text-2xl text-yellow-500">
              ${'★'.repeat(Math.round(vendor.rating))}${'☆'.repeat(5 - Math.round(vendor.rating))}
            </div>
            <span class="text-gray-600">(${vendor.rating.toFixed(1)})</span>
          </div>
        </div>
      </div>
    </div>
  `;
}