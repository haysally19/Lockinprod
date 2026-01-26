import { supabase } from '../lib/supabase';

export interface QuickSolveHistoryItem {
  id: string;
  user_id: string;
  image_data: string;
  solution: string;
  explanation_mode: 'nerd' | 'bro';
  created_at: string;
}

export const saveQuickSolveHistory = async (
  imageData: string,
  solution: string,
  explanationMode: 'nerd' | 'bro'
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.warn('User not authenticated, skipping history save');
    return;
  }

  const { error } = await supabase
    .from('quicksolve_history')
    .insert({
      user_id: user.id,
      image_data: imageData,
      solution: solution,
      explanation_mode: explanationMode
    });

  if (error) {
    console.error('Error saving quicksolve history:', error);
    throw new Error('Failed to save history');
  }
};

export const getQuickSolveHistory = async (limit: number = 20): Promise<QuickSolveHistoryItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('quicksolve_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching quicksolve history:', error);
    return [];
  }

  return data || [];
};

export const deleteQuickSolveHistoryItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('quicksolve_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting quicksolve history item:', error);
    throw new Error('Failed to delete history item');
  }
};
