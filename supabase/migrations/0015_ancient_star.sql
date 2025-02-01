/*
  # Fix Admin User Authentication

  1. Changes
    - Properly creates admin user with all required fields
    - Ensures email is confirmed
    - Sets up proper authentication metadata

  2. Security
    - Uses secure password hashing
    - Sets proper user role and permissions
*/

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Clean up existing data
  DELETE FROM admin_users;
  DELETE FROM auth.users WHERE email = 'admin@partyindex.com';

  -- Create admin user with all required fields
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
    true,
    false,
    0,
    null,
    now()
  );

  -- Add to admin_users table
  INSERT INTO admin_users (user_id) VALUES (new_user_id);

  -- Ensure email is confirmed and user is active
  UPDATE auth.users 
  SET 
    email_confirmed_at = now(),
    email_change_confirm_status = 0,
    is_sso_user = false,
    banned_until = null,
    reauthentication_sent_at = now(),
    instance_id = '00000000-0000-0000-0000-000000000000'
  WHERE id = new_user_id;
END $$;