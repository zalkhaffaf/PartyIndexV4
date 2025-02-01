export interface Vendor {
  id: string;
  name: string;
  category: string;
  postcodes: string[];
  description: string;
  contact_email: string;
  phone_number: string;
  rating: number;
  logo_url?: string;
  pricing_type: 'hourly' | 'flat';
  price_amount: number;
  minimum_hours?: number;
}

export interface VendorImage {
  id: string;
  vendor_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
}

export interface Review {
  id: string;
  vendor_id: string;
  author_name: string;
  rating: number;
  content: string;
  created_at: string;
}

export interface Booking {
  id: string;
  vendor_id: string;
  customer_name: string;
  customer_email: string;
  event_date: string;
  duration_hours?: number;
  requirements: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_amount: number;
  payment_id?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export type VendorCategory = 
  | 'Bouncy Castles'
  | 'Photographers'
  | 'Cake Makers'
  | 'Face Painters'
  | 'Entertainers'
  | 'Party Planners'
  | 'Decorators'
  | 'Catering';