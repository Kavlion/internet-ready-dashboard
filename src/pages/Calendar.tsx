
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Home, CalendarDays, Settings } from 'lucide-react';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format dates
  const monthYear = currentMonth.toLocaleDateString('uz-UZ', {
    month: 'long',
    year: 'numeric',
  });

  const formatDay = (date: Date) => {
    return date.getDate().toString().padStart(2, '0');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount);
  };

  // Generate calendar dates
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDayIndex = firstDay.getDay() || 7; // Convert Sunday from 0 to 7
    
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 1; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = generateCalendarDays();

  // Navigation
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">Kalendar</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">{monthYear}</h2>
            <div className="flex space-x-2">
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200"
                onClick={previousMonth}
              >
                <ArrowLeft size={16} />
              </button>
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200"
                onClick={nextMonth}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Total for Month */}
          <div className="glass-card p-4 mb-6 animate-scale-in">
            <div className="text-sm text-gray-500 mb-1">Qarzdorlik</div>
            <div className="text-xl font-bold">
              {formatCurrency(120125000)} <span className="text-sm font-normal">so'm</span>
            </div>
          </div>

          {/* Calendar */}
          <div className="glass-card p-4 mb-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
              <div>Du</div>
              <div>Se</div>
              <div>Ch</div>
              <div>Pa</div>
              <div>Ju</div>
              <div>Sh</div>
              <div>Ya</div>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day ? (
                    <button
                      className={`w-full h-full flex items-center justify-center text-sm rounded-md transition-all ${
                        isToday(day)
                          ? 'bg-app-blue text-white'
                          : isSelected(day)
                          ? 'bg-blue-100 text-app-blue'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {formatDay(day)}
                    </button>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Payments */}
          <h3 className="text-lg font-semibold mb-3">Qarzdorlar bugun to'lashlari</h3>
          
          <div className="space-y-4">
            <div className="glass-card p-4 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-sm text-gray-500 mb-1">Anvarjon Soliyjonov</div>
              <div className="text-lg font-semibold">
                {formatCurrency(1210000)}
                <span className="text-xs text-gray-500 ml-1">so'm</span>
              </div>
            </div>
            
            <div className="glass-card p-4 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-sm text-gray-500 mb-1">Otabek Tohirov</div>
              <div className="text-lg font-semibold">
                {formatCurrency(970000)}
                <span className="text-xs text-gray-500 ml-1">so'm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="grid grid-cols-4 border-t border-gray-200 bg-white">
        <Link to="/" className="flex flex-col items-center py-3 text-gray-500">
          <Home size={20} />
          <span className="text-xs mt-1">Asosiy</span>
        </Link>
        <Link to="/debtors" className="flex flex-col items-center py-3 text-gray-500">
          <User size={20} />
          <span className="text-xs mt-1">Qarzdorlar</span>
        </Link>
        <Link to="/calendar" className="flex flex-col items-center py-3 text-app-blue">
          <CalendarDays size={20} />
          <span className="text-xs mt-1">Kalendar</span>
        </Link>
        <Link to="/settings" className="flex flex-col items-center py-3 text-gray-500">
          <Settings size={20} />
          <span className="text-xs mt-1">Sozlamalar</span>
        </Link>
      </div>
    </div>
  );
};

export default Calendar;
