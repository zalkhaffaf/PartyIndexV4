export function renderBetaBanner(): string {
  return `
    <div id="beta-banner" class="fixed bottom-0 left-0 right-0 bg-blue-500 text-white p-4 text-center z-50">
      <div class="max-w-6xl mx-auto relative">
        <button 
          id="close-beta-banner"
          class="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-blue-100"
          aria-label="Close banner"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p class="pr-8">
          🚀 This website is in beta testing. We welcome your feedback! Please email 
          <a href="mailto:support@partyindex.co.uk" class="underline hover:text-blue-100">support@partyindex.co.uk</a> 
          if you encounter any issues.
        </p>
      </div>
    </div>
  `;
}

export function initBetaBanner(): void {
  const closeButton = document.getElementById('close-beta-banner');
  const banner = document.getElementById('beta-banner');

  closeButton?.addEventListener('click', () => {
    banner?.remove();
  });
}