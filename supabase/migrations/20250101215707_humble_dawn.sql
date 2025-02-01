/*
  # Add requirements column to bookings table

  1. Changes
    - Add requirements column to bookings table for storing booking requirements/notes
*/

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS requirements text;