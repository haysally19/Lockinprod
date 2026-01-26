import { supabase } from '../lib/supabase';

export interface CameraHistoryItem {
  id: string;
  user_id: string;
  image_data: string;
  solution: string;
  created_at: string;
}

export async function saveCameraHistory(imageData: string, solution: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('camera_history')
    .insert({
      user_id: user.id,
      image_data: imageData,
      solution: solution
    });

  if (error) {
    console.error('Error saving camera history:', error);
    throw error;
  }
}

export async function getCameraHistory(limit: number = 20): Promise<CameraHistoryItem[]> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('camera_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching camera history:', error);
    return [];
  }

  return data || [];
}

export async function deleteCameraHistoryItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('camera_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting camera history:', error);
    throw error;
  }
}
