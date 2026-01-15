/*
  # Update automatic profile creation to include phone number

  1. Changes
    - Update handle_new_user() function to include phone from user metadata
    - Extracts phone from raw_user_meta_data if provided during signup

  2. Security
    - No RLS changes needed
    - Function uses SECURITY DEFINER to bypass RLS during automatic creation
*/

-- Update the function to include phone number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    'free'
  );
  RETURN NEW;
END;
$$;