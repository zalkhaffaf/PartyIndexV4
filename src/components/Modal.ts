export function renderModal(content: string): string {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
         id="vendor-modal"
         onclick="handleModalClick(event)">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto relative">
        <!-- Close button -->
        <div class="sticky top-0 z-10 flex justify-end p-4 bg-white border-b">
          <button 
            class="text-gray-500 hover:text-gray-700 transition-colors" 
            onclick="closeVendorModal()"
            aria-label="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          ${content}
        </div>
      </div>
    </div>
  `;
}

// Add click handler for modal background
(window as any).handleModalClick = (event: MouseEvent) => {
  const modal = document.getElementById('vendor-modal');
  const modalContent = modal?.querySelector('.bg-white');
  
  if (event.target === modal && !modalContent?.contains(event.target as Node)) {
    (window as any).closeVendorModal();
  }
};

// Add close handler
(window as any).closeVendorModal = () => {
  document.getElementById('vendor-modal')?.remove();
};