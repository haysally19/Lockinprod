import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { MoreVertical, Calendar, MessageSquare, FileText, ArrowRight, CheckCircle2, Trash2 } from 'lucide-react';

interface ClassCardProps {
  course: Course;
  onDelete?: (id: string) => Promise<void>;
}

const ClassCard: React.FC<ClassCardProps> = ({ course, onDelete }) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete && confirm(`Delete ${course.name}?`)) {
      await onDelete(course.id);
    }
  };
  // --- Data Calculations ---
  const totalAssignments = course.assignments.length;
  const completedAssignments = course.assignments.filter(a => a.completed).length;
  const progress = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
  
  const gradedAssignments = course.assignments.filter(a => a.grade !== undefined);
  const avgGrade = gradedAssignments.length > 0 
      ? Math.round(gradedAssignments.reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedAssignments.length)
      : null;
  
  const nextDue = course.assignments
      .filter(a => !a.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  // --- UI Helpers ---
  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-slate-400';
    if (grade >= 90) return 'text-emerald-600';
    if (grade >= 80) return 'text-blue-600';
    return 'text-amber-600';
  };
  
  return (
    <div className="h-full group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Decorative Top Border */}
      <div className={`h-1 w-full ${course.color}`} />

      <div className="p-4 flex-1 flex flex-col">
          {/* Card Header */}
          <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${course.color} bg-opacity-10 flex-shrink-0 flex items-center justify-center`}>
                      <span className={`font-bold text-sm ${course.color.replace('bg-', 'text-')}`}>
                          {course.name.charAt(0)}
                      </span>
                  </div>
                  <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">{course.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{course.subject}</p>
                  </div>
              </div>
              
              {/* Condensed Grade Badge */}
               <div className="flex-shrink-0 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  <span className={`text-xs font-bold ${getGradeColor(avgGrade)}`}>
                      {avgGrade ? `${avgGrade}%` : '--'}
                  </span>
              </div>
          </div>

          {/* Progress Bar Compact */}
          <div className="mb-3">
              <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-medium text-slate-400">Progress</span>
                  <span className="text-[10px] font-bold text-slate-600">{completedAssignments}/{totalAssignments}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div 
                      className={`h-full rounded-full ${course.color} transition-all duration-500`} 
                      style={{ width: `${progress}%` }}
                  />
              </div>
          </div>

          {/* Next Due (Condensed) */}
          <div className="flex-1 min-h-[38px] flex flex-col justify-end"> 
            {nextDue ? (
                <div className="flex items-center gap-2 p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
                    <Calendar className="w-3 h-3 flex-shrink-0 text-amber-500" />
                    <div className="truncate flex-1 min-w-0">
                        <span className="truncate block text-xs font-medium text-amber-900">{nextDue.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 whitespace-nowrap">
                        {new Date(nextDue.dueDate).toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 opacity-60">
                     <CheckCircle2 className="w-3 h-3 text-slate-400" />
                     <span className="text-xs text-slate-500 font-medium">All caught up</span>
                </div>
            )}
          </div>

          {/* Action Footer (Condensed) */}
          <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
              <div className="flex gap-1 items-center">
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete class"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <Link to={`/class/${course.id}`} state={{ openTab: 'chat' }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="AI Tutor">
                      <MessageSquare className="w-3.5 h-3.5" />
                  </Link>
                  <Link to={`/class/${course.id}`} state={{ openTab: 'notes' }} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors" title="Notes">
                      <FileText className="w-3.5 h-3.5" />
                  </Link>
              </div>
              <Link
                  to={`/class/${course.id}`}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded-md"
              >
                  OPEN <ArrowRight className="w-3 h-3" />
              </Link>
          </div>
      </div>
    </div>
  );
};

export default ClassCard;