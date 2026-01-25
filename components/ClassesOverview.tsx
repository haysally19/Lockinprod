import React, { useState } from 'react';
import { Course } from '../types';
import { Plus, Search, ArrowUpDown, BookOpen, Filter } from 'lucide-react';
import ClassCard from './ClassCard';

interface ClassesOverviewProps {
  courses: Course[];
  onAddCourse: () => void;
  onDeleteCourse: (id: string) => Promise<void>;
}

const ClassesOverview: React.FC<ClassesOverviewProps> = ({ courses, onAddCourse, onDeleteCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'notes' | 'subject'>('name');

  // Filter and Sort Logic
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'subject') return a.subject.localeCompare(b.subject);
    if (sortBy === 'notes') {
      return b.notes.length - a.notes.length;
    }
    return 0;
  });

  return (
    <div className="h-full bg-slate-50 flex flex-col">
       {/* Condensed Header Section - Made Smaller */}
       <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-2.5 sticky top-0 z-10 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Title Group */}
                <div className="flex items-center gap-3">
                     <h1 className="text-lg font-bold text-slate-900 tracking-tight">My Classes</h1>
                     <div className="hidden md:block h-4 w-px bg-slate-200"></div>
                     <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                        <BookOpen className="w-3 h-3" />
                        {courses.length} Active
                     </span>
                </div>

                {/* Toolbar Group */}
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-56 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search classes..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500/50 rounded-lg text-xs md:text-sm text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-medium"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {/* Sort */}
                        <div className="relative flex-1 sm:w-32 group">
                            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 group-focus-within:text-blue-500 transition-colors" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full appearance-none pl-8 pr-7 py-1.5 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500/50 rounded-lg text-xs md:text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all outline-none"
                            >
                                <option value="name">Name</option>
                                <option value="notes">Notes</option>
                                <option value="subject">Subject</option>
                            </select>
                            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 pointer-events-none" />
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={onAddCourse}
                            className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-bold shadow-md shadow-slate-900/10 transition-all transform active:scale-95 whitespace-nowrap text-xs md:text-sm flex-shrink-0"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">New Class</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </div>
                </div>
            </div>
       </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-24 md:pb-6">
         <div className="max-w-7xl mx-auto">
              {filteredCourses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 mt-8 text-center animate-in fade-in zoom-in duration-300">
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                          <BookOpen className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">No classes found</h3>
                      <p className="text-slate-500 max-w-sm mx-auto mb-4 text-sm">
                        {searchTerm ? `No results for "${searchTerm}"` : "Get started by adding your first class."}
                      </p>
                      {searchTerm && (
                          <button 
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline text-sm"
                          >
                            Clear search
                          </button>
                      )}
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredCourses.map((course) => (
                          <div key={course.id} className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ClassCard course={course} onDelete={onDeleteCourse} />
                          </div>
                      ))}
                      
                      {/* Condensed Add Class Card */}
                       <button 
                          onClick={onAddCourse}
                          className="group h-full min-h-[140px] md:min-h-[180px] rounded-xl border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center p-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50/50"
                      >
                          <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                              <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors mb-0.5">Add Class</h3>
                      </button>
                  </div>
              )}
         </div>
      </div>
    </div>
  );
};

export default ClassesOverview;