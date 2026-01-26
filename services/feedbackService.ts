import { supabase } from '../lib/supabase';

export interface CameraFeedback {
  id: string;
  user_id: string;
  image_data?: string;
  solution_text?: string;
  feedback_type: 'wrong_answer' | 'unclear' | 'bug' | 'suggestion' | 'other';
  feedback_text: string;
  status: 'new' | 'reviewed' | 'resolved';
  created_at: string;
}

export const submitCameraFeedback = async (
  imageData: string | null,
  solutionText: string | null,
  feedbackType: CameraFeedback['feedback_type'],
  feedbackText: string
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to submit feedback');
  }

  const { error } = await supabase
    .from('camera_feedback')
    .insert({
      user_id: user.id,
      image_data: imageData,
      solution_text: solutionText,
      feedback_type: feedbackType,
      feedback_text: feedbackText,
      status: 'new'
    });

  if (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback. Please try again.');
  }
};

export const getUserFeedback = async (limit: number = 20): Promise<CameraFeedback[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('camera_feedback')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }

  return data || [];
};
