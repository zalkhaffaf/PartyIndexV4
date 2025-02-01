import { supabase } from '../config/supabase';
import type { Booking } from '../types';

export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getVendorBookings(vendorId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}