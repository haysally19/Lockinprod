/*
  # Add automatic profile creation on user signup

  1. Changes
    - Create trigger function to automatically create a profile when a user signs up
    - Trigger runs after insert on auth.users table
    - Ensures every user has a profile with default tier 'free'

  2. Security
    - No RLS changes needed
    - Trigger uses SECURITY DEFINER to bypass RLS during automatic creation

  3. Important Notes
    - This ensures profiles always exist before webhook tries to update them
    - Profile is created with user's email and default tier 'free'
*/

-- Function to create profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'free'
  );
  RETURN NEW;
END;
$$;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();