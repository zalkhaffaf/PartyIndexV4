/*
  # Add Bookings Table and Payment Fields

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, references vendors)
      - `customer_name` (text)
      - `customer_email` (text)
      - `event_date` (timestamptz)
      - `requirements` (text)
      - `payment_status` (text)
      - `payment_amount` (numeric)
      - `payment_id` (text)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for authenticated users and vendors
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  event_date timestamptz NOT NULL,
  requirements text,
  payment_status text DEFAULT 'pending',
  payment_amount numeric(10,2),
  payment_id text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Vendors can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Customers can view their own bookings"
  ON bookings
  FOR SELECT
  TO public
  USING (customer_email = current_setting('request.jwt.claims')::json->>'email');