/*
  # Create Camera History Table

  1. New Tables
    - `camera_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `image_data` (text) - Base64 encoded image
      - `solution` (text) - AI generated solution
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `camera_history` table
    - Add policies for authenticated users to manage their own history
*/

CREATE TABLE IF NOT EXISTS camera_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_data text NOT NULL,
  solution text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE camera_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own camera history"
  ON camera_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own camera history"
  ON camera_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own camera history"
  ON camera_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_camera_history_user_created 
  ON camera_history(user_id, created_at DESC);