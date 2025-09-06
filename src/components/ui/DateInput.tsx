import {
  useState,
  forwardRef,
  type InputHTMLAttributes,
  useRef,
  useEffect,
} from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from './Button';

interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onChange?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      error,
      helperText,
      value = '',
      onChange,
      minDate,
      maxDate,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [calendarPosition, setCalendarPosition] = useState({
      top: 0,
      left: 0,
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentMonth, setCurrentMonth] = useState(() => {
      if (value) {
        return new Date(value);
      }
      return new Date();
    });

    const hasError = Boolean(error);

    const inputClasses = `
      w-full px-4 py-2.5 text-[rgb(var(--black))] bg-white border rounded-lg 
      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
      cursor-pointer
      ${
        hasError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-[rgb(var(--gray-300))] focus:border-[rgb(var(--coral))] focus:ring-[rgb(var(--coral))]/20'
      }
      placeholder:text-[rgb(var(--gray-300))]
      disabled:bg-[rgb(var(--gray-50))] disabled:cursor-not-allowed
      ${className}
    `.trim();

    const formatDisplayDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];

      // Días del mes anterior para completar la primera semana
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const prevMonth = new Date(year, month - 1, 0);
        days.push({
          day: prevMonth.getDate() - i,
          isCurrentMonth: false,
          date: new Date(year, month - 1, prevMonth.getDate() - i),
        });
      }

      // Días del mes actual
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          day,
          isCurrentMonth: true,
          date: new Date(year, month, day),
        });
      }

      // Días del siguiente mes para completar la última semana
      const remainingDays = 42 - days.length; // 6 semanas * 7 días
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          day,
          isCurrentMonth: false,
          date: new Date(year, month + 1, day),
        });
      }

      return days;
    };

    const handleDateClick = (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      onChange?.(dateStr);
      setIsOpen(false);
    };

    const isDateDisabled = (date: Date) => {
      if (disabled) return true;

      const dateStr = date.toISOString().split('T')[0];

      if (minDate && dateStr < minDate) return true;
      if (maxDate && dateStr > maxDate) return true;

      return false;
    };

    const isDateSelected = (date: Date) => {
      if (!value) return false;
      return date.toISOString().split('T')[0] === value;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev);
        if (direction === 'prev') {
          newMonth.setMonth(prev.getMonth() - 1);
        } else {
          newMonth.setMonth(prev.getMonth() + 1);
        }
        return newMonth;
      });
    };

    const updateCalendarPosition = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const calendarHeight = 400; // Approximate height of calendar

        let top = rect.bottom + window.scrollY + 8;
        let left = rect.left + window.scrollX;

        // Check if calendar would go below viewport
        if (rect.bottom + calendarHeight > viewportHeight) {
          top = rect.top + window.scrollY - calendarHeight - 8;
        }

        // Check if calendar would go outside right edge
        if (left + 320 > window.innerWidth) {
          left = window.innerWidth - 320 - 16;
        }

        setCalendarPosition({ top, left });
      }
    };

    useEffect(() => {
      if (isOpen) {
        updateCalendarPosition();
        const handleResize = () => updateCalendarPosition();
        const handleScroll = () => updateCalendarPosition();

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', handleScroll, true);
        };
      }
    }, [isOpen]);

    const days = getDaysInMonth(currentMonth);
    const monthYear = currentMonth.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className="space-y-2 relative">
        {label && (
          <label className="block text-sm font-medium text-[rgb(var(--black))]">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={(el) => {
              inputRef.current = el;
              if (ref) {
                if (typeof ref === 'function') {
                  ref(el);
                } else {
                  ref.current = el;
                }
              }
            }}
            type="text"
            readOnly
            value={formatDisplayDate(value)}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={inputClasses}
            placeholder="Selecciona una fecha"
            disabled={disabled}
            {...props}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--gray-300))]">
            <Calendar size={20} />
          </div>
        </div>

        {/* Overlay para cerrar el calendario */}
        {isOpen && (
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Calendar Popup - Fixed positioned to avoid affecting container size */}
        {isOpen && !disabled && (
          <div
            className="fixed bg-white border border-[rgb(var(--gray-200))] rounded-lg shadow-2xl z-[9999] p-4 min-w-[320px]"
            style={{
              top: `${calendarPosition.top}px`,
              left: `${calendarPosition.left}px`,
            }}
          >
            {/* Header del calendario */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="p-1 h-8 w-8"
              >
                <ChevronLeft size={16} />
              </Button>

              <h3 className="font-semibold text-[rgb(var(--black))] capitalize">
                {monthYear}
              </h3>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="p-1 h-8 w-8"
              >
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-[rgb(var(--gray-300))]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((dayObj, index) => {
                const isDisabled = isDateDisabled(dayObj.date);
                const isSelected = isDateSelected(dayObj.date);
                const isToday =
                  dayObj.date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && handleDateClick(dayObj.date)}
                    disabled={isDisabled}
                    className={`
                        p-2 text-sm rounded-lg transition-colors text-center
                        ${
                          !dayObj.isCurrentMonth
                            ? 'text-[rgb(var(--gray-200))]'
                            : 'text-[rgb(var(--black))]'
                        }
                        ${isSelected ? 'bg-[rgb(var(--coral))] text-white' : ''}
                        ${
                          !isSelected && isToday
                            ? 'bg-[rgb(var(--coral))]/10 text-[rgb(var(--coral))] font-semibold'
                            : ''
                        }
                        ${
                          !isSelected && !isToday && !isDisabled
                            ? 'hover:bg-[rgb(var(--gray-100))]'
                            : ''
                        }
                        ${
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }
                      `}
                  >
                    {dayObj.day}
                  </button>
                );
              })}
            </div>

            {/* Footer con botones */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-[rgb(var(--gray-200))]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange?.('');
                  setIsOpen(false);
                }}
                className="text-[rgb(var(--gray-300))]"
              >
                Limpiar
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
                Cerrar
              </Button>
            </div>
          </div>
        )}

        {(error || helperText) && (
          <p
            className={`text-sm ${
              error ? 'text-red-600' : 'text-[rgb(var(--gray-300))]'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export default DateInput;
