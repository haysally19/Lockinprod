/*
  # Drop Assignments Table

  This migration removes the assignments table and all related data as the application
  is being refocused on studying rather than task/assignment tracking.

  ## Changes
    - Drop the `assignments` table completely
    - All assignment data will be removed

  ## Important Notes
    - This is a destructive operation
    - Assignment data cannot be recovered after this migration
    - The application no longer tracks assignments or tasks
*/

DROP TABLE IF EXISTS assignments CASCADE;