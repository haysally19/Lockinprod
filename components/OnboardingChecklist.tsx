import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, BookOpen, Sparkles, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OnboardingStatus {
  add_class_completed: boolean;
  ai_prompt_completed: boolean;
  add_to_home_completed: boolean;
  is_completed: boolean;
}

interface OnboardingChecklistProps {
  onTaskComplete?: (task: string) => void;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ onTaskComplete }) => {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOnboardingStatus();
  }, []);

  const loadOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('onboarding_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading onboarding status:', error);
        return;
      }

      if (!data) {
        const { data: newStatus, error: insertError } = await supabase
          .from('onboarding_status')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating onboarding status:', insertError);
          return;
        }
        setStatus(newStatus);
      } else {
        setStatus(data);
        if (data.is_completed) {
          setIsVisible(false);
        }
      }
    } catch (error) {
      console.error('Error in loadOnboardingStatus:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskField: keyof OnboardingStatus) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !status) return;

      const updates = {
        [taskField]: true,
      };

      const { data, error } = await supabase
        .from('onboarding_status')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task status:', error);
        return;
      }

      setStatus(data);

      if (data.is_completed) {
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }

      if (onTaskComplete) {
        onTaskComplete(taskField);
      }
    } catch (error) {
      console.error('Error in updateTaskStatus:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (loading || !isVisible || !status || status.is_completed) {
    return null;
  }

  const tasks = [
    {
      id: 'add_class_completed',
      title: 'Add your first class',
      description: 'Create a class to start organizing your coursework',
      icon: <BookOpen className="w-5 h-5" />,
      completed: status.add_class_completed,
      action: () => {
        const addButton = document.querySelector('[data-add-course-btn]') as HTMLButtonElement;
        if (addButton) addButton.click();
      }
    },
    {
      id: 'ai_prompt_completed',
      title: 'Try the AI tutor',
      description: 'Go to any class and use the AI tutor in the Study tab',
      icon: <Sparkles className="w-5 h-5" />,
      completed: status.ai_prompt_completed,
      action: () => {
        const firstClassLink = document.querySelector('[data-class-link]') as HTMLAnchorElement;
        if (firstClassLink) {
          firstClassLink.click();
        }
      }
    },
    {
      id: 'add_to_home_completed',
      title: 'Add app to home screen',
      description: 'Quick access from your device for faster studying',
      icon: <Smartphone className="w-5 h-5" />,
      completed: status.add_to_home_completed,
      action: () => {
        if ('BeforeInstallPromptEvent' in window) {
          alert('To add this app to your home screen:\n\n1. Tap the Share button\n2. Select "Add to Home Screen"\n3. Tap "Add"');
        } else {
          alert('To add this app to your home screen:\n\niOS: Tap Share > Add to Home Screen\n\nAndroid: Tap Menu > Add to Home Screen');
        }
        updateTaskStatus('add_to_home_completed');
      }
    }
  ];

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-lg overflow-hidden mb-6 animate-in fade-in slide-in-from-top-4">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Get Started with Lockin AI</h3>
                <p className="text-sm text-slate-600">{completedCount} of {tasks.length} completed</p>
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={task.completed ? undefined : task.action}
                disabled={task.completed}
                className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all ${
                  task.completed
                    ? 'bg-green-50 border border-green-200 cursor-default'
                    : 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  task.completed
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  {task.icon}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${
                      task.completed ? 'text-green-900 line-through' : 'text-slate-900'
                    }`}>
                      {task.title}
                    </h4>
                  </div>
                  <p className={`text-sm ${
                    task.completed ? 'text-green-600' : 'text-slate-600'
                  }`}>
                    {task.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {completedCount === tasks.length && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">All set!</p>
                <p className="text-sm text-green-700">You're ready to crush your academic goals!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingChecklist;
