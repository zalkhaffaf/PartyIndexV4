/*
  # Admin User Setup

  1. Changes
    - Creates initial admin user with proper credentials
    - Sets up admin role in admin_users table

  2. Security
    - Uses secure password hashing
    - Sets proper user metadata
*/

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- First clean up any existing data
  DELETE FROM admin_users;
  
  -- Remove existing admin users
  DELETE FROM auth.users 
  WHERE email IN ('admin@partyindex.com', 'support@partyindex.co.uk');

  -- Create new admin user with explicit UUID
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    confirmation_token,
    confirmation_sent_at,
    aud,
    is_super_admin
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@partyindex.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    'authenticated',
    '',
    now(),
    'authenticated',
    false
  );

  -- Add to admin_users table
  INSERT INTO admin_users (user_id) VALUES (new_user_id);
END $$;