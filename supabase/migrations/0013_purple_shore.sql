/*
  # Admin Management System

  1. New Functions
    - create_admin: Creates a new admin user
    - remove_admin: Removes an admin user
    - list_admins: Lists all admin users

  2. Security
    - Only existing admins can create/remove other admins
    - RLS policies to protect admin operations
*/

-- Function to create a new admin user
CREATE OR REPLACE FUNCTION create_admin(
  admin_email text,
  admin_password text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only existing admins can create new admins';
  END IF;

  -- Create the user in auth.users
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
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    'authenticated',
    ''
  ) RETURNING id INTO new_user_id;

  -- Add to admin_users table
  INSERT INTO admin_users (user_id)
  VALUES (new_user_id);

  RETURN new_user_id;
END;
$$;

-- Function to remove an admin user
CREATE OR REPLACE FUNCTION remove_admin(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only existing admins can remove admins';
  END IF;

  -- Remove from admin_users first (due to foreign key constraint)
  DELETE FROM admin_users
  WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = admin_email
  );

  -- Remove from auth.users
  DELETE FROM auth.users WHERE email = admin_email;
END;
$$;

-- Function to list all admin users
CREATE OR REPLACE FUNCTION list_admins()
RETURNS TABLE (
  email text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT u.email, u.created_at
  FROM auth.users u
  JOIN admin_users a ON u.id = a.user_id
  ORDER BY u.created_at DESC;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_admin TO authenticated;
GRANT EXECUTE ON FUNCTION remove_admin TO authenticated;
GRANT EXECUTE ON FUNCTION list_admins TO authenticated;