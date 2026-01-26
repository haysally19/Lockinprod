/*
  # Create Quick Solve History Table

  1. New Tables
    - `quicksolve_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_data` (text) - Base64 encoded image of the problem
      - `solution` (text) - The AI-generated solution
      - `explanation_mode` (text) - Either 'nerd' or 'bro'
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on `quicksolve_history` table
    - Users can only insert their own history
    - Users can only view their own history
    - Users can delete their own history items
    
  3. Indexes
    - Index on user_id for fast user-specific queries
    - Index on created_at for chronological sorting
*/

CREATE TABLE IF NOT EXISTS quicksolve_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_data text NOT NULL,
  solution text NOT NULL,
  explanation_mode text NOT NULL DEFAULT 'nerd',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quicksolve_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own quicksolve history"
  ON quicksolve_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own quicksolve history"
  ON quicksolve_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quicksolve history"
  ON quicksolve_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_quicksolve_history_user_id ON quicksolve_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quicksolve_history_created_at ON quicksolve_history(created_at DESC);