/*
  # Add vendor images and logos support
  
  1. Changes
    - Add logo column to vendors table
    - Create vendor_images table for gallery images
  2. Security
    - Enable RLS on vendor_images table
    - Add policies for public viewing and vendor management
*/

-- Add logo column to vendors table
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS logo_url text;

-- Create vendor_images table
CREATE TABLE IF NOT EXISTS vendor_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vendor_images ENABLE ROW LEVEL SECURITY;

-- Policies for vendor_images
CREATE POLICY "Vendor images are viewable by everyone"
  ON vendor_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Vendors can manage their own images"
  ON vendor_images
  FOR ALL
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE user_id = auth.uid()
    )
  );