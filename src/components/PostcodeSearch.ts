import { POSTCODE_AREAS } from '../utils/postcodes';

export function renderPostcodeSearch(): string {
  return `
    <div class="relative flex-1">
      <input 
        type="text" 
        id="postcode"
        placeholder="Enter your postcode..."
        class="w-full p-4 rounded-l-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        autocomplete="off"
        oninput="this.value = this.value.toUpperCase()"
      >
      <div id="postcode-suggestions" class="absolute left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1 max-h-48 overflow-y-auto hidden">
      </div>
    </div>
  `;
}

export function initPostcodeSearch(): void {
  const input = document.getElementById('postcode') as HTMLInputElement;
  const suggestionsDiv = document.getElementById('postcode-suggestions');

  if (!input || !suggestionsDiv) return;

  input.addEventListener('input', () => {
    const value = input.value.toUpperCase();
    
    if (value.length < 1) {
      suggestionsDiv.classList.add('hidden');
      return;
    }

    const matches = POSTCODE_AREAS.filter(area => 
      area.startsWith(value)
    ).slice(0, 6); // Limit to 6 suggestions for better UX

    if (matches.length > 0) {
      suggestionsDiv.innerHTML = matches
        .map(area => `
          <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer postcode-suggestion">
            ${area}
          </div>
        `).join('');
      suggestionsDiv.classList.remove('hidden');
    } else {
      suggestionsDiv.classList.add('hidden');
    }
  });

  // Handle suggestion clicks
  suggestionsDiv.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('postcode-suggestion')) {
      input.value = target.textContent?.trim() || '';
      suggestionsDiv.classList.add('hidden');
      
      // Scroll to categories section
      const categoriesSection = document.getElementById('categories-section');
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target as Node) && !suggestionsDiv.contains(e.target as Node)) {
      suggestionsDiv.classList.add('hidden');
    }
  });

  // Add enter key support for scrolling
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      const categoriesSection = document.getElementById('categories-section');
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}