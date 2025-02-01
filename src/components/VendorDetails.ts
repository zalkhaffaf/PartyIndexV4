import { Vendor, VendorImage } from '../types';
import { renderGallerySlider } from './GallerySlider';
import { renderVendorInfo } from './VendorInfo';
import { renderVendorReviews } from './VendorReviews';
import { renderBookingForm, initBookingForm } from './BookingForm';
import { renderModal } from './Modal';

export function renderVendorDetails(vendor: Vendor, images: VendorImage[]): string {
  const content = `
    <!-- Gallery Section -->
    ${renderGallerySlider(images)}

    <!-- Vendor Information -->
    ${renderVendorInfo(vendor)}

    <!-- Book Now Button -->
    <div class="mt-8 text-center">
      <button 
        id="book-now-button"
        class="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-semibold"
      >
        Book Now
      </button>
    </div>

    <!-- Reviews Section -->
    ${renderVendorReviews(vendor.id)}
  `;

  const modalHtml = renderModal(content);

  // Add event listener after a short delay to ensure DOM is ready
  setTimeout(() => {
    const bookButton = document.getElementById('book-now-button');
    if (bookButton) {
      bookButton.addEventListener('click', () => {
        const modalContent = document.querySelector('#vendor-modal .p-6');
        if (modalContent) {
          modalContent.innerHTML = renderBookingForm(vendor);
          initBookingForm(vendor);
        }
      });
    }
  }, 0);

  return modalHtml;
}