/*
  # Admin Portal Tables

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
    - `vendor_submissions`
      - `id` (uuid, primary key)
      - `status` (enum: pending, approved, rejected)
      - All vendor fields
    - `bookings`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, references vendors)
      - `customer_name` (text)
      - `event_date` (timestamp)
      - `status` (enum: pending, confirmed, completed, cancelled)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create admin_users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create vendor_submissions table
CREATE TABLE vendor_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  postcodes text[] NOT NULL,
  description text NOT NULL,
  contact_email text NOT NULL,
  phone_number text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  event_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Only admins can view admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid()
  ));

-- Vendor submissions policies
CREATE POLICY "Only admins can view submissions"
  ON vendor_submissions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid()
  ));

CREATE POLICY "Only admins can update submissions"
  ON vendor_submissions
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid()
  ));

-- Bookings policies
CREATE POLICY "Only admins can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid()
  ));