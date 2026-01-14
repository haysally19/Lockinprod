
import React, { useState } from 'react';
import { Assignment } from '../types';
import { Plus, Calendar, CheckCircle2, Circle, Lightbulb, X, Loader2, GraduationCap } from 'lucide-react';
import { getAssignmentTips } from '../services/geminiService';

interface AssignmentsModuleProps {
  assignments: Assignment[];
  onAddAssignment: (a: Omit<Assignment, 'id'>) => Promise<void>;
  onUpdateAssignment: (a: Assignment) => Promise<void>;
  checkTokenLimit: () => boolean;
  incrementTokenUsage: () => void;
  subject: string;
}

const AssignmentsModule: React.FC<AssignmentsModuleProps> = ({ 
  assignments, 
  onAddAssignment, 
  onUpdateAssignment, 
  checkTokenLimit, 
  incrementTokenUsage, 
  subject 
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [selectedTipAssignment, setSelectedTipAssignment] = useState<string | null>(null);
  const [tips, setTips] = useState<string>('');
  const [loadingTips, setLoadingTips] = useState(false);

  const handleAdd = async () => {
    if (!newTitle || !newDate) return;
    setIsAdding(true);

    let initialGrade: number | undefined = undefined;
    let initialCompleted = false;

    if (newGrade.trim() !== '') {
      const parsed = parseFloat(newGrade);
      if (!isNaN(parsed)) {
        initialGrade = Math.min(100, Math.max(0, parsed));
        initialCompleted = true; // Auto-complete if grade is entered
      }
    }

    try {
        await onAddAssignment({
            title: newTitle,
            dueDate: newDate,
            completed: initialCompleted,
            grade: initialGrade
        });
        setNewTitle('');
        setNewDate('');
        setNewGrade('');
    } catch (error) {
        console.error("Failed to add assignment", error);
    } finally {
        setIsAdding(false);
    }
  };

  const toggleComplete = async (assignment: Assignment) => {
    await onUpdateAssignment({ ...assignment, completed: !assignment.completed });
  };

  const handleGradeChange = async (assignment: Assignment, value: string) => {
    let newGrade: number | undefined = undefined;
    if (value !== '') {
        newGrade = Math.min(100, Math.max(0, Number(value)));
    }
    await onUpdateAssignment({ ...assignment, grade: newGrade });
  };

  const handleGetTips = async (assignment: Assignment) => {
    if (!checkTokenLimit()) return;
    setSelectedTipAssignment(assignment.id);
    setLoadingTips(true);
    setTips('');
    incrementTokenUsage();
    try {
      const tipText = await getAssignmentTips(assignment.title, assignment.dueDate, subject);
      setTips(tipText);
    } catch (e) {
      setTips("Could not generate tips at this time. Please check your connection.");
    } finally {
      setLoadingTips(false);
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="h-full bg-slate-50 overflow-y-auto relative pb-24 md:pb-6">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
             <div>
                <h2 className="text-base font-bold">Assignments</h2>
                <p className="text-slate-400 text-xs">Track deadlines for {subject}.</p>
             </div>
             <span className="text-xs bg-slate-700 px-2 py-1 rounded-md text-slate-300 font-medium">
                {assignments.filter(a => !a.completed).length} Pending
             </span>
          </div>
          
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-2 items-start md:items-center">
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Assignment title..." 
              className="flex-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 text-sm"
            />
            <div className="flex w-full md:w-auto gap-2">
              <input 
                type="date" 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-1/2 md:w-auto px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 text-slate-600 text-sm"
              />
              <input 
                type="number" 
                min="0"
                max="100"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                placeholder="Grade" 
                className="w-1/2 md:w-20 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <button 
              onClick={handleAdd}
              disabled={!newTitle || !newDate || isAdding}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Plus className="w-3.5 h-3.5" />} 
              Add
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {sortedAssignments.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-xs font-medium">No assignments. You're free!</p>
              </div>
            ) : (
              sortedAssignments.map(assignment => (
                <div 
                  key={assignment.id} 
                  className={`p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3 group transition-colors ${assignment.completed ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button 
                      onClick={() => toggleComplete(assignment)}
                      className={`flex-shrink-0 transition-all duration-300 transform p-1 md:p-0 ${assignment.completed ? 'text-emerald-500 scale-105' : 'text-slate-300 hover:text-blue-500 hover:scale-105'}`}
                      aria-label={assignment.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {assignment.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-sm transition-all duration-300 truncate ${assignment.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'}`}>
                        {assignment.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 md:hidden">
                        <div className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md transition-colors ${
                          assignment.completed 
                            ? 'text-slate-400 bg-slate-100' 
                            : 'text-orange-600 bg-orange-50'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end w-full md:w-auto pl-8 md:pl-0">
                    {/* Grade Input - Only visible when completed */}
                    {assignment.completed && (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                        <div className="bg-white border border-slate-200 rounded-lg flex items-center px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Score"
                            value={assignment.grade ?? ''}
                            onChange={(e) => handleGradeChange(assignment, e.target.value)}
                            className="w-8 md:w-10 text-xs text-slate-700 font-bold outline-none placeholder:text-slate-300 bg-transparent"
                          />
                          <span className="text-[10px] text-slate-400 ml-1">%</span>
                        </div>
                      </div>
                    )}

                    {!assignment.completed && (
                       <button
                          onClick={() => handleGetTips(assignment)}
                          className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                       >
                          <Lightbulb className="w-3 h-3" />
                          Tips
                       </button>
                    )}

                    <div className={`hidden md:flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md transition-colors ${
                      assignment.completed 
                        ? 'text-slate-400 bg-slate-100' 
                        : 'text-orange-600 bg-orange-50'
                    }`}>
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Tips Modal */}
      {selectedTipAssignment && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <div className="flex items-center gap-2 font-bold text-sm">
                          <Lightbulb className="w-4 h-4" />
                          <span>Gemini Study Plan</span>
                      </div>
                      <button onClick={() => setSelectedTipAssignment(null)} className="text-white/80 hover:text-white transition-colors">
                          <X className="w-4 h-4" />
                      </button>
                  </div>
                  <div className="p-5 max-h-[60vh] overflow-y-auto">
                      {loadingTips ? (
                          <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-3">
                              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                              <p className="text-xs font-medium">Generating actionable plan for {subject}...</p>
                          </div>
                      ) : (
                          <div className="prose prose-sm prose-blue text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                              {tips}
                          </div>
                      )}
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={() => setSelectedTipAssignment(null)}
                        className="px-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AssignmentsModule;
