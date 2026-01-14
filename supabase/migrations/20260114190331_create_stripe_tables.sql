/*
  # Stripe Integration Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key) - references auth.users
      - `stripe_customer_id` (text, unique) - Stripe customer ID
      - `email` (text) - customer email
      - `created_at` (timestamptz) - when record was created
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - references auth.users
      - `stripe_subscription_id` (text, unique) - Stripe subscription ID
      - `stripe_customer_id` (text) - references customers
      - `status` (text) - subscription status (active, canceled, past_due, etc.)
      - `price_id` (text) - Stripe price ID
      - `current_period_start` (timestamptz) - billing period start
      - `current_period_end` (timestamptz) - billing period end
      - `cancel_at_period_end` (boolean) - whether subscription will cancel
      - `created_at` (timestamptz) - when subscription was created
      - `updated_at` (timestamptz) - last update timestamp

  2. Security
    - Enable RLS on all tables
    - Users can read their own customer data
    - Users can read their own subscriptions
    - Only service role can write to these tables (via webhooks)

  3. Functions
    - Trigger to automatically update profile tier based on subscription status
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  stripe_customer_id text UNIQUE NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Users can read their own customer data
CREATE POLICY "Users can view own customer data"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id text REFERENCES customers(stripe_customer_id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  price_id text NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Function to update profile tier based on subscription status
CREATE OR REPLACE FUNCTION update_profile_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- If subscription is active, set tier to pro
  IF NEW.status = 'active' THEN
    UPDATE profiles
    SET tier = 'pro'
    WHERE id = NEW.user_id;
  -- If subscription is not active, set tier to free
  ELSE
    UPDATE profiles
    SET tier = 'free'
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update tier when subscription changes
DROP TRIGGER IF EXISTS on_subscription_change ON subscriptions;
CREATE TRIGGER on_subscription_change
  AFTER INSERT OR UPDATE OF status ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_tier();