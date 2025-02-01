import { supabase, isSupabaseConfigured } from '../config/supabase';
import type { Vendor, VendorCategory } from '../types';
import { showError } from '../utils/notifications';
import { withRetry } from '../utils/retryFetch';

const VENDORS_PER_PAGE = 10;

export async function searchVendors(
  postcode: string, 
  selectedCategories: VendorCategory[],
  page = 0
): Promise<{ vendors: Vendor[], total: number }> {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Database configuration is missing. Please check your environment variables.');
    }

    const from = page * VENDORS_PER_PAGE;
    const to = from + VENDORS_PER_PAGE - 1;

    const { data, count, error } = await withRetry(async () => {
      const result = await supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .contains('postcodes', [postcode])
        .in('category', selectedCategories)
        .range(from, to)
        .order('rating', { ascending: false });

      if (result.error) {
        throw result.error;
      }
      return result;
    });

    if (error) throw error;

    return { 
      vendors: data || [], 
      total: count || 0 
    };
  } catch (error: any) {
    console.error('Error fetching vendors:', error);
    const errorMessage = error.message?.includes('connect error') 
      ? 'Unable to connect to the server. Please check your internet connection and try again.'
      : 'Failed to fetch vendors. Please try again later.';
    showError(errorMessage);
    return { vendors: [], total: 0 };
  }
}

export async function createVendor(vendorData: Omit<Vendor, 'id' | 'rating' | 'user_id'>): Promise<{ data: Vendor | null, error: Error | null }> {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Database configuration is missing. Please check your environment variables.');
    }

    const { data, error } = await withRetry(async () => {
      const result = await supabase
        .from('vendors')
        .insert([{ 
          ...vendorData, 
          rating: 0,
          user_id: null
        }])
        .select()
        .single();

      if (result.error) {
        throw result.error;
      }
      return result;
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error creating vendor:', error);
    const errorMessage = error.message?.includes('connect error')
      ? 'Unable to connect to the server. Please check your internet connection and try again.'
      : 'Failed to create vendor. Please try again later.';
    showError(errorMessage);
    return { data: null, error: error as Error };
  }
}