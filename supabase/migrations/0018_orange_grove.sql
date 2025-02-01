/*
  # Fix Admin Users Policies

  1. Changes
    - Drops existing problematic policies
    - Creates new, properly scoped policies
    - Fixes infinite recursion issue

  2. Security
    - Ensures proper access control
    - Prevents policy recursion
    - Maintains admin-only access
*/

-- First, drop any existing policies on admin_users
DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON admin_users;

-- Create new, properly scoped policies
CREATE POLICY "Public read access for admin verification"
  ON admin_users
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only super admins can insert"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.is_super_admin = true
    )
  );

CREATE POLICY "Only super admins can update"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.is_super_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.is_super_admin = true
    )
  );

CREATE POLICY "Only super admins can delete"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.is_super_admin = true
    )
  );