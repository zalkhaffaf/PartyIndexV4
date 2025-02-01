import { verifyAdminStatus } from '../services/adminAuthService';
import { navigateTo } from './router';

export async function checkAdminAuth(): Promise<boolean> {
  const isAdmin = await verifyAdminStatus();
  
  if (!isAdmin) {
    navigateTo('/admin/login');
    return false;
  }

  return true;
}