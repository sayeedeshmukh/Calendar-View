import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  isToday,
} from 'date-fns';
import { CalendarEvent, CalendarView } from '../Calendar';

const DayNames: React.FC = () => (
  <div className="grid grid-cols-7 gap-1 mb-1">
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
      <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
        {day}
      </div>
    ))}
  </div>
);

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('month'); // 'month' | 'week'

  // Handlers
  const goToToday = () => setCurrentDate(new Date());
  const goPrev = () => {
    if (view === 'month') setCurrentDate(prev => subMonths(prev, 1));
    else setCurrentDate(prev => addDays(prev, -7));
  };
  const goNext = () => {
    if (view === 'month') setCurrentDate(prev => addMonths(prev, 1));
    else setCurrentDate(prev => addDays(prev, 7));
  };

  // Build calendarDays depending on view
  let calendarStart: Date;
  let calendarEnd: Date;

  if (view === 'month') {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    calendarStart = startOfWeek(monthStart);
    calendarEnd = endOfWeek(monthEnd);
  } else {
    // week view centered on currentDate's week
    calendarStart = startOfWeek(currentDate);
    calendarEnd = endOfWeek(currentDate);
  }

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Placeholder: events could be passed as props or pulled from state
  const events: CalendarEvent[] = []; // keep empty for now

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {view === 'month' ? format(currentDate, 'MMMM yyyy') : `${format(startOfWeek(currentDate), 'd MMM')} - ${format(endOfWeek(currentDate), 'd MMM yyyy')}`}
        </h2>

        <div className="flex gap-2 items-center">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Today
          </button>

          <button
            onClick={goPrev}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Previous
          </button>

          <button
            onClick={goNext}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Next
          </button>

          <select
            value={view}
            onChange={(e) => setView(e.target.value as CalendarView)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <DayNames />

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 border border-gray-200 rounded
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                  ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${isTodayDate ? 'inline-flex items-center justify-center rounded-full w-6 h-6 bg-blue-500 text-white' : ''}`}>
                  {!isTodayDate ? format(day, 'd') : format(day, 'd')}
                </div>

                {/* Events placeholder */}
                <div className="flex flex-col gap-1">
                  {events
                    .filter(evt => isSameDay(new Date(evt.date), day))
                    .map(evt => (
                      <div key={evt.id} className="text-xs p-1 rounded border bg-gray-100">
                        {evt.title}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
