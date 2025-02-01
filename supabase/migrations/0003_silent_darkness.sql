/*
  # Fix vendor table RLS policies

  1. Changes
    - Drop existing RLS policies
    - Add new policies for:
      - Public read access
      - Public insert access (temporary for testing)
      - User-specific update access
  
  2. Security
    - Enables public read access
    - Allows anyone to create vendors (for testing purposes)
    - Restricts updates to owner only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Vendors are viewable by everyone" ON vendors;
DROP POLICY IF EXISTS "Users can create their own vendors" ON vendors;
DROP POLICY IF EXISTS "Users can update their own vendors" ON vendors;

-- Allow public read access
CREATE POLICY "Vendors are viewable by everyone"
  ON vendors
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert access (for testing)
CREATE POLICY "Anyone can create vendors"
  ON vendors
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to update their own vendors
CREATE POLICY "Users can update their own vendors"
  ON vendors
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);