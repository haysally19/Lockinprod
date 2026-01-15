/*
  # Add Onboarding Status Tracking

  1. New Tables
    - `onboarding_status`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `add_class_completed` (boolean)
      - `ai_prompt_completed` (boolean)
      - `add_to_home_completed` (boolean)
      - `is_completed` (boolean) - overall onboarding completion
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `onboarding_status` table
    - Add policies for authenticated users to read/update their own onboarding status

  3. Functions
    - Trigger to create onboarding status when user signs up
*/

CREATE TABLE IF NOT EXISTS onboarding_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  add_class_completed boolean DEFAULT false,
  ai_prompt_completed boolean DEFAULT false,
  add_to_home_completed boolean DEFAULT false,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE onboarding_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own onboarding status"
  ON onboarding_status
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding status"
  ON onboarding_status
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding status"
  ON onboarding_status
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION create_onboarding_status_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.onboarding_status (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_onboarding'
  ) THEN
    CREATE TRIGGER on_auth_user_created_onboarding
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION create_onboarding_status_for_user();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.is_completed = (
    NEW.add_class_completed AND 
    NEW.ai_prompt_completed AND 
    NEW.add_to_home_completed
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_onboarding_timestamp'
  ) THEN
    CREATE TRIGGER update_onboarding_timestamp
      BEFORE UPDATE ON onboarding_status
      FOR EACH ROW
      EXECUTE FUNCTION update_onboarding_updated_at();
  END IF;
END $$;