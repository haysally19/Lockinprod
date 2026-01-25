import React from 'react';
import { Course, TabView } from '../types';
import { ArrowRight, CheckSquare, Clock, FileText, GraduationCap, MessageSquare } from 'lucide-react';

interface ClassOverviewProps {
  course: Course;
  onNavigate: (tab: TabView) => void;
  onAskAI: (question: string) => void;
}

const ClassOverview: React.FC<ClassOverviewProps> = ({ course, onNavigate, onAskAI }) => {
  // Data processing
  const pendingAssignments = course.assignments.filter(a => !a.completed);
  const totalDocs = course.documents?.length || 0;

  const recentNote = course.notes.length > 0
    ? course.notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  const sampleQuestions = [
    `Explain the main theme of "${course.name}"`,
    `What are the key concepts from my recent notes?`,
    `Give me a practice problem for my upcoming assignment.`
  ];
  
  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><MessageSquare className="w-6 h-6" /></div>
                    <span className="px-2 py-1 rounded-full text-xs font-bold text-blue-600 bg-blue-50">
                        AI Ready
                    </span>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold text-slate-800">{totalDocs}</h3>
                    <p className="text-sm text-slate-400 font-medium">Study Materials</p>
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Clock className="w-6 h-6" /></div>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold text-slate-800">{pendingAssignments.length}</h3>
                    <p className="text-sm text-slate-400 font-medium">Pending Tasks</p>
                </div>
            </div>
             <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><FileText className="w-6 h-6" /></div>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold text-slate-800">{course.notes.length}</h3>
                    <p className="text-sm text-slate-400 font-medium">Saved Notes</p>
                </div>
            </div>
             <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckSquare className="w-6 h-6" /></div>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold text-slate-800">{course.assignments.filter(a=>a.completed).length}</h3>
                    <p className="text-sm text-slate-400 font-medium">Completed Tasks</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Tutor Prompt */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    AI Tutor Quick Start
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                    Need help with a concept or assignment? Ask Gemini, your AI tutor for {course.name}.
                </p>
                <div className="space-y-2">
                    {sampleQuestions.slice(0,2).map((q, i) => (
                        <button key={i} onClick={() => onAskAI(q)} className="w-full text-left flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-all group">
                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{q}</span>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button onClick={() => onNavigate('assignments')} className="bg-white p-4 rounded-xl border border-slate-200 text-center hover:shadow-md hover:border-blue-300 transition-all group">
                <CheckSquare className="w-8 h-8 mx-auto text-emerald-500 mb-2"/>
                <span className="font-bold text-sm text-slate-700 group-hover:text-blue-600">Assignments</span>
              </button>
              <button onClick={() => onNavigate('notes')} className="bg-white p-4 rounded-xl border border-slate-200 text-center hover:shadow-md hover:border-blue-300 transition-all group">
                <FileText className="w-8 h-8 mx-auto text-purple-500 mb-2"/>
                <span className="font-bold text-sm text-slate-700 group-hover:text-blue-600">Notes</span>
              </button>
              <button onClick={() => onNavigate('grader')} className="bg-white p-4 rounded-xl border border-slate-200 text-center hover:shadow-md hover:border-blue-300 transition-all group">
                <GraduationCap className="w-8 h-8 mx-auto text-rose-500 mb-2"/>
                <span className="font-bold text-sm text-slate-700 group-hover:text-blue-600">Essay Grader</span>
              </button>
            </div>

          </div>

          {/* Right Column - Upcoming & Recent */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Upcoming Deadlines
                </h3>
                {pendingAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {pendingAssignments.slice(0,3).map(a => (
                      <div key={a.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <p className="font-medium text-slate-800 text-sm truncate">{a.title}</p>
                        <p className="text-xs text-amber-600 font-semibold">{new Date(a.dueDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">No pending assignments!</p>
                )}
                 <button onClick={() => onNavigate('assignments')} className="w-full mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 py-2 rounded-lg hover:bg-blue-50 transition-all">
                    View All
                 </button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Recent Note
                </h3>
                {recentNote ? (
                  <div>
                    <h4 className="font-bold text-blue-700 text-sm mb-1 truncate">{recentNote.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-3">{recentNote.content}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">No notes created yet.</p>
                )}
                <button onClick={() => onNavigate('notes')} className="w-full mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 py-2 rounded-lg hover:bg-blue-50 transition-all">
                    Go to Notes
                </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClassOverview;
