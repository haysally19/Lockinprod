import { supabase } from '../lib/supabase';
import { Flashcard, QuizQuestion } from '../types';

export interface FlashcardDeck {
  id: string;
  course_id: string;
  user_id: string;
  name: string;
  description: string;
  source: 'manual' | 'generated' | 'quicksolve';
  created_at: string;
  updated_at: string;
}

export interface SavedFlashcard extends Flashcard {
  deck_id: string;
  user_id: string;
  quicksolve_id?: string;
  created_at: string;
}

export interface QuizSession {
  id: string;
  course_id: string;
  user_id: string;
  name: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

export interface SavedQuizQuestion extends QuizQuestion {
  session_id: string;
  user_id: string;
  user_selected_index?: number;
  is_correct: boolean;
  quicksolve_id?: string;
}

export async function createFlashcardDeckFromQuickSolve(
  courseId: string,
  quickSolveId: string,
  problemText: string,
  solution: string
): Promise<FlashcardDeck> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: deck, error: deckError } = await supabase
    .from('flashcard_decks')
    .insert({
      course_id: courseId,
      user_id: user.id,
      name: `Quick Solve - ${new Date().toLocaleDateString()}`,
      description: 'Generated from quick solve problem',
      source: 'quicksolve'
    })
    .select()
    .single();

  if (deckError) throw deckError;

  const { error: cardError } = await supabase
    .from('flashcards')
    .insert({
      deck_id: deck.id,
      user_id: user.id,
      front: problemText,
      back: solution,
      quicksolve_id: quickSolveId
    });

  if (cardError) throw cardError;

  return deck;
}

export async function saveFlashcardDeck(
  courseId: string,
  name: string,
  flashcards: Flashcard[],
  source: 'manual' | 'generated' = 'generated'
): Promise<FlashcardDeck> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: deck, error: deckError } = await supabase
    .from('flashcard_decks')
    .insert({
      course_id: courseId,
      user_id: user.id,
      name,
      description: `${flashcards.length} flashcards`,
      source
    })
    .select()
    .single();

  if (deckError) throw deckError;

  const cardsToInsert = flashcards.map(card => ({
    deck_id: deck.id,
    user_id: user.id,
    front: card.front,
    back: card.back
  }));

  const { error: cardsError } = await supabase
    .from('flashcards')
    .insert(cardsToInsert);

  if (cardsError) throw cardsError;

  return deck;
}

export async function getFlashcardDecksByCourse(courseId: string): Promise<FlashcardDeck[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('flashcard_decks')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getFlashcardsByDeck(deckId: string): Promise<SavedFlashcard[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function deleteFlashcardDeck(deckId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('flashcard_decks')
    .delete()
    .eq('id', deckId)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function saveQuizSession(
  courseId: string,
  name: string,
  questions: QuizQuestion[],
  userAnswers: (number | undefined)[],
  score: number
): Promise<QuizSession> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: session, error: sessionError } = await supabase
    .from('quiz_sessions')
    .insert({
      course_id: courseId,
      user_id: user.id,
      name,
      score,
      total_questions: questions.length
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  const questionsToInsert = questions.map((q, index) => ({
    session_id: session.id,
    user_id: user.id,
    question_text: q.question,
    options: q.options,
    correct_option_index: q.correctAnswerIndex,
    user_selected_index: userAnswers[index],
    is_correct: userAnswers[index] === q.correctAnswerIndex,
    explanation: q.explanation
  }));

  const { error: questionsError } = await supabase
    .from('quiz_questions')
    .insert(questionsToInsert);

  if (questionsError) throw questionsError;

  return session;
}

export async function getQuizSessionsByCourse(courseId: string): Promise<QuizSession[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getQuizQuestionsBySession(sessionId: string): Promise<SavedQuizQuestion[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', user.id);

  if (error) throw error;
  return data || [];
}
