/*
  # Create chat messages table for AI tutor conversation persistence

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `course_id` (uuid, foreign key) - References the course this conversation belongs to
      - `user_id` (uuid, foreign key) - References the user who owns this conversation
      - `role` (text) - Either 'user' or 'model' to indicate who sent the message
      - `content` (text) - The message content
      - `timestamp` (timestamptz) - When the message was sent
      - `created_at` (timestamptz) - Database record creation timestamp

  2. Security
    - Enable RLS on `chat_messages` table
    - Add policy for authenticated users to read their own chat messages
    - Add policy for authenticated users to insert their own chat messages
    
  3. Indexes
    - Add index on (course_id, timestamp) for efficient conversation history retrieval
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'model')),
  content text NOT NULL,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient retrieval
CREATE INDEX IF NOT EXISTS idx_chat_messages_course_timestamp 
  ON chat_messages(course_id, timestamp);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own chat messages
CREATE POLICY "Users can read own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own chat messages
CREATE POLICY "Users can insert own chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own chat messages
CREATE POLICY "Users can delete own chat messages"
  ON chat_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);