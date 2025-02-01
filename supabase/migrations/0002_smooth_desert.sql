/*
  # Add test vendor data

  Adds a test vendor in Manchester (M1) area for testing the search functionality
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
  'Magic Party Entertainment',
  'Entertainers',
  ARRAY['M1', 'M2', 'M3'],
  'Professional party entertainment service offering magic shows, balloon modeling, and face painting for children''s parties.',
  'info@magicparty.test',
  '0161-555-0123',
  4.5
);