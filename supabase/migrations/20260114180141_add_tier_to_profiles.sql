/*
  # Add subscription tier to profiles

  1. Schema Changes
    - Add `tier` column (text) to profiles table
    - Default value is 'free'
    - Can be 'free' or 'pro'

  2. Notes
    - This tracks whether a user has an active subscription
    - Updated when Stripe payment succeeds or subscription is cancelled
*/

DO $$
BEGIN
  -- Add tier column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'tier'
  ) THEN
    ALTER TABLE profiles ADD COLUMN tier text DEFAULT 'free' NOT NULL;
  END IF;
END $$;