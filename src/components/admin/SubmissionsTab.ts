import { supabase } from '../../config/supabase';
import { showError, showSuccess } from '../../utils/notifications';

export function renderSubmissionsTab(): string {
  return `
    <div id="submissions-content" class="py-6">
      <h2 class="text-xl font-semibold mb-4">Pending Vendor Submissions</h2>
      <div id="pending-submissions" class="space-y-4"></div>
    </div>
  `;
}

export async function loadPendingSubmissions(): Promise<void> {
  try {
    const { data: submissions, error } = await supabase
      .from('vendor_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const container = document.getElementById('pending-submissions');
    if (container) {
      container.innerHTML = submissions?.length 
        ? submissions.map(submission => `
            <div class="border p-4 rounded-lg">
              <h3 class="font-semibold">${submission.name}</h3>
              <p class="text-sm text-gray-600">${submission.category}</p>
              <div class="mt-2 flex gap-2">
                <button 
                  onclick="approveSubmission('${submission.id}')"
                  class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button 
                  onclick="rejectSubmission('${submission.id}')"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          `).join('')
        : '<p class="text-gray-500">No pending submissions</p>';
    }
  } catch (error) {
    showError('Failed to load submissions');
    console.error('Error loading submissions:', error);
  }
}