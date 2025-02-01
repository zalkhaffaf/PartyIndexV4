/*
  # Add admin user to admin_users table
  
  1. Changes
    - Remove direct auth.users insertion (will be handled through sign-up)
    - Add admin user reference only
*/

-- Add admin user reference
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'admin@partyindex.com';