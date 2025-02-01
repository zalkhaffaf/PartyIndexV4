/*
  # Add test vendor for search functionality

  1. New Data
    - Add a test vendor in the M1 postcode area
*/

INSERT INTO vendors (
  name,
  category,
  postcodes,
  description,
  contact_email,
  phone_number,
  rating
) VALUES (
  'Fun Time Entertainment',
  'Entertainers',
  ARRAY['M1', 'M2', 'M3'],
  'Professional children''s entertainment service offering magic shows, games, and party activities.',
  'info@funtime.test',
  '0161-123-4567',
  4.8
);