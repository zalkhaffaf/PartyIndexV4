/*
  # Fix admin user authentication
  
  1. Changes
    - Create admin user if not exists
    - Ensure admin user is properly linked in admin_users table
*/

-- First, ensure we have the correct extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admin user if not exists
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@partyindex.com';
  
  -- If admin user doesn't exist, create it
  IF admin_user_id IS NULL THEN
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      confirmation_token
    ) VALUES (
      'admin@partyindex.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      'authenticated',
      ''
    ) RETURNING id INTO admin_user_id;
  END IF;

  -- Add admin user reference if not exists
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE user_id = admin_user_id) THEN
    INSERT INTO admin_users (user_id) VALUES (admin_user_id);
  END IF;
END $$;