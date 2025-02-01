/*
  # Create vendors table and setup security

  1. New Tables
    - `vendors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `postcodes` (text array)
      - `description` (text)
      - `contact_email` (text)
      - `phone_number` (text)
      - `rating` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on vendors table
    - Add policy for public read access
    - Add policy for authenticated users to create/update their own vendors
*/

CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  postcodes text[] NOT NULL,
  description text NOT NULL,
  contact_email text NOT NULL,
  phone_number text NOT NULL,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Vendors are viewable by everyone"
  ON vendors
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create vendors
CREATE POLICY "Users can create their own vendors"
  ON vendors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own vendors
CREATE POLICY "Users can update their own vendors"
  ON vendors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);