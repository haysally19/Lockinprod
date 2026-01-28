# Enabling the Flashcard Feature

The flashcard save feature has been implemented but is currently **disabled** until the required database tables are created.

## Current Status

**QuickSolve is working** - Students can capture and solve problems as normal.

**Flashcard save is disabled** - The "Save as Flashcard" button is commented out until database tables exist.

## Why It's Disabled

The feature requires database tables that don't exist yet:
1. `course_id` column in `quicksolve_history` table
2. `flashcard_decks` table
3. `flashcards` table

Trying to use these features without the tables would cause database errors.

## How to Enable

### Step 1: Apply Database Migrations

Run the SQL scripts documented in `DATABASE_MIGRATIONS_NEEDED.md`:

1. Add `course_id` column to `quicksolve_history`:
```sql
ALTER TABLE quicksolve_history
ADD COLUMN course_id uuid REFERENCES courses(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_quicksolve_history_course_id
ON quicksolve_history(course_id);
```

2. Create flashcard tables (see full SQL in `DATABASE_MIGRATIONS_NEEDED.md`)

### Step 2: Uncomment the Code

#### In `services/quicksolveHistoryService.ts` (lines 21-24):
```typescript
// BEFORE (commented out):
// TODO: Uncomment when course_id column is added to quicksolve_history table
// if (courseId) {
//   insertData.course_id = courseId;
// }

// AFTER (uncommented):
if (courseId) {
  insertData.course_id = courseId;
}
```

#### In `components/QuickSolve.tsx` (around line 487):
Remove the `/* TODO: ... */` comment block wrapper around the flashcard save UI to enable the feature.

### Step 3: Rebuild
```bash
npm run build
```

### Step 4: Test
1. Navigate to a class
2. Open Quick Solve tab
3. Capture and solve a problem
4. Verify "Save as Flashcard" button appears
5. Click to save and confirm it works
6. Check Study tab to see the flashcard

## What Will Work After Enabling

- Problems solved in classes are linked to that class
- "Save as Flashcard" button appears after solving
- Flashcards are saved to database with proper course association
- Flashcards can be reviewed in Study tab (when StudyCenter is updated)
- History can be filtered by class

## What Still Needs Work

After enabling the feature, you may want to:

1. **Update StudyCenter**: Load saved flashcard decks from database instead of only generating from notes
2. **Add Spaced Repetition**: Track review progress using `flashcard_reviews` table
3. **Quiz Integration**: Connect quiz sessions to course performance tracking
4. **UI Polish**: Add deck management (rename, delete, merge decks)
5. **Bulk Operations**: Convert multiple quick solves to one deck

## Quick Reference

Files modified for this feature:
- `services/quicksolveHistoryService.ts` - Course linking (commented out)
- `services/studyMaterialsService.ts` - Flashcard/quiz service layer
- `components/QuickSolve.tsx` - UI for flashcard save (commented out)
- `components/ClassView.tsx` - Passes course context to QuickSolve

Documentation files:
- `DATABASE_MIGRATIONS_NEEDED.md` - Complete SQL scripts
- `QUICK_SOLVE_CLASS_INTEGRATION.md` - Technical implementation details
- `ENABLE_FLASHCARD_FEATURE.md` - This file

## Troubleshooting

**Q: Quick Solve isn't working at all**
A: Make sure you rebuilt after the latest changes. The core Quick Solve functionality should work without the database changes.

**Q: I applied migrations but flashcard save fails**
A: Check browser console for errors. Verify all RLS policies were created correctly.

**Q: Flashcards saved but don't show in Study tab**
A: StudyCenter needs to be updated to load from database. Currently it only generates from notes.

**Q: History shows database errors**
A: Ensure the `courses` table exists. QuickSolve references it via foreign key.
