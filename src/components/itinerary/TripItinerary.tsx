import { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, Plus } from 'lucide-react';
import type { Trip } from '../../types/database';

interface TripItineraryProps {
  trip: Trip;
}

interface DayInfo {
  date: Date;
  dateString: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
}

const TripItinerary = ({ trip }: TripItineraryProps) => {
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());

  const toggleDay = (dateString: string) => {
    const newCollapsed = new Set(collapsedDays);
    if (newCollapsed.has(dateString)) {
      newCollapsed.delete(dateString);
    } else {
      newCollapsed.add(dateString);
    }
    setCollapsedDays(newCollapsed);
  };

  const generateDaysList = (): DayInfo[] => {
    if (!trip.start_date || !trip.end_date) return [];

    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const days: DayInfo[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate all days between start and end date (inclusive)
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);
      
      const dateString = currentDate.toISOString().split('T')[0];
      const dayName = currentDate.toLocaleDateString('es-ES', { weekday: 'long' });
      const dayNumber = currentDate.getDate();
      const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long' });
      const isToday = currentDate.getTime() === today.getTime();

      days.push({
        date: new Date(currentDate),
        dateString,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dayNumber,
        monthName,
        isToday,
      });
    }

    return days;
  };

  const days = generateDaysList();

  if (days.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))]">
        <h3 className="font-semibold text-[rgb(var(--black))] mb-4">Itinerario</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-[rgb(var(--coral))]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar size={24} className="text-[rgb(var(--coral))]" />
          </div>
          <p className="text-[rgb(var(--gray-300))] text-sm">
            Añade fechas de inicio y fin para ver tu itinerario
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgb(var(--gray-200))]">
      <h3 className="font-semibold text-[rgb(var(--black))] mb-4">Itinerario</h3>
      
      <div className="space-y-3">
        {days.map((day, index) => {
          const isCollapsed = collapsedDays.has(day.dateString);
          
          return (
            <div key={day.dateString} className="border border-[rgb(var(--gray-200))] rounded-lg">
              {/* Day Header */}
              <button
                onClick={() => toggleDay(day.dateString)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors hover:bg-[rgb(var(--gray-50))] ${
                  day.isToday ? 'bg-[rgb(var(--coral))]/5 border-[rgb(var(--coral))]/20' : ''
                } ${index === 0 ? 'rounded-t-lg' : ''} ${isCollapsed && index === days.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {/* Collapse Icon */}
                  {isCollapsed ? (
                    <ChevronRight size={20} className="text-[rgb(var(--gray-300))] flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-[rgb(var(--gray-300))] flex-shrink-0" />
                  )}
                  
                  {/* Day Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-sm font-medium ${
                      day.isToday 
                        ? 'bg-[rgb(var(--coral))] text-white' 
                        : 'bg-[rgb(var(--gray-100))] text-[rgb(var(--gray-400))]'
                    }`}>
                      <span className="text-xs leading-none">{day.dayNumber}</span>
                      <span className="text-xs leading-none mt-0.5">
                        {day.monthName.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className={`font-medium ${day.isToday ? 'text-[rgb(var(--coral))]' : 'text-[rgb(var(--black))]'}`}>
                        {day.dayName} {day.dayNumber} de {day.monthName}
                      </h4>
                      <p className="text-sm text-[rgb(var(--gray-300))]">
                        Día {index + 1} de {days.length}
                        {day.isToday && (
                          <span className="ml-2 px-2 py-0.5 bg-[rgb(var(--coral))] text-white text-xs rounded-full">
                            Hoy
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Activities count placeholder */}
                <span className="text-sm text-[rgb(var(--gray-300))] pr-2">
                  0 actividades
                </span>
              </button>

              {/* Day Content */}
              {!isCollapsed && (
                <div className="px-4 pb-4">
                  {/* Add Activity Button */}
                  <button 
                    className="w-full mt-3 p-6 border-2 border-dashed border-[rgb(var(--gray-200))] rounded-lg hover:border-[rgb(var(--coral))]/50 hover:bg-[rgb(var(--coral))]/5 transition-colors group"
                    onClick={() => console.log(`Add activity for ${day.dateString}`)}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-[rgb(var(--gray-300))] group-hover:text-[rgb(var(--coral))] transition-colors">
                      <Plus size={24} />
                      <span className="text-sm font-medium">Añadir actividad</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripItinerary;