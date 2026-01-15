import { supabase } from '../lib/supabase';

export const markOnboardingTaskComplete = async (taskField: 'add_class_completed' | 'ai_prompt_completed' | 'add_to_home_completed') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: currentStatus } = await supabase
      .from('onboarding_status')
      .select(taskField)
      .eq('user_id', user.id)
      .maybeSingle();

    if (currentStatus && currentStatus[taskField]) {
      return;
    }

    const { error } = await supabase
      .from('onboarding_status')
      .update({ [taskField]: true })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error marking onboarding task complete:', error);
    }
  } catch (error) {
    console.error('Error in markOnboardingTaskComplete:', error);
  }
};
