/*
  # Fix Admin Authentication

  1. Changes
    - Properly set up admin user with correct credentials
    - Ensure admin_users entry exists
*/

DO $$
BEGIN
  -- First, ensure the admin user exists in auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@partyindex.com'
  ) THEN
    -- Insert the admin user with a secure password
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
      crypt('Admin123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      'authenticated',
      ''
    );
  END IF;

  -- Ensure the user is in admin_users table
  INSERT INTO admin_users (user_id)
  SELECT id FROM auth.users WHERE email = 'admin@partyindex.com'
  ON CONFLICT DO NOTHING;
END $$;