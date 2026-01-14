/*
  # Add Credits and Streak Tracking

  1. Schema Changes
    - Add `daily_tokens` (integer) - tracks tokens used today (0-5 for free users)
    - Add `bonus_credits` (integer) - tracks bonus credits available
    - Add `streak` (integer) - tracks consecutive login days
    - Add `last_visit_date` (date) - tracks the last day user visited (for daily reset logic)

  2. Notes
    - `last_visit_date` stores only the date (not timestamp) to compare days
    - Daily tokens reset to 0 at midnight (when date changes)
    - Streak increments when user visits on consecutive days
*/

DO $$
BEGIN
  -- Add daily_tokens column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'daily_tokens'
  ) THEN
    ALTER TABLE profiles ADD COLUMN daily_tokens integer DEFAULT 0 NOT NULL;
  END IF;

  -- Add bonus_credits column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bonus_credits'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bonus_credits integer DEFAULT 0 NOT NULL;
  END IF;

  -- Add streak column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'streak'
  ) THEN
    ALTER TABLE profiles ADD COLUMN streak integer DEFAULT 0 NOT NULL;
  END IF;

  -- Add last_visit_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_visit_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_visit_date date;
  END IF;
END $$;