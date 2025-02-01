import type { Vendor } from '../types';
import { supabase } from '../config/supabase';
import { renderVendorDetails } from './VendorDetails';
import { loadVendorReviews } from './VendorReviews';

export function renderVendorCard(vendor: Vendor): string {
  return `
    <div class="bg-white p-6 rounded-lg shadow-md mb-4 cursor-pointer hover:shadow-lg transition-shadow" 
         onclick="showVendorDetails('${vendor.id}')">
      <div class="flex items-center gap-4 mb-4">
        ${vendor.logo_url ? 
          `<img src="${vendor.logo_url}" alt="${vendor.name} logo" class="w-16 h-16 object-contain">` : 
          `<div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span class="text-2xl text-gray-400">${vendor.name.charAt(0)}</span>
          </div>`
        }
        <div>
          <h3 class="text-xl font-semibold">${vendor.name}</h3>
          <p class="text-blue-600">${vendor.category}</p>
        </div>
      </div>
      <p class="text-gray-600 mb-4">${vendor.description}</p>
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm text-gray-500">📧 ${vendor.contact_email}</p>
          <p class="text-sm text-gray-500">📞 ${vendor.phone_number}</p>
        </div>
        <div class="text-yellow-500">
          ${'★'.repeat(Math.round(vendor.rating))}${'☆'.repeat(5 - Math.round(vendor.rating))}
        </div>
      </div>
    </div>
  `;
}

// Gallery functions
function initGallery() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.gallery-slide');
  const dots = document.querySelectorAll('.gallery-dot');

  function showSlide(index: number) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('bg-gray-600'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('bg-gray-600');
    currentSlide = index;
  }

  (window as any).prevSlide = () => {
    const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    showSlide(newIndex);
  };

  (window as any).nextSlide = () => {
    const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    showSlide(newIndex);
  };

  (window as any).goToSlide = (index: number) => {
    showSlide(index);
  };
}

// Modal functions
(window as any).showVendorDetails = async (vendorId: string) => {
  try {
    const [{ data: vendor }, { data: images }] = await Promise.all([
      supabase.from('vendors').select('*').eq('id', vendorId).single(),
      supabase.from('vendor_images').select('*').eq('vendor_id', vendorId).order('display_order')
    ]);

    if (!vendor) throw new Error('Vendor not found');

    const modalHtml = renderVendorDetails(vendor, images || []);
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    initGallery();
    await loadVendorReviews(vendorId);
  } catch (error) {
    console.error('Error loading vendor details:', error);
  }
};

(window as any).closeVendorModal = () => {
  document.getElementById('vendor-modal')?.remove();
};