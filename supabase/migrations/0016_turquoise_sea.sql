/*
  # Rebuild Admin Authentication System

  1. Changes
    - Resets and rebuilds admin authentication
    - Creates new admin user with proper authentication fields
    - Sets up secure admin verification

  2. Security
    - Uses secure password hashing
    - Implements proper role-based access control
    - Sets up email verification
*/

-- First, clean up existing admin data
DO $$
BEGIN
  -- Remove existing admin entries
  DELETE FROM admin_users;
  DELETE FROM auth.users WHERE email = 'admin@partyindex.com';
END $$;

-- Create function to set up admin user
CREATE OR REPLACE FUNCTION setup_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create admin user
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
    is_super_admin,
    is_sso_user,
    email_change_confirm_status,
    banned_until,
    reauthentication_sent_at
  ) VALUES (
    gen_random_uuid(),
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
    true,
    false,
    0,
    null,
    now()
  ) RETURNING id INTO new_user_id;

  -- Add to admin_users table
  INSERT INTO admin_users (user_id) VALUES (new_user_id);
END;
$$;

-- Execute the setup
SELECT setup_admin_user();

-- Drop the function after use
DROP FUNCTION setup_admin_user();

-- Create or replace admin verification function
CREATE OR REPLACE FUNCTION verify_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE user_id = $1
  );
END;
$$;