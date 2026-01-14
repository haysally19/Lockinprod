import React, { useState } from 'react';
import { Course, Assignment } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

interface CalendarViewProps {
  courses: Course[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ courses }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Flatten assignments and attach course info
  const allAssignments = courses.flatMap(course => 
    course.assignments.map(a => ({
      ...a,
      courseName: course.name,
      courseColor: course.color,
      courseId: course.id
    }))
  );

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayAssignments = (day: number) => {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${currentDate.getFullYear()}-${month}-${d}`;
    return allAssignments.filter(a => a.dueDate === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const renderCalendarGrid = () => {
    const days = [];
    const emptySlots = firstDayOfMonth;

    // Previous month filler days
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = 0; i < emptySlots; i++) {
        days.push(
            <div key={`empty-${i}`} className="min-h-[100px] bg-slate-50/50 border border-slate-100 p-2 text-slate-300 pointer-events-none">
                {prevMonthDays - emptySlots + i + 1}
            </div>
        );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const assignments = getDayAssignments(day);
        
        days.push(
            <div key={day} className={`min-h-[100px] md:min-h-[120px] bg-white border border-slate-100 p-2 hover:bg-slate-50 transition-colors group relative flex flex-col gap-1 ${isToday(day) ? 'bg-blue-50/30 ring-1 ring-blue-100 ring-inset' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                        {day}
                    </span>
                    {assignments.length > 0 && (
                        <span className="text-[10px] font-bold text-slate-400">
                            {assignments.length} due
                        </span>
                    )}
                </div>
                
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[80px] md:max-h-[100px] custom-scrollbar">
                    {assignments.map(assign => (
                        <div 
                            key={assign.id} 
                            className={`text-xs px-2 py-1.5 rounded-md border border-l-4 shadow-sm truncate flex items-center gap-1.5 ${assign.completed ? 'opacity-60 bg-slate-50 border-slate-200' : 'bg-white'}`}
                            style={{ borderLeftColor: assign.completed ? '#cbd5e1' : undefined }} // fallback gray if completed
                        >
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${assign.completed ? 'bg-slate-400' : assign.courseColor}`} />
                            <span className={`truncate ${assign.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                                {assign.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return days;
  };

  return (
    <div className="h-full bg-slate-50 overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-shrink-0">
          <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                  Calendar
                  <span className="text-lg font-normal text-slate-400 hidden sm:inline-block">|</span>
                  <span className="text-sm md:text-lg font-medium text-slate-500 hidden sm:inline-block">Track your deadlines</span>
              </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full md:w-auto justify-between md:justify-start">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="px-4 font-bold text-slate-800 min-w-[140px] text-center select-none">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
              </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Calendar Container with horizontal scroll for mobile */}
          <div className="flex-1 flex flex-col overflow-x-auto">
            <div className="min-w-[700px] h-full flex flex-col">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50 flex-shrink-0">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>{day}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
                    {renderCalendarGrid()}
                </div>
            </div>
          </div>
        </div>
        
        {/* Legend / Info Footer */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px]"></div>
              <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Pending Assignment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;