export function renderHeader(): string {
  return `
    <header class="bg-white py-4 px-6 flex justify-between items-center">
    <img src="https://partyindex.co.uk/200x70logo.png" />
      <nav>
        <a href="/" class="mx-2 text-gray-600 hover:text-gray-800">Home</a>
        <a href="/blog" class="mx-2 text-gray-600 hover:text-gray-800">Blog</a>
        <a href="/vendor-submission" class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          List Your Service
        </a>
      </nav>
    </header>
  `;
}