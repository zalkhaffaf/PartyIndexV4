export function renderFooter(): string {
  return `
    <footer class="bg-gray-800 text-white py-12 px-6">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">PartyIndex</h3>
          <p class="text-gray-400">Find the perfect entertainment for your kid's special day</p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><a href="/vendor-submission" class="text-gray-400 hover:text-white">Become a Vendor</a></li>
            <li><a href="/admin/login" class="text-gray-400 hover:text-white">Admin Portal</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Contact</h4>
          <p class="text-gray-400">For support inquiries:<br>support@partyindex.co.uk</p>
        </div>
      </div>
      <div class="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
        © ${new Date().getFullYear()} PartyIndex. All rights reserved.
      </div>
    </footer>
  `;
}