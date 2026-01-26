/*
  # Create Camera Feedback Table

  1. New Tables
    - `camera_feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_data` (text) - The captured image that had issues
      - `solution_text` (text) - The AI solution that was provided
      - `feedback_type` (text) - Type of feedback: 'wrong_answer', 'unclear', 'bug', 'suggestion', 'other'
      - `feedback_text` (text) - User's detailed feedback
      - `status` (text) - Status: 'new', 'reviewed', 'resolved'
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on `camera_feedback` table
    - Users can insert their own feedback
    - Users can view their own feedback
    - Admin/authenticated users can view all feedback for review
*/

CREATE TABLE IF NOT EXISTS camera_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_data text,
  solution_text text,
  feedback_type text NOT NULL DEFAULT 'other',
  feedback_text text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE camera_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback"
  ON camera_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
  ON camera_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_camera_feedback_user_id ON camera_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_camera_feedback_status ON camera_feedback(status);
CREATE INDEX IF NOT EXISTS idx_camera_feedback_created_at ON camera_feedback(created_at DESC);