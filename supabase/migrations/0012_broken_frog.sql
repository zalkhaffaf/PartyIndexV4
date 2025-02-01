/*
  # Update Admin User

  1. Changes
    - Remove existing admin users
    - Create new admin user with support@partyindex.co.uk email
    - Set up admin permissions

  Note: This migration safely handles existing users
*/

DO $$
BEGIN
  -- First, remove existing admin users
  DELETE FROM admin_users;
  
  -- Delete the old admin user if it exists
  DELETE FROM auth.users 
  WHERE email IN ('admin@partyindex.com', 'support@partyindex.co.uk');

  -- Create the new admin user with proper UUID generation
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
    confirmation_sent_at
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'support@partyindex.co.uk',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    'authenticated',
    '',
    now()
  );

  -- Add to admin_users table
  INSERT INTO admin_users (user_id)
  SELECT id FROM auth.users WHERE email = 'support@partyindex.co.uk';
END $$;