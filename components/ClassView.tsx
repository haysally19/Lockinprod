
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Course, TabView, Assignment, Note, CourseDocument } from '../types';
import { MessageSquare, FileText, CheckSquare, GraduationCap, Files, Layout, BrainCircuit } from 'lucide-react';
import ChatInterface from './ChatInterface';
import EssayGrader from './EssayGrader';
import NotesModule from './NotesModule';
import AssignmentsModule from './AssignmentsModule';
import DocsModule from './DocsModule';
import ClassOverview from './ClassOverview';
import StudyCenter from './StudyCenter';

interface ClassViewProps {
  course: Course;
  checkTokenLimit: () => boolean;
  incrementTokenUsage: () => void;
  // DB Handlers
  onAddAssignment: (courseId: string, a: Omit<Assignment, 'id'>) => Promise<void>;
  onUpdateAssignment: (a: Assignment) => Promise<void>;
  onAddNote: (courseId: string, n: Omit<Note, 'id'>) => Promise<string>;
  onUpdateNote: (n: Note) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
  onAddDoc: (courseId: string, d: Omit<CourseDocument, 'id'>) => Promise<void>;
  onDeleteDoc: (id: string) => Promise<void>;
}

const ClassView: React.FC<ClassViewProps> = ({ 
  course, 
  checkTokenLimit, 
  incrementTokenUsage,
  onAddAssignment,
  onUpdateAssignment,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddDoc,
  onDeleteDoc
}) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabView>('overview');
  const [initialChatQuery, setInitialChatQuery] = useState<string>('');

  useEffect(() => {
    if (location.state?.openTab) {
      setActiveTab(location.state.openTab);
    }
  }, [location.state]);


  const tabs: { id: TabView; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'study', label: 'Study', icon: BrainCircuit },
    { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'grader', label: 'Grader', icon: GraduationCap },
    { id: 'assignments', label: 'Tasks', icon: CheckSquare },
    { id: 'docs', label: 'Library', icon: Files },
  ];

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
            {activeTab === 'overview' && (
            <ClassOverview 
                course={course} 
                onNavigate={setActiveTab} 
                onAskAI={handleAskAI}
            />
            )}

            {activeTab === 'study' && (
            <StudyCenter 
                course={course} 
                checkTokenLimit={checkTokenLimit}
                incrementTokenUsage={incrementTokenUsage}
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
            
            {activeTab === 'grader' && (
            <EssayGrader 
                course={course} 
                checkTokenLimit={checkTokenLimit}
                incrementTokenUsage={incrementTokenUsage}
            />
            )}
            
            {activeTab === 'assignments' && (
            <AssignmentsModule 
                assignments={course.assignments}
                onAddAssignment={(a) => onAddAssignment(course.id, a)}
                onUpdateAssignment={onUpdateAssignment}
                checkTokenLimit={checkTokenLimit}
                incrementTokenUsage={incrementTokenUsage}
                subject={course.subject}
            />
            )}

            {activeTab === 'docs' && (
            <DocsModule 
                documents={course.documents || []}
                onAddDoc={(d) => onAddDoc(course.id, d)}
                onDeleteDoc={onDeleteDoc}
            />
            )}
        </div>
      </div>
    </div>
  );
};

export default ClassView;
