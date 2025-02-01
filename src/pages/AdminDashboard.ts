import { renderAdminTabs } from '../components/admin/AdminTabs';
import { renderVendorsTab, loadVendors, deleteVendor } from '../components/admin/VendorsTab';
import { renderSubmissionsTab, loadPendingSubmissions } from '../components/admin/SubmissionsTab';
import { renderBookingsTab, loadBookings } from '../components/admin/BookingsTab';

export function renderAdminDashboard(): string {
  return `
    <div class="min-h-screen bg-gray-100">
      <div class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <a href="/" class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Back to Home
          </a>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        ${renderAdminTabs('vendors')}
        <div id="tab-content">
          ${renderVendorsTab()}
        </div>
      </div>
    </div>
  `;
}

export function initAdminDashboard(): void {
  // Load initial tab content
  loadVendors();

  // Add tab switching functionality
  document.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('tab-button')) {
      const tabId = target.getAttribute('data-tab');
      if (!tabId) return;

      // Update active tab styling
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('border-orange-500', 'text-orange-600');
        btn.classList.add('border-transparent', 'text-gray-500');
      });
      target.classList.remove('border-transparent', 'text-gray-500');
      target.classList.add('border-orange-500', 'text-orange-600');

      // Update content
      const contentDiv = document.getElementById('tab-content');
      if (!contentDiv) return;

      switch (tabId) {
        case 'vendors':
          contentDiv.innerHTML = renderVendorsTab();
          await loadVendors();
          break;
        case 'submissions':
          contentDiv.innerHTML = renderSubmissionsTab();
          await loadPendingSubmissions();
          break;
        case 'bookings':
          contentDiv.innerHTML = renderBookingsTab();
          await loadBookings();
          break;
      }
    }
  });

  // Add delete vendor function to window
  (window as any).deleteVendor = deleteVendor;
}