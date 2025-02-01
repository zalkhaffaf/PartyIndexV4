/*
  # Add admin user

  1. New Data
    - Create admin user credentials
    - Add admin user to admin_users table
*/

-- Create admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role
) VALUES (
  gen_random_uuid(),
  'admin@partyindex.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  'authenticated'
);

-- Add user to admin_users table
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'admin@partyindex.com';