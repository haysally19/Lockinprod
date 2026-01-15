import React, { useState } from 'react';
import { Course, Flashcard, QuizQuestion } from '../types';
import { generateFlashcards, generateQuiz } from '../services/geminiService';
import { Sparkles, BrainCircuit, Layers, Check, ChevronLeft, ArrowRight, RotateCcw, CheckCircle, XCircle, Trophy, FileText, AlertCircle } from 'lucide-react';
import { markOnboardingTaskComplete } from '../services/onboardingService';

interface StudyCenterProps {
  course: Course;
  checkTokenLimit: () => boolean;
  incrementTokenUsage: () => void;
}

type StudyMode = 'menu' | 'select' | 'flashcards' | 'quiz';

const StudyCenter: React.FC<StudyCenterProps> = ({ course, checkTokenLimit, incrementTokenUsage }) => {
  const [mode, setMode] = useState<StudyMode>('menu');
  const [targetType, setTargetType] = useState<'flashcards' | 'quiz'>('flashcards');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set(course.notes.map(n => n.id)));
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const getContext = () => {
    const selectedNotes = course.notes.filter(n => selectedNoteIds.has(n.id));
    if (selectedNotes.length === 0) return `Subject: ${course.subject}. Course Name: ${course.name}.`;
    return selectedNotes.map(n => `Topic: ${n.title}\nContent: ${n.content}`).join("\n\n---\n\n");
  };

  const handleToggleNote = (id: string) => {
    const newSelection = new Set(selectedNoteIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedNoteIds(newSelection);
  };

  const handleSelectAll = () => {
    setSelectedNoteIds(selectedNoteIds.size === course.notes.length ? new Set() : new Set(course.notes.map(n => n.id)));
  };

  const startFlashcards = async () => {
    if (!checkTokenLimit()) return;
    setLoading(true);
    incrementTokenUsage();
    try {
      const cards = await generateFlashcards(getContext(), 10);
      setFlashcards(cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setMode('flashcards');
      await markOnboardingTaskComplete('ai_prompt_completed');
    } catch (e) { alert("Failed to generate."); } finally { setLoading(false); }
  };

  const startQuiz = async () => {
    if (!checkTokenLimit()) return;
    setLoading(true);
    incrementTokenUsage();
    try {
      const questions = await generateQuiz(getContext(), 5);
      setQuizQuestions(questions);
      setCurrentQuizIndex(0);
      setSelectedAnswer(null);
      setQuizCompleted(false);
      setScore(0);
      setShowExplanation(false);
      setMode('quiz');
      await markOnboardingTaskComplete('ai_prompt_completed');
    } catch (e) { alert("Failed to generate."); } finally { setLoading(false); }
  };

  const handleQuizAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuizIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Generating Study Material...</h3>
        <p className="text-slate-500 mt-1 text-sm">Analyzing your notes with Gemini 3.0</p>
      </div>
    );
  }

  if (mode === 'menu') {
    return (
      <div className="h-full bg-slate-50 p-4 md:p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
             <div>
                <h2 className="text-xl font-bold text-slate-900">Study Engine</h2>
                <p className="text-sm text-slate-500">Active recall generated from your notes.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => { setTargetType('flashcards'); setMode('select'); }}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group text-left relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Layers className="w-5 h-5" />
                 </div>
                 <div className="bg-slate-50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-400">Recall</div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Flashcards</h3>
              <p className="text-slate-500 text-sm mb-4">Master terminology and key concepts.</p>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                 Start Session <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button 
              onClick={() => { setTargetType('quiz'); setMode('select'); }}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group text-left relative overflow-hidden"
            >
               <div className="flex items-start justify-between mb-4">
                 <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <BrainCircuit className="w-5 h-5" />
                 </div>
                 <div className="bg-slate-50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-400">Exam Mode</div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Practice Quiz</h3>
              <p className="text-slate-500 text-sm mb-4">Test your knowledge with AI-generated questions.</p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                 Begin Quiz <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
          
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex gap-3">
             <div className="p-2 bg-blue-100 rounded-lg h-fit text-blue-600">
                <Sparkles className="w-4 h-4" />
             </div>
             <div>
                <h4 className="text-sm font-bold text-blue-900">Powered by Gemini 3.0 Pro</h4>
                <p className="text-xs text-blue-700/80 mt-1">
                    The Study Engine reads all your selected notes to create custom study materials instantly. The more detailed your notes, the better the results.
                </p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'select') {
    return (
        <div className="h-full bg-slate-50 flex flex-col">
            <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 shrink-0">
                <button onClick={() => setMode('menu')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Sources</span>
                <button onClick={handleSelectAll} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    {selectedNoteIds.size === course.notes.length ? 'Clear' : 'All'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-2">
                    {course.notes.length === 0 ? (
                       <div className="p-8 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                           <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2"/>
                           <p className="text-sm text-slate-400 font-medium">No notes available.</p>
                           <p className="text-xs text-slate-400">Create notes in the Notes tab first.</p>
                       </div>
                    ) : (
                      course.notes.map(note => (
                        <button 
                            key={note.id}
                            onClick={() => handleToggleNote(note.id)}
                            className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 text-left ${
                                selectedNoteIds.has(note.id) 
                                ? 'bg-blue-50 border-blue-500 shadow-sm' 
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                selectedNoteIds.has(note.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
                            }`}>
                                {selectedNoteIds.has(note.id) && <Check className="w-3 h-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-semibold truncate ${selectedNoteIds.has(note.id) ? 'text-blue-900' : 'text-slate-700'}`}>{note.title}</h4>
                                <span className="text-[10px] text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                            </div>
                        </button>
                    )))}
                </div>
            </div>
            
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-slate-500">
                        {selectedNoteIds.size} notes selected
                    </span>
                    <button 
                        disabled={selectedNoteIds.size === 0}
                        onClick={targetType === 'flashcards' ? startFlashcards : startQuiz}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center gap-2 transition-all text-sm shadow-md"
                    >
                        {targetType === 'flashcards' ? 'Generate Deck' : 'Generate Quiz'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
  }

  if (mode === 'flashcards' && flashcards.length > 0) {
      const card = flashcards[currentCardIndex];
      return (
        <div className="h-full flex flex-col bg-slate-50">
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-10 shrink-0">
              <button onClick={() => setMode('menu')} className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1.5 text-sm">
                  <RotateCcw className="w-4 h-4"/> Exit
              </button>
              <span className="font-bold text-slate-700 text-sm">{currentCardIndex + 1} / {flashcards.length}</span>
              <div className="w-12" />
          </div>
  
          <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
              <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="relative w-full max-w-lg aspect-[3/2] cursor-pointer group perspective-1000"
              >
                  <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`} 
                       style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                      
                      {/* Front */}
                      <div className="absolute inset-0 bg-white rounded-2xl flex flex-col items-center justify-center p-8 text-center border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Term / Question</span>
                          <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">{card.front}</h3>
                          <p className="absolute bottom-6 text-slate-400 text-xs font-medium opacity-60">Click to flip</p>
                      </div>
  
                      {/* Back */}
                      <div className="absolute inset-0 bg-indigo-600 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-md backface-hidden rotate-y-180" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                           <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4">Definition / Answer</span>
                          <h3 className="text-lg md:text-xl font-medium text-white leading-relaxed">{card.back}</h3>
                      </div>
                  </div>
              </div>
  
              <div className="flex items-center gap-4 mt-8">
                  <button 
                      onClick={() => { setCurrentCardIndex(Math.max(0, currentCardIndex - 1)); setIsFlipped(false); }}
                      disabled={currentCardIndex === 0}
                      className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                  >
                      <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                      onClick={() => { setCurrentCardIndex(Math.min(flashcards.length - 1, currentCardIndex + 1)); setIsFlipped(false); }}
                      disabled={currentCardIndex === flashcards.length - 1}
                      className="p-3 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
                  >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                  </button>
              </div>
          </div>
        </div>
      );
    }
  
    if (mode === 'quiz' && quizQuestions.length > 0) {
      if (quizCompleted) {
          return (
              <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 overflow-y-auto">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-sm w-full text-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-4">
                          <Trophy className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">Nice Job!</h2>
                      <p className="text-slate-500 text-sm mb-6">You completed the quiz.</p>
                      
                      <div className="flex items-baseline justify-center gap-1 mb-8">
                          <span className="text-4xl font-extrabold text-blue-600">{Math.round((score / quizQuestions.length) * 100)}</span>
                          <span className="text-xl font-bold text-slate-400">%</span>
                      </div>
                      
                      <div className="space-y-3">
                           <button onClick={startQuiz} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm">
                              Try Another Quiz
                           </button>
                           <button onClick={() => setMode('menu')} className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                              Back to Menu
                           </button>
                      </div>
                  </div>
              </div>
          )
      }
  
      const question = quizQuestions[currentQuizIndex];
      return (
          <div className="h-full flex flex-col bg-slate-50">
               <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-10 shrink-0">
                  <button onClick={() => setMode('menu')} className="text-slate-500 hover:text-slate-800 font-medium text-sm">Exit</button>
                  <div className="flex gap-1.5">
                      {quizQuestions.map((_, i) => (
                          <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i === currentQuizIndex ? 'bg-blue-600' : i < currentQuizIndex ? 'bg-blue-200' : 'bg-slate-200'}`} />
                      ))}
                  </div>
                  <span className="font-bold text-slate-800 text-xs">Q{currentQuizIndex + 1}/{quizQuestions.length}</span>
              </div>
  
              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                  <div className="max-w-2xl mx-auto">
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 leading-relaxed">
                          {question.question}
                      </h3>
  
                      <div className="space-y-3">
                          {question.options.map((option, idx) => {
                              let stateClass = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/20';
                              if (selectedAnswer !== null) {
                                  if (idx === question.correctAnswerIndex) stateClass = 'bg-green-50 border-green-500 ring-1 ring-green-500';
                                  else if (idx === selectedAnswer) stateClass = 'bg-red-50 border-red-500 ring-1 ring-red-500';
                                  else stateClass = 'bg-slate-50 border-slate-200 opacity-60';
                              }
  
                              return (
                                  <button
                                      key={idx}
                                      onClick={() => handleQuizAnswer(idx)}
                                      disabled={selectedAnswer !== null}
                                      className={`w-full p-4 rounded-xl border-2 text-left text-sm md:text-base font-medium transition-all flex justify-between items-center ${stateClass}`}
                                  >
                                      <span className="flex-1">{option}</span>
                                      {selectedAnswer !== null && idx === question.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />}
                                      {selectedAnswer !== null && idx === selectedAnswer && idx !== question.correctAnswerIndex && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />}
                                  </button>
                              );
                          })}
                      </div>
  
                      {showExplanation && (
                          <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                              <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2 text-sm">
                                  <Sparkles className="w-4 h-4"/> Explanation
                              </h4>
                              <p className="text-blue-900 leading-relaxed text-sm">{question.explanation}</p>
                              <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={nextQuestion}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm"
                                >
                                    {currentQuizIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}
                                </button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
    }

  return null;
};

export default StudyCenter;