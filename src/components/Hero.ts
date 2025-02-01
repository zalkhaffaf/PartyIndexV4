import { renderPostcodeSearch } from './PostcodeSearch';

export function renderHero(): string {
  return `
    <div class="relative bg-gradient-to-r from-orange-500 to-red-600 py-32 px-6 text-center">
      <h1 class="text-5xl font-bold text-white mb-4">
        Find Amazing Party Services Near You
      </h1>
      <p class="text-xl text-white mb-8">
        Entertainment, decorations, catering and more for your kid's special day
      </p>
      <div class="max-w-2xl mx-auto flex">
        ${renderPostcodeSearch()}
        <button 
          id="search"
          class="bg-orange-500 text-white px-8 py-4 rounded-r-lg hover:bg-orange-600 text-lg font-semibold"
        >
          Search
        </button>
      </div>
    </div>
  `;
}