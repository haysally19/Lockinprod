
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Course, TabView, Note } from '../types';
import { MessageSquare, FileText, GraduationCap, BrainCircuit, Zap } from 'lucide-react';
import ChatInterface from './ChatInterface';
import EssayGrader from './EssayGrader';
import NotesModule from './NotesModule';
import StudyCenter from './StudyCenter';
import QuickSolve from './QuickSolve';

interface ClassViewProps {
  course: Course;
  checkTokenLimit: () => boolean;
  incrementTokenUsage: () => void;
  onAddNote: (courseId: string, n: Omit<Note, 'id'>) => Promise<string>;
  onUpdateNote: (n: Note) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}

const ClassView: React.FC<ClassViewProps> = ({
  course,
  checkTokenLimit,
  incrementTokenUsage,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}) => {
  const location = useLocation();
  const isMobile = window.innerWidth < 768;
  const defaultTab = isMobile ? 'quicksolve' : 'chat';
  const [activeTab, setActiveTab] = useState<TabView>(defaultTab);
  const [initialChatQuery, setInitialChatQuery] = useState<string>('');

  useEffect(() => {
    if (location.state?.openTab) {
      setActiveTab(location.state.openTab);
    }
  }, [location.state]);

  const mobileFirstTabs: { id: TabView; label: string; icon: any }[] = [
    { id: 'quicksolve', label: 'Quick Solve', icon: Zap },
    { id: 'study', label: 'Study', icon: BrainCircuit },
    { id: 'grader', label: 'Grader', icon: GraduationCap },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  const desktopFirstTabs: { id: TabView; label: string; icon: any }[] = [
    { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
    { id: 'quicksolve', label: 'Quick Solve', icon: Zap },
    { id: 'study', label: 'Study', icon: BrainCircuit },
    { id: 'grader', label: 'Grader', icon: GraduationCap },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  const tabs = isMobile ? mobileFirstTabs : desktopFirstTabs;

  const handleAskAI = (question: string) => {
    setInitialChatQuery(question);
    setActiveTab('chat');
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfdfe] overflow-hidden">
      {/* Dynamic Native-style Header - Compact Version */}
      <header className="bg-white border-b border-slate-200 z-[30] flex-shrink-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div className="max-w-screen-2xl mx-auto w-full px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-lg ${course.color} flex items-center justify-center text-white/95 font-bold shadow-sm flex-shrink-0 text-sm`}>
              {course.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="text-lg font-bold text-slate-900 leading-tight truncate tracking-tight">{course.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide truncate">{course.subject}</span>
              </div>
            </div>
          </div>

          {/* Premium Segmented Control Tabs - Compact */}
          <div className="flex-1 overflow-x-auto no-scrollbar flex justify-end">
             <div className="flex items-center gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabView)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 active:scale-95 ${
                            isActive
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} strokeWidth={2} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content View with Animation Container */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full animate-in fade-in duration-300">
            {activeTab === 'quicksolve' && (
            <QuickSolve
                checkTokenLimit={checkTokenLimit}
                incrementTokenUsage={incrementTokenUsage}
                onNavigateToDashboard={() => {}}
            />
            )}

            {activeTab === 'chat' && (
            <ChatInterface
                course={course}
                initialMessage={initialChatQuery}
                onClearInitialMessage={() => setInitialChatQuery('')}
                checkTokenLimit={checkTokenLimit}
                incrementTokenUsage={incrementTokenUsage}
            />
            )}

            {activeTab === 'study' && (
            <StudyCenter
                course={course}
                checkTokenLimit={checkTokenLimit}
                incrementTokenUsage={incrementTokenUsage}
            />
            )}

            {activeTab === 'grader' && (
            <EssayGrader
                course={course}
                checkTokenLimit={checkTokenLimit}
                incrementTokenUsage={incrementTokenUsage}
            />
            )}

            {activeTab === 'notes' && (
            <NotesModule
                notes={course.notes}
                onAddNote={(n) => onAddNote(course.id, n)}
                onUpdateNote={onUpdateNote}
                onDeleteNote={onDeleteNote}
                checkTokenLimit={checkTokenLimit}
                incrementTokenUsage={incrementTokenUsage}
            />
            )}
        </div>
      </div>
    </div>
  );
};

export default ClassView;
