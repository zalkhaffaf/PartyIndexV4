import { supabase } from '../config/supabase';
import { showError, showSuccess } from '../utils/notifications';
import { loadPendingSubmissions } from './adminDashboardService';

export async function approveSubmission(submissionId: string) {
  try {
    const { error } = await supabase
      .from('vendor_submissions')
      .update({ status: 'approved' })
      .eq('id', submissionId);

    if (error) throw error;

    showSuccess('Submission approved');
    await loadPendingSubmissions(); // Refresh the submissions list
  } catch (error) {
    showError('Failed to approve submission');
    console.error('Approve submission error:', error);
  }
}

export async function rejectSubmission(submissionId: string) {
  try {
    const { error } = await supabase
      .from('vendor_submissions')
      .update({ status: 'rejected' })
      .eq('id', submissionId);

    if (error) throw error;

    showSuccess('Submission rejected');
    await loadPendingSubmissions(); // Refresh the submissions list
  } catch (error) {
    showError('Failed to reject submission');
    console.error('Reject submission error:', error);
  }
}

// Add to window object for onclick handlers
(window as any).approveSubmission = approveSubmission;
(window as any).rejectSubmission = rejectSubmission;