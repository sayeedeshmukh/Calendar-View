import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  isToday,
  isSameDay,
} from 'date-fns';
import { CalendarEvent, CalendarView } from '../../types/calendar';
import { v4 as uuidv4 } from 'uuid';
import EventModal from '../EventModal/EventModal';
import WeekView from './WeekView';

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
  const [view, setView] = useState<CalendarView>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goToToday = () => setCurrentDate(new Date());
  const goPrev = () => {
    if (view === 'month') setCurrentDate(prev => subMonths(prev, 1));
    else setCurrentDate(prev => addDays(prev, -7));
  };
  const goNext = () => {
    if (view === 'month') setCurrentDate(prev => addMonths(prev, 1));
    else setCurrentDate(prev => addDays(prev, 7));
  };

  let calendarStart: Date;
  let calendarEnd: Date;

  if (view === 'month') {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    calendarStart = startOfWeek(monthStart);
    calendarEnd = endOfWeek(monthEnd);
  } else {
    calendarStart = startOfWeek(currentDate);
    calendarEnd = endOfWeek(currentDate);
  }

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };
  const handleTimeSlotClick = (date: Date, hour: number) => {
  const startTime = new Date(date);
  startTime.setHours(hour, 0, 0, 0);
  setSelectedDate(startTime);
  setSelectedEvent(null);
  setIsModalOpen(true);
};

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.startTime), day));
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (selectedEvent) {
      setEvents(prev =>
        prev.map(ev => (ev.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : ev))
      );
    } else {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: uuidv4(),
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {view === 'month'
            ? format(currentDate, 'MMMM yyyy')
            : `${format(startOfWeek(currentDate), 'd MMM')} - ${format(endOfWeek(currentDate), 'd MMM yyyy')}`}
        </h2>

        <div className="flex gap-2 items-center">
          <button onClick={goToToday} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Today
          </button>
          <button onClick={goPrev} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            Previous
          </button>
          <button onClick={goNext} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
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
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 border border-gray-200 rounded cursor-pointer ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} ${isTodayDate ? 'border-blue-500 border-2' : ''} hover:bg-gray-50`}
                onClick={() => handleDayClick(day)}
                tabIndex={0}
                role="button"
                aria-label={`Day ${format(day, 'd')}${isTodayDate ? ', today' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDayClick(day);
                  }
                }}
              >
                <div className={`text-sm font-medium mb-1 ${isTodayDate ? 'inline-flex items-center justify-center rounded-full w-6 h-6 bg-blue-500 text-white' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded text-white truncate cursor-pointer"
                      style={{ backgroundColor: event.color || '#4F46E5' }}
                      onClick={(e) => handleEventClick(event, e)}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar;