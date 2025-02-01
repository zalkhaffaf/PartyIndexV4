import { supabase } from '../config/supabase';
import { showError, showSuccess } from '../utils/notifications';

export function renderVendorGallery(vendorId: string, images: any[]): string {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="gallery-modal">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-semibold">Gallery</h3>
          <button class="text-gray-500 hover:text-gray-700" onclick="closeGallery()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="relative">
          <div class="gallery-container">
            ${images.map((image, index) => `
              <div class="gallery-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${image.image_url}" alt="${image.caption || ''}" class="w-full h-64 object-contain">
                ${image.caption ? `<p class="text-center mt-2">${image.caption}</p>` : ''}
              </div>
            `).join('')}
          </div>
          
          ${images.length > 1 ? `
            <button class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r" onclick="prevSlide()">❮</button>
            <button class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l" onclick="nextSlide()">❯</button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}