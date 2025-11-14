import React from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday, eachHourOfInterval, startOfDay, endOfDay } from 'date-fns';
import { CalendarEvent } from '../../types/calendar';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick
}) => {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const hours = eachHourOfInterval({
    start: startOfDay(weekStart),
    end: endOfDay(addDays(weekStart, 1))
  });

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter(event => {
      const eventStartHour = event.startTime.getHours();
      const eventDay = startOfDay(event.startTime);
      return isSameDay(eventDay, day) && eventStartHour === hour;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 border-r"></div>
        {weekDays.map(day => (
          <div 
            key={day.toISOString()} 
            className={`p-4 text-center border-r ${isToday(day) ? 'bg-blue-50 font-semibold' : ''}`}
          >
            <div className="text-sm text-gray-600">{format(day, 'EEE')}</div>
            <div className={`text-lg ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-y-auto max-h-96">
        {hours.map(hour => (
          <div key={hour.toISOString()} className="grid grid-cols-8 border-b">
            <div className="p-2 border-r text-sm text-gray-500 text-right pr-4">
              {format(hour, 'h a')}
            </div>
            {weekDays.map(day => (
              <div
                key={day.toISOString()}
                className="min-h-16 p-1 border-r hover:bg-gray-50 cursor-pointer"
                onClick={() => onTimeSlotClick(day, hour.getHours())}
              >
                {getEventsForDayAndHour(day, hour.getHours()).map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded text-white mb-1 truncate"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => onEventClick(event, e)}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;