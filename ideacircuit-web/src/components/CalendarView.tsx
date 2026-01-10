import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, ClockIcon, UsersIcon, VideoIcon, CalendarIcon } from 'lucide-react';
import { useAppointmentsStore } from '../stores/appointments';
import api from '../services/api';

interface ScheduledCall {
  id: number;
  title: string;
  date: Date;
  duration: number;
  participants: number;
  type: string;
}

export const CalendarView: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [loading, setLoading] = useState(true);
  const { appointments, fetchAppointments } = useAppointmentsStore();

  useEffect(() => {
    loadScheduledCalls();
  }, [currentMonth]);

  const loadScheduledCalls = async () => {
    setLoading(true);
    try {
      // Fetch appointments from Task Juggler
      await fetchAppointments();
      
      // Convert appointments to scheduled calls format
      const calls: ScheduledCall[] = appointments.map(apt => ({
        id: parseInt(apt.id) || Date.now(),
        title: apt.guest_name || 'Meeting',
        date: new Date(apt.start_time),
        duration: 60, // Default duration, can be calculated from start_time and end_time
        participants: 1, // Default, can be enhanced
        type: 'video'
      }));
      
      setScheduledCalls(calls);
    } catch (error) {
      console.error('Error loading scheduled calls:', error);
      setScheduledCalls([]);
    } finally {
      setLoading(false);
    }
  };

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayIndex = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthDays = getMonthData(currentMonth);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  const hasEvents = (date: Date | null) => {
    if (!date) return false;
    return scheduledCalls.some(call => 
      call.date.getDate() === date.getDate() && 
      call.date.getMonth() === date.getMonth() && 
      call.date.getFullYear() === date.getFullYear()
    );
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return scheduledCalls.filter(call => 
      call.date.getDate() === date.getDate() && 
      call.date.getMonth() === date.getMonth() && 
      call.date.getFullYear() === date.getFullYear()
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col glass-standard rounded-lg overflow-hidden shadow-1">
      <div className="p-4 border-b border-border flex justify-between items-center glass-subtle">
        <h2 className="text-headline font-semibold text-text-primary">Call Schedule</h2>
        <div className="flex space-x-2">
          <button 
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-md flex items-center text-label font-medium min-h-[44px] transition-colors duration-fast"
            aria-label="New call"
          >
            <PlusIcon size={16} className="mr-1" />
            New Call
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar */}
        <div className="w-2/3 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-title-large font-semibold text-text-primary">{formatMonth(currentMonth)}</h3>
            <div className="flex space-x-2">
              <button 
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
                onClick={prevMonth}
                aria-label="Previous month"
              >
                <ChevronLeftIcon size={20} />
              </button>
              <button 
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
                onClick={nextMonth}
                aria-label="Next month"
              >
                <ChevronRightIcon size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {weekdays.map(day => (
              <div key={day} className="text-center py-2 text-label font-medium text-text-secondary">
                {day}
              </div>
            ))}
            {monthDays.map((day, index) => (
              <div 
                key={index} 
                className={`h-24 border rounded-lg p-1 transition-colors duration-fast ${
                  day 
                    ? 'cursor-pointer hover:bg-bg-secondary' 
                    : 'bg-bg-tertiary'
                } ${
                  isSelected(day) 
                    ? 'border-primary bg-primary-light' 
                    : 'border-border'
                }`} 
                onClick={() => day && setSelectedDate(day)}
              >
                {day && (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-body-small font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday(day) 
                          ? 'bg-primary text-white' 
                          : isSelected(day) 
                            ? 'text-primary' 
                            : 'text-text-primary'
                      }`}>
                        {day.getDate()}
                      </span>
                      {hasEvents(day) && (
                        <span className="w-2 h-2 rounded-full bg-status-completed"></span>
                      )}
                    </div>
                    <div className="overflow-hidden space-y-1">
                      {getEventsForDate(day).slice(0, 2).map(event => (
                        <div 
                          key={event.id} 
                          className="text-caption p-1 rounded bg-primary-light text-primary truncate"
                        >
                          {formatTime(event.date)} {event.title}
                        </div>
                      ))}
                      {getEventsForDate(day).length > 2 && (
                        <div className="text-caption text-text-tertiary pl-1">
                          +{getEventsForDate(day).length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Events for selected date */}
        <div className="w-1/3 border-l border-border p-6 overflow-y-auto bg-bg-secondary">
          <h3 className="text-headline font-semibold mb-4 text-text-primary">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          {loading ? (
            <div className="text-center py-8 text-text-secondary text-body-medium">Loading...</div>
          ) : getEventsForDate(selectedDate).length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <CalendarIcon size={40} className="mx-auto mb-2 opacity-50" />
              <p className="text-body-medium mb-4">No scheduled calls for this date</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-label font-medium min-h-[44px] flex items-center mx-auto hover:bg-primary-hover transition-colors duration-fast"
                aria-label="Schedule a call"
              >
                <PlusIcon size={16} className="mr-2" />
                Schedule a call
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="glass-standard rounded-lg p-4 shadow-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-title-medium text-text-primary">{event.title}</h4>
                    <span className="px-2 py-1 text-label rounded-full bg-status-completed/10 text-status-completed border border-status-completed/30">
                      {event.type}
                    </span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-body-small text-text-secondary">
                      <ClockIcon size={14} className="mr-2" />
                      {formatTime(event.date)} ({event.duration} min)
                    </div>
                    <div className="flex items-center text-body-small text-text-secondary">
                      <UsersIcon size={14} className="mr-2" />
                      {event.participants} participants
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button 
                      className="px-3 py-1.5 bg-primary text-white rounded-md text-label font-medium min-h-[44px] flex items-center hover:bg-primary-hover transition-colors duration-fast"
                      aria-label="Join meeting"
                    >
                      <VideoIcon size={14} className="mr-1" />
                      Join
                    </button>
                    <button 
                      className="px-3 py-1.5 border border-border text-text-primary rounded-md text-label font-medium min-h-[44px] hover:bg-bg-secondary transition-colors duration-fast"
                      aria-label="Edit meeting"
                    >
                      Edit
                    </button>
                    <button 
                      className="px-3 py-1.5 border border-border text-text-primary rounded-md text-label font-medium min-h-[44px] hover:bg-bg-secondary transition-colors duration-fast"
                      aria-label="Cancel meeting"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
