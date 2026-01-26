import React from 'react';
import { Course } from '../types';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle2, BarChart3, ArrowRight, Flame, Zap, Plus, ChevronRight, FileText, Sparkles, Camera } from 'lucide-react';
import OnboardingChecklist from './OnboardingChecklist';

interface DashboardProps {
  courses: Course[];
  streak: number;
  userTier: 'free' | 'pro';
  tierLoaded?: boolean;
  onUpgrade: () => void;
  onAddCourse: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ courses, streak, userTier, tierLoaded = true, onUpgrade, onAddCourse }) => {
  const allAssignments = courses.flatMap(c => 
    c.assignments.map(a => ({ ...a, courseName: c.name, courseColor: c.color, courseId: c.id }))
  );

  const pendingAssignments = allAssignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const totalNotes = courses.reduce((sum, c) => sum + c.notes.length, 0);
  const totalDocs = courses.reduce((sum, c) => sum + (c.documents?.length || 0), 0);
  const totalTasks = pendingAssignments.length;

  const studyMaterials = courses.map(course => {
    const noteCount = course.notes.length;
    const docCount = course.documents?.length || 0;
    const totalMaterials = noteCount + docCount;

    return {
      name: course.name,
      shortName: course.name.length > 12 ? course.name.substring(0, 10) + '...' : course.name,
      count: totalMaterials,
      color: course.color
    };
  }).filter(c => c.count > 0);

  return (
    <div className="h-full bg-[#f8fafc] overflow-y-auto no-scrollbar scroll-smooth">
      <div className="p-6 max-w-[1600px] mx-auto w-full pb-24 md:pb-12">
        
        {/* Header Section - Compact */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                Scholar OS 3.0
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              Welcome back.
            </h1>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            {tierLoaded && userTier === 'free' && (
              <button
                onClick={onUpgrade}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-indigo-600 rounded-lg font-bold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-indigo-600" />
                Go Pro
              </button>
            )}
            <button
              onClick={onAddCourse}
              data-add-course-btn
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all group"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
              New Class
            </button>
          </div>
        </div>

        {/* Onboarding Checklist */}
        <OnboardingChecklist />

        {/* Top Level Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <StatCard
                icon={FileText}
                title="Notes"
                value={totalNotes}
                trend="Saved"
                color="indigo"
                delay="delay-[0ms]"
            />
            <StatCard
                icon={CheckCircle2}
                title="Tasks"
                value={totalTasks}
                trend="Pending"
                color="rose"
                delay="delay-[100ms]"
            />
            <StatCard
                icon={BookOpen}
                title="Classes"
                value={courses.length}
                trend="Active"
                color="amber"
                delay="delay-[200ms]"
            />
            <StatCard
                icon={Flame}
                title="Streak"
                value={`${streak}`}
                trend="Days"
                color="orange"
                delay="delay-[300ms]"
                streakActive={streak > 0}
            />
        </div>

        {/* Quick Solve CTA */}
        <Link to="/quick-solve" className="block mb-6 md:mb-8 group animate-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 md:p-8 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Quick Solve</h3>
                  <p className="text-white/80 text-sm">Snap a photo and get instant AI-powered solutions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 group-hover:bg-white/30 transition-all">
                <Camera className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-sm">Try It Now</span>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Study Materials Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm xl:col-span-2 flex flex-col min-h-[300px] animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Study Materials
                </h3>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 hidden md:block">
                    Notes & Docs
                </div>
              </div>

              <div className="flex-1 w-full flex items-end justify-around gap-2 md:gap-6 px-2 pb-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 top-0 flex flex-col justify-between pointer-events-none pb-12 z-0">
                    {[20, 15, 10, 5, 0].map(val => (
                        <div key={val} className="flex items-center gap-4">
                           <span className="text-[10px] font-bold text-slate-300 w-6 md:w-8 text-right tracking-tighter">{val}</span>
                           <div className="flex-1 h-px bg-slate-50 border-t border-dashed border-slate-200"></div>
                        </div>
                    ))}
                  </div>

                  {studyMaterials.length > 0 ? (
                      studyMaterials.map((entry, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 group w-full max-w-[60px] md:max-w-[80px] z-10 h-full justify-end relative">
                          <div className="relative w-full bg-slate-100 rounded-t-lg flex-1 flex items-end overflow-visible">
                            <div
                                className={`w-full rounded-t-lg transition-all duration-1000 ease-spring shadow-sm opacity-90 group-hover:opacity-100 ${entry.color}`}
                                style={{ height: `${Math.min((entry.count / 20) * 100, 100)}%` }}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 shadow-xl z-20 whitespace-nowrap hidden md:block">
                                    {entry.count} items
                                </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 text-center truncate w-full uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                            {entry.shortName}
                          </span>
                        </div>
                      ))
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 z-10">
                          <p className="font-bold text-xs tracking-widest uppercase opacity-40">No study materials yet</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Activity Feed / Deadlines */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col animate-in slide-in-from-bottom-4 duration-700 delay-100">
              <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-rose-500" />
                  Due Soon
              </h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
              {pendingAssignments.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 h-full flex flex-col items-center justify-center italic">
                    <CheckCircle2 className="w-8 h-8 mb-3 text-slate-200" />
                    <p className="text-xs font-medium">No pending tasks.</p>
                  </div>
              ) : (
                  pendingAssignments.slice(0, 6).map((assignment) => (
                  <Link to={`/class/${assignment.courseId}`} key={assignment.id} className="p-3 flex items-center gap-3 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm rounded-xl transition-all group active:scale-95">
                      <div className={`w-8 h-8 rounded-lg ${assignment.courseColor} flex items-center justify-center text-white font-bold text-xs`}>
                        {assignment.courseName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate leading-tight group-hover:text-indigo-600 transition-colors">{assignment.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium truncate">{assignment.courseName}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                  </Link>
                  ))
              )}
              </div>
              <Link to="/calendar" className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:gap-3 transition-all">
                  Full Schedule <ArrowRight className="w-3 h-3" />
              </Link>
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-950 tracking-tight">Active Courses</h3>
              <Link to="/classes" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors group">
                  Directory <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {courses.slice(0, 4).map((course) => (
                  <Link 
                      key={course.id} 
                      to={`/class/${course.id}`}
                      className="flex flex-col p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all group relative overflow-hidden"
                  >
                      {/* Decorative background blob */}
                      <div className={`absolute top-0 right-0 w-24 h-24 ${course.color} opacity-5 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-150 transition-transform duration-700`} />
                      
                      <div className={`w-10 h-10 rounded-lg ${course.color} flex items-center justify-center text-white shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                          <BookOpen className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 mt-4 relative z-10">
                          <h4 className="text-sm font-bold text-slate-950 group-hover:text-indigo-600 transition-colors leading-tight mb-2 truncate">{course.name}</h4>
                          <div className="flex items-center gap-2">
                             <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${course.color} w-3/4 opacity-50`}></div>
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{course.assignments.filter(a => !a.completed).length} Tasks</span>
                          </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="truncate max-w-[70%]">{course.subject}</span>
                          <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <ArrowRight className="w-3 h-3" />
                          </div>
                      </div>
                  </Link>
              ))}
              
              {/* Add New Course Card */}
              <button
                onClick={onAddCourse}
                className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group min-h-[160px]"
              >
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all mb-3">
                      <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-600 group-hover:text-indigo-700 text-sm">Add Course</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color, delay, streakActive, trend }: any) => {
    const variants: any = {
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        rose: 'text-rose-600 bg-rose-50 border-rose-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
        orange: 'text-orange-600 bg-orange-50 border-orange-100',
    };
    return (
        <div className={`bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${delay} group relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${variants[color] || variants.indigo} border shadow-inner`}>
                    <Icon className={`w-5 h-5 ${streakActive ? 'animate-pulse' : ''}`} />
                </div>
                {trend && (
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400 border border-slate-100">
                        {trend}
                    </span>
                )}
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-950 tracking-tighter mb-0.5 group-hover:scale-105 transition-transform origin-left">{value}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{title}</p>
            </div>
            {/* Background Decor */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-5 ${variants[color].split(' ')[1]} group-hover:scale-150 transition-transform duration-500`} />
        </div>
    );
}

export default Dashboard;