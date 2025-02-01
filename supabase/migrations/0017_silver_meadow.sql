/*
  # Fix Admin Authentication

  1. Changes
    - Ensures proper admin user creation
    - Sets up correct authentication fields
    - Adds necessary indexes and constraints

  2. Security
    - Properly sets up admin role
    - Ensures email confirmation
    - Sets up proper authentication fields
*/

-- First, clean existing data
DO $$
BEGIN
  DELETE FROM admin_users;
  DELETE FROM auth.users WHERE email = 'admin@partyindex.com';
END $$;

-- Create new admin user with all required fields
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Insert into auth.users with all required fields
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
  ) VALUES (
    new_user_id,                                    -- id
    '00000000-0000-0000-0000-000000000000',        -- instance_id
    'authenticated',                                -- aud
    'authenticated',                                -- role
    'admin@partyindex.com',                        -- email
    crypt('Admin123!', gen_salt('bf')),            -- encrypted_password
    now(),                                         -- email_confirmed_at
    now(),                                         -- last_sign_in_at
    '{"provider": "email", "providers": ["email"]}'::jsonb,  -- raw_app_meta_data
    '{}'::jsonb,                                   -- raw_user_meta_data
    true,                                          -- is_super_admin
    now(),                                         -- created_at
    now(),                                         -- updated_at
    null,                                          -- phone
    null,                                          -- phone_confirmed_at
    '',                                            -- confirmation_token
    '',                                            -- recovery_token
    '',                                            -- email_change_token_new
    '',                                            -- email_change
    '',                                            -- email_change_token_current
    0,                                             -- email_change_confirm_status
    null,                                          -- banned_until
    '',                                            -- reauthentication_token
    now(),                                         -- reauthentication_sent_at
    false,                                         -- is_sso_user
    null                                           -- deleted_at
  );

  -- Add to admin_users table
  INSERT INTO admin_users (user_id) VALUES (new_user_id);
END $$;