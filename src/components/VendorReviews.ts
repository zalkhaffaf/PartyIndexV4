import { supabase } from '../config/supabase';

export function renderVendorReviews(vendorId: string): string {
  return `
    <div class="border-t pt-8">
      <h2 class="text-2xl font-semibold mb-6">Reviews</h2>
      <div id="vendor-reviews" class="space-y-6">
        Loading reviews...
      </div>
    </div>
  `;
}

export async function loadVendorReviews(vendorId: string): Promise<void> {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const reviewsContainer = document.getElementById('vendor-reviews');
    if (reviewsContainer) {
      if (reviews && reviews.length > 0) {
        reviewsContainer.innerHTML = reviews.map(review => `
          <div class="border-b pb-6">
            <div class="flex items-center gap-2 mb-2">
              <div class="text-yellow-500">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
              <span class="text-gray-600">by ${review.author_name}</span>
            </div>
            <p class="text-gray-700">${review.content}</p>
          </div>
        `).join('');
      } else {
        reviewsContainer.innerHTML = '<p class="text-gray-500">No reviews yet.</p>';
      }
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
    const reviewsContainer = document.getElementById('vendor-reviews');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = '<p class="text-red-500">Failed to load reviews.</p>';
    }
  }
}