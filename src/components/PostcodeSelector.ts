import { POSTCODE_AREAS } from '../utils/postcodes';

export function renderPostcodeSelector(): string {
  return `
    <div class="space-y-4">
      <label class="block text-sm font-medium text-gray-700">Service Areas (Postcodes)</label>
      <div class="relative">
        <input 
          type="text" 
          id="postcode-search"
          placeholder="Search postcodes..."
          class="w-full p-2 border rounded-md mb-2"
        >
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
          ${POSTCODE_AREAS.map(area => `
            <label class="postcode-option flex items-center space-x-2 p-1 hover:bg-gray-50">
              <input 
                type="checkbox" 
                name="postcodes" 
                value="${area}"
                class="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              >
              <span class="text-sm">${area}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <p class="text-sm text-gray-500">Select all postcodes where you provide service</p>
      <div class="flex justify-between text-sm text-gray-500">
        <button type="button" id="select-all-postcodes" class="text-orange-500 hover:text-orange-600">Select All</button>
        <button type="button" id="clear-all-postcodes" class="text-orange-500 hover:text-orange-600">Clear All</button>
      </div>
    </div>
  `;
}

export function initPostcodeSelector(): void {
  const searchInput = document.getElementById('postcode-search') as HTMLInputElement;
  const selectAllBtn = document.getElementById('select-all-postcodes');
  const clearAllBtn = document.getElementById('clear-all-postcodes');
  const options = document.querySelectorAll('.postcode-option');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = (e.target as HTMLInputElement).value.toUpperCase();
      options.forEach(option => {
        const postcode = option.querySelector('span')?.textContent || '';
        const matches = postcode.toUpperCase().includes(searchTerm);
        (option as HTMLElement).style.display = matches ? '' : 'none';
      });
    });
  }

  selectAllBtn?.addEventListener('click', () => {
    document.querySelectorAll<HTMLInputElement>('input[name="postcodes"]')
      .forEach(checkbox => { checkbox.checked = true; });
  });

  clearAllBtn?.addEventListener('click', () => {
    document.querySelectorAll<HTMLInputElement>('input[name="postcodes"]')
      .forEach(checkbox => { checkbox.checked = false; });
  });
}

export function getSelectedPostcodes(): string[] {
  const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="postcodes"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}