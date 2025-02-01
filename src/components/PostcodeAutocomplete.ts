import { POSTCODE_AREAS } from '../utils/postcodes';

export function renderPostcodeAutocomplete(id: string = 'postcode'): string {
  return `
    <div class="relative flex-1">
      <input 
        type="text" 
        id="${id}"
        placeholder="Enter your postcode..."
        class="w-full p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        autocomplete="off"
      >
      <div id="${id}-suggestions" class="absolute z-10 w-full bg-white shadow-lg rounded-b-lg hidden max-h-60 overflow-y-auto"></div>
    </div>
  `;
}

export function initPostcodeAutocomplete(id: string = 'postcode'): void {
  const input = document.getElementById(id) as HTMLInputElement;
  const suggestionsDiv = document.getElementById(`${id}-suggestions`);
  
  if (!input || !suggestionsDiv) return;

  input.addEventListener('input', () => {
    const value = input.value.toUpperCase();
    if (value.length < 1) {
      suggestionsDiv.classList.add('hidden');
      return;
    }

    const matches = POSTCODE_AREAS.filter(area => 
      area.toUpperCase().startsWith(value)
    ).slice(0, 10); // Limit to 10 suggestions

    if (matches.length > 0) {
      suggestionsDiv.innerHTML = matches
        .map(area => `
          <div class="p-2 hover:bg-gray-100 cursor-pointer" data-value="${area}">
            ${area}
          </div>
        `).join('');
      suggestionsDiv.classList.remove('hidden');
    } else {
      suggestionsDiv.classList.add('hidden');
    }
  });

  suggestionsDiv.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.hasAttribute('data-value')) {
      input.value = target.getAttribute('data-value') || '';
      suggestionsDiv.classList.add('hidden');
    }
  });

  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target as Node) && !suggestionsDiv.contains(e.target as Node)) {
      suggestionsDiv.classList.add('hidden');
    }
  });
}