import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../EventModal';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (eventId: string) => void;
  event?: CalendarEvent | null;
  selectedDate?: Date;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  selectedDate
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('#3b82f6');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setStartTime(formatTime(event.startTime));
      setEndTime(formatTime(event.endTime));
      setColor(event.color);
    } else if (selectedDate) {
      const defaultStart = new Date(selectedDate);
      defaultStart.setHours(9, 0, 0, 0);
      const defaultEnd = new Date(defaultStart);
      defaultEnd.setHours(10, 0, 0, 0);
      setStartTime(formatTime(defaultStart));
      setEndTime(formatTime(defaultEnd));
    }
  }, [event, selectedDate]);

  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = new Date(selectedDate || event?.startTime || new Date());
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    onSave({
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
      color,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">
          {event ? 'Edit Event' : 'Create Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex gap-2">
              {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'].map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === colorOption ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setColor(colorOption)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <div>
              {event && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(event.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;