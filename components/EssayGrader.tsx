import React, { useState } from 'react';
import { Course, EssayFeedback } from '../types';
import { gradeEssay } from '../services/geminiService';
import { CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { markOnboardingTaskComplete } from '../services/onboardingService';

interface EssayGraderProps {
  course: Course;
  checkTokenLimit: () => boolean;
  incrementTokenUsage: () => void;
}

const EssayGrader: React.FC<EssayGraderProps> = ({ course, checkTokenLimit, incrementTokenUsage }) => {
  const [essay, setEssay] = useState('');
  const [topic, setTopic] = useState('');
  const [feedback, setFeedback] = useState<EssayFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGrade = async () => {
    if (!essay.trim() || !topic.trim()) return;
    
    // Check token limit
    if (!checkTokenLimit()) return;

    setLoading(true);
    setError(null);
    setFeedback(null);
    incrementTokenUsage();
    
    try {
      const result = await gradeEssay(essay, topic);
      setFeedback(result);
      await markOnboardingTaskComplete('ai_prompt_completed');
    } catch (err) {
      setError("Failed to grade essay. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Input Section */}
      <div className={`flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-4 overflow-y-auto border-r border-slate-200 transition-all ${feedback ? 'md:w-1/2 h-1/2 md:h-full' : 'w-full h-full'}`}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Topic / Prompt</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Analyze the themes in Hamlet"
            className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
        
        <div className="flex-1 flex flex-col min-h-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">Your Essay</label>
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Paste your essay here..."
            className="flex-1 w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all font-serif text-slate-800 leading-relaxed shadow-sm text-sm md:text-base"
          />
        </div>

        <button
          onClick={handleGrade}
          disabled={loading || !essay || !topic}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Grading...
            </>
          ) : (
            <>
              Grade Essay
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>

      {/* Results Section */}
      {feedback && (
        <div className="flex-1 bg-white overflow-y-auto animate-in slide-in-from-right-10 duration-500 border-t md:border-t-0 md:border-l border-slate-200 h-1/2 md:h-full shadow-inner md:shadow-none">
          <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 md:pb-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Grading Report</h2>
              <div className={`flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${
                feedback.score >= 90 ? 'border-green-500 text-green-700 bg-green-50' :
                feedback.score >= 80 ? 'border-blue-500 text-blue-700 bg-blue-50' :
                feedback.score >= 70 ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                'border-red-500 text-red-700 bg-red-50'
              }`}>
                <span className="text-xl md:text-2xl font-bold">{feedback.score}</span>
                <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-wide">Score</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 md:mb-3">Summary</h3>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl text-sm md:text-base">{feedback.summary}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="flex items-center gap-2 text-xs md:text-sm font-bold text-green-600 uppercase tracking-wider mb-2 md:mb-3">
                  <CheckCircle2 className="w-4 h-4" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-xs md:text-sm font-bold text-orange-500 uppercase tracking-wider mb-2 md:mb-3">
                  <AlertTriangle className="w-4 h-4" /> Weaknesses
                </h3>
                <ul className="space-y-2">
                  {feedback.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 md:p-6 border border-blue-100">
              <h3 className="flex items-center gap-2 text-xs md:text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 md:mb-4">
                <Lightbulb className="w-4 h-4" /> Recommended Improvements
              </h3>
              <ul className="space-y-3">
                {feedback.improvements.map((imp, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 text-sm bg-white p-3 rounded-lg shadow-sm">
                    <span className="font-bold text-blue-500">{i + 1}.</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayGrader;