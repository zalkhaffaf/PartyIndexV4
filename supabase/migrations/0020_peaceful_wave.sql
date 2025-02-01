-- Add pricing columns to vendors table
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS pricing_type text CHECK (pricing_type IN ('hourly', 'flat')) NOT NULL DEFAULT 'flat',
ADD COLUMN IF NOT EXISTS price_amount numeric(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS minimum_hours integer CHECK (minimum_hours > 0);

-- Add duration_hours to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS duration_hours numeric(4,1) CHECK (duration_hours > 0);

-- Update existing vendors with default pricing
UPDATE vendors
SET price_amount = 100
WHERE price_amount = 0;