import { VENDOR_CATEGORIES } from '../utils/constants';
import { CATEGORY_ICONS } from '../utils/categoryIcons';
import { showError } from '../utils/notifications';
import { searchVendors } from '../services/vendorService';
import { renderVendorCard } from './vendorCard';
import { isSupabaseConfigured, checkSupabaseConnection } from '../config/supabase';

export function renderCategories(): string {
  return `
    <div id="categories-section" class="py-16 px-6 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-8">Select a Category to Get Started</h2>
        <p class="text-gray-600 text-center mb-12">Choose one or more categories to find the perfect vendors for your event</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${VENDOR_CATEGORIES.map(category => `
            <div class="category-card" data-category="${category}">
              <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-2xl">${CATEGORY_ICONS[category]}</span>
                  <h3 class="text-xl font-semibold">${category}</h3>
                </div>
                <input 
                  type="checkbox" 
                  name="category"
                  value="${category}"
                  class="category-checkbox hidden"
                  id="category-${category.toLowerCase().replace(' ', '-')}"
                >
              </div>
            </div>
          `).join('')}
        </div>
        <div class="mt-8 text-center">
          <button 
            id="search-categories"
            class="bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 text-lg font-semibold"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initCategories(): void {
  initCategorySelection();
  initSearchButton();
}

function initCategorySelection(): void {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const checkbox = card.querySelector('.category-checkbox') as HTMLInputElement;
      checkbox.checked = !checkbox.checked;
      card.classList.toggle('selected', checkbox.checked);
    });
  });
}

function initSearchButton(): void {
  document.getElementById('search-categories')?.addEventListener('click', handleSearch);
}

async function handleSearch(): Promise<void> {
  if (!isSupabaseConfigured()) {
    showError('Database connection is not configured. Please contact support.');
    return;
  }

  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    showError('Unable to connect to the server. Please check your internet connection and try again.');
    return;
  }

  const postcode = (document.getElementById('postcode') as HTMLInputElement).value.trim();
  const selectedCategories = Array.from(document.querySelectorAll<HTMLInputElement>('.category-checkbox:checked'))
    .map(checkbox => checkbox.value);

  if (!postcode) {
    showError('Please enter a postcode');
    return;
  }

  if (selectedCategories.length === 0) {
    showError('Please select at least one category');
    return;
  }

  try {
    const { vendors } = await searchVendors(postcode, selectedCategories);
    updateResults(vendors);
  } catch (error) {
    showError('Failed to search vendors. Please try again.');
    console.error('Search error:', error);
  }
}

function updateResults(vendors: any[]): void {
  const resultsDiv = document.getElementById('results');
  if (!resultsDiv) return;

  if (vendors.length > 0) {
    resultsDiv.innerHTML = vendors.map(vendor => renderVendorCard(vendor)).join('');
  } else {
    resultsDiv.innerHTML = '<p class="text-center text-gray-600 py-8">No vendors found in your area for the selected categories.</p>';
  }
  
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}