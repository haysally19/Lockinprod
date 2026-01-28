import React, { useState, useEffect } from 'react';
import { Course, EssayFeedback } from '../types';
import { gradeEssay } from '../services/geminiService';
import { CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Loader2, History, Trash2, X, FileText, Calendar, Award } from 'lucide-react';
import { markOnboardingTaskComplete } from '../services/onboardingService';
import { essayService, EssaySubmission } from '../services/essayService';

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
  const [showHistory, setShowHistory] = useState(false);
  const [submissions, setSubmissions] = useState<EssaySubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<EssaySubmission | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, [course.id]);

  const loadSubmissions = () => {
    const allSubmissions = essayService.getSubmissionsByCourse(course.id);
    setSubmissions(allSubmissions);
  };

  const handleGrade = async () => {
    if (!essay.trim() || !topic.trim()) return;

    if (!checkTokenLimit()) return;

    setLoading(true);
    setError(null);
    setFeedback(null);
    incrementTokenUsage();

    try {
      const result = await gradeEssay(essay, topic);
      setFeedback(result);

      essayService.saveSubmission({
        courseId: course.id,
        courseName: course.name,
        topic,
        essayContent: essay,
        feedback: result,
      });

      loadSubmissions();
      await markOnboardingTaskComplete('ai_prompt_completed');
    } catch (err) {
      setError("Failed to grade essay. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission: EssaySubmission) => {
    setSelectedSubmission(submission);
    setTopic(submission.topic);
    setEssay(submission.essayContent);
    setFeedback(submission.feedback);
    setShowHistory(false);
  };

  const handleDeleteSubmission = (id: string) => {
    if (confirm('Delete this submission?')) {
      essayService.deleteSubmission(id);
      loadSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
        setFeedback(null);
      }
    }
  };

  const handleNewEssay = () => {
    setEssay('');
    setTopic('');
    setFeedback(null);
    setSelectedSubmission(null);
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden">
      {/* History Sidebar */}
      {showHistory && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowHistory(false)}
          />
          <div className="fixed md:relative top-0 left-0 bottom-0 w-80 bg-white border-r border-slate-200 shadow-xl md:shadow-none z-50 overflow-y-auto animate-in slide-in-from-left duration-300 md:animate-none">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 z-10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-slate-900">Past Essays</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="p-3 space-y-2">
              {submissions.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm text-slate-500">No submissions yet</p>
                </div>
              ) : (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="group relative bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleViewSubmission(submission)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 flex-1">
                        {submission.topic}
                      </h3>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                        submission.feedback.score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                        submission.feedback.score >= 80 ? 'bg-blue-100 text-blue-700' :
                        submission.feedback.score >= 70 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {submission.feedback.score}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(submission.submittedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubmission(submission.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Input Section */}
        <div className={`flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col transition-all ${feedback ? 'h-1/2 md:h-full md:w-2/5' : 'h-full w-full'}`}>
          <div className="p-4 md:p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Essay Grader</h2>
                <p className="text-sm text-slate-600 mt-0.5">Submit your essay for AI feedback</p>
              </div>
              <div className="flex gap-2">
                {submissions.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    title="View history"
                  >
                    <History className="w-5 h-5" />
                  </button>
                )}
                {(feedback || selectedSubmission) && (
                  <button
                    onClick={handleNewEssay}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm text-sm font-semibold"
                  >
                    New Essay
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Topic / Prompt</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The impact of social media on modern society"
                disabled={loading || !!selectedSubmission}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>

            <div className="flex-1 flex flex-col min-h-[200px]">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Essay</label>
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Paste or type your essay here..."
                disabled={loading || !!selectedSubmission}
                className="flex-1 w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all font-serif text-slate-800 leading-relaxed shadow-sm text-sm md:text-base disabled:bg-slate-50 disabled:text-slate-600"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>{essay.split(/\s+/).filter(w => w.length > 0).length} words</span>
                <span>{essay.length} characters</span>
              </div>
            </div>

            {!selectedSubmission && (
              <button
                onClick={handleGrade}
                disabled={loading || !essay || !topic}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Essay...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    Grade My Essay
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {feedback && (
          <div className="flex-1 bg-white overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto pb-24 md:pb-8">
              {/* Header with Score */}
              <div className="flex items-center justify-between pb-6 border-b-2 border-slate-100">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Grading Report</h2>
                  <p className="text-sm text-slate-600">AI-powered feedback and analysis</p>
                </div>
                <div className={`flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg ${
                  feedback.score >= 90 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' :
                  feedback.score >= 80 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
                  feedback.score >= 70 ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' :
                  'bg-gradient-to-br from-red-500 to-red-600 text-white'
                }`}>
                  <span className="text-3xl md:text-4xl font-black">{feedback.score}</span>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide opacity-90">Grade</span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Overall Summary
                </h3>
                <p className="text-slate-700 leading-relaxed text-base">{feedback.summary}</p>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200 shadow-sm">
                  <h3 className="flex items-center gap-2 text-base font-bold text-emerald-700 uppercase tracking-wider mb-4">
                    <CheckCircle2 className="w-5 h-5" /> Strengths
                  </h3>
                  <ul className="space-y-3">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="flex-1">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200 shadow-sm">
                  <h3 className="flex items-center gap-2 text-base font-bold text-orange-700 uppercase tracking-wider mb-4">
                    <AlertTriangle className="w-5 h-5" /> Areas to Improve
                  </h3>
                  <ul className="space-y-3">
                    {feedback.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="flex-1">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Improvements */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
                <h3 className="flex items-center gap-2 text-base font-bold text-blue-800 uppercase tracking-wider mb-4">
                  <Lightbulb className="w-5 h-5" /> Recommended Improvements
                </h3>
                <ul className="space-y-3">
                  {feedback.improvements.map((imp, i) => (
                    <li key={i} className="flex gap-3 text-slate-800 text-sm bg-white p-4 rounded-xl shadow-md border border-blue-200">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </span>
                      <span className="flex-1 leading-relaxed">{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedSubmission && (
                <div className="pt-6 border-t border-slate-200 flex justify-center">
                  <button
                    onClick={handleNewEssay}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all active:scale-[0.98] flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Submit New Essay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayGrader;
