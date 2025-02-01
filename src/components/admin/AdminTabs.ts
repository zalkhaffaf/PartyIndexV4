export function renderAdminTabs(activeTab: string): string {
  const tabs = [
    { id: 'vendors', label: 'Vendors' },
    { id: 'submissions', label: 'Pending Submissions' },
    { id: 'bookings', label: 'Bookings' }
  ];

  return `
    <div class="border-b border-gray-200">
      <nav class="flex -mb-px">
        ${tabs.map(tab => `
          <button
            class="tab-button ${activeTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
            whitespace-nowrap py-4 px-8 border-b-2 font-medium text-sm"
            data-tab="${tab.id}"
          >
            ${tab.label}
          </button>
        `).join('')}
      </nav>
    </div>
  `;
}