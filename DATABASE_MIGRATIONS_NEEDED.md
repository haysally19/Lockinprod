# Required Database Migrations

This document outlines the database tables that need to be created to support the class-based flashcard and quiz system.

## Migration 1: Courses, Notes, and Documents Tables

These core tables are referenced by the application but don't exist in migrations yet.

```sql
-- See migration file: create_courses_and_notes_tables.sql
-- Creates: courses, notes, documents tables with proper RLS
```

## Migration 2: Add course_id to quicksolve_history

Link quick solve problems to specific classes.

```sql
ALTER TABLE quicksolve_history
ADD COLUMN course_id uuid REFERENCES courses(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_quicksolve_history_course_id
ON quicksolve_history(course_id);
```

## Migration 3: Flashcard System Tables

Store generated and custom flashcards per class.

```sql
-- Flashcard decks for organization
CREATE TABLE IF NOT EXISTS flashcard_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  source text NOT NULL DEFAULT 'manual', -- 'manual', 'generated', 'quicksolve'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Individual flashcards
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  quicksolve_id uuid REFERENCES quicksolve_history(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Flashcard review tracking for spaced repetition
CREATE TABLE IF NOT EXISTS flashcard_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flashcard_id uuid NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  difficulty integer NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  next_review timestamptz,
  reviewed_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_course_id ON flashcard_decks(course_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_user_id ON flashcard_decks(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_deck_id ON flashcards(deck_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_flashcard_id ON flashcard_reviews(flashcard_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_next_review ON flashcard_reviews(next_review);

-- RLS Policies
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own flashcard decks"
  ON flashcard_decks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own flashcard decks"
  ON flashcard_decks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard decks"
  ON flashcard_decks FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcard decks"
  ON flashcard_decks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- (Similar policies for flashcards and flashcard_reviews)
```

## Migration 4: Quiz System Tables

Track quiz attempts and performance.

```sql
-- Quiz sessions
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Practice Quiz',
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Individual quiz questions and answers
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL, -- Array of answer options
  correct_option_index integer NOT NULL,
  user_selected_index integer,
  is_correct boolean NOT NULL DEFAULT false,
  explanation text,
  quicksolve_id uuid REFERENCES quicksolve_history(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_course_id ON quiz_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_session_id ON quiz_questions(session_id);

-- RLS Policies
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz sessions"
  ON quiz_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz sessions"
  ON quiz_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- (Similar policies for quiz_questions)
```

## How to Apply

Once database access is available, apply these migrations using:
```
mcp__supabase__apply_migration
```

Or manually via the Supabase dashboard SQL editor.
