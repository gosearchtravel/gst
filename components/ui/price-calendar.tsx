"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePrice {
  date: string;
  price: number;
  category: 'cheaper' | 'average' | 'higher';
}

interface PriceCalendarProps {
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
  searchType?: 'flight' | 'hotel' | 'car';
  position?: { top: number; left: number; width: number };
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const PriceCalendar: React.FC<PriceCalendarProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
  searchType = 'flight',
  position,
  inputRef
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [prices, setPrices] = useState<{ [key: string]: DatePrice }>({});
  const calendarRef = useRef<HTMLDivElement>(null);

  // Generate mock price data for calendar
  useEffect(() => {
    const generatePriceData = () => {
      const priceData: { [key: string]: DatePrice } = {};
      const basePrice = searchType === 'flight' ? 250 : searchType === 'hotel' ? 120 : 35;

      // Generate prices for 3 months
      for (let monthOffset = -1; monthOffset <= 1; monthOffset++) {
        const monthDate = new Date(currentMonth);
        monthDate.setMonth(monthDate.getMonth() + monthOffset);

        const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
          const dateStr = date.toISOString().split('T')[0];

          // Skip past dates
          if (date < new Date()) continue;

          // Generate price variation based on various factors
          let priceMultiplier = 1;

          // Weekend pricing (higher)
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 5 || dayOfWeek === 6) priceMultiplier += 0.3;

          // Holiday periods (higher) - roughly simulate holiday seasons
          const monthNum = date.getMonth();
          const dayOfMonth = date.getDate();
          if (
            (monthNum === 11 && dayOfMonth > 20) || // Christmas
            (monthNum === 0 && dayOfMonth < 5) || // New Year
            (monthNum === 6 || monthNum === 7) || // Summer
            (monthNum === 3 && dayOfMonth > 10 && dayOfMonth < 25) // Easter period
          ) {
            priceMultiplier += 0.4;
          }

          // Random variation
          priceMultiplier += (Math.random() - 0.5) * 0.4;

          const finalPrice = Math.round(basePrice * priceMultiplier);

          // Categorize prices
          let category: 'cheaper' | 'average' | 'higher';
          if (finalPrice < basePrice * 0.85) category = 'cheaper';
          else if (finalPrice > basePrice * 1.15) category = 'higher';
          else category = 'average';

          priceData[dateStr] = {
            date: dateStr,
            price: finalPrice,
            category
          };
        }
      }

      setPrices(priceData);
    };

    generatePriceData();
  }, [currentMonth, searchType]);

  // Calculate position based on input element
  useEffect(() => {
    if (inputRef?.current && !position) {
      // The position will be handled by the parent component
    }
  }, [inputRef, position]);

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      days.push({
        day,
        dateStr,
        price: prices[dateStr]
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleDateClick = (dateStr: string) => {
    onDateSelect(dateStr);
    onClose();
  };

  const getCellStyle = (priceData?: DatePrice) => {
    if (!priceData) return 'bg-gray-100 text-gray-400 cursor-not-allowed';

    const baseClasses = 'hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200';

    switch (priceData.category) {
      case 'cheaper':
        return `${baseClasses} bg-green-200 text-green-800 hover:bg-green-300`;
      case 'average':
        return `${baseClasses} bg-orange-200 text-orange-800 hover:bg-orange-300`;
      case 'higher':
        return `${baseClasses} bg-red-200 text-red-800 hover:bg-red-300`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-700`;
    }
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isSelected = (dateStr: string) => {
    return selectedDate === dateStr;
  };

  // Show as dropdown positioned under input
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose}></div>

      {/* Dropdown Calendar */}
      <div
        ref={calendarRef}
        className="absolute bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999]"
        style={{
          top: position?.top || 0,
          left: position?.left || 0,
          width: Math.max(600, (position?.width || 300) * 2),
          maxWidth: '90vw'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Date</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Current Month */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft size={16} />
                </button>
                <h4 className="text-sm font-semibold">{formatMonthYear(currentMonth)}</h4>
                <div className="w-6"></div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-600 p-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((dayData, index) => (
                  <div key={index} className="aspect-square">
                    {dayData ? (
                      <div
                        className={`
                          w-full h-full rounded-md flex flex-col items-center justify-center text-xs font-medium
                          ${getCellStyle(dayData.price)}
                          ${isSelected(dayData.dateStr) ? 'ring-2 ring-blue-500' : ''}
                          ${isToday(dayData.dateStr) ? 'ring-2 ring-gray-800' : ''}
                        `}
                        onClick={() => dayData.price && handleDateClick(dayData.dateStr)}
                      >
                        <span className="text-xs font-bold">{dayData.day}</span>
                        {dayData.price && (
                          <span className="text-xs">£{dayData.price.price}</span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Month */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-6"></div>
                <h4 className="text-sm font-semibold">{formatMonthYear(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}</h4>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-600 p-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)).map((dayData, index) => (
                  <div key={index} className="aspect-square">
                    {dayData ? (
                      <div
                        className={`
                          w-full h-full rounded-md flex flex-col items-center justify-center text-xs font-medium
                          ${getCellStyle(dayData.price)}
                          ${isSelected(dayData.dateStr) ? 'ring-2 ring-blue-500' : ''}
                          ${isToday(dayData.dateStr) ? 'ring-2 ring-gray-800' : ''}
                        `}
                        onClick={() => dayData.price && handleDateClick(dayData.dateStr)}
                      >
                        <span className="text-xs font-bold">{dayData.day}</span>
                        {dayData.price && (
                          <span className="text-xs">£{dayData.price.price}</span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-200 rounded border border-green-300"></div>
              <span className="text-xs font-medium">Cheaper</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-200 rounded border border-orange-300"></div>
              <span className="text-xs font-medium">Average</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-200 rounded border border-red-300"></div>
              <span className="text-xs font-medium">Higher</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceCalendar;
