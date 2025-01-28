import React, { useState, useMemo, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, addYears, subYears } from 'date-fns';
import axiosInstance from '../../axiosInstance';
import CalendarModal from './CalendarModal';
import { AiOutlineLeft, AiOutlineRight, AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';

interface Event {
  id: number;
  dates: Date[]; // Liste des dates
  intitule: string;
  structureName: string;
}


export const getEvents = async () => {
  try {
    const response = await axiosInstance.get("/api/evenements/calendrier");
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des événements');
    throw error;
  }
};

const Calendrier: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Impossible de charger les événements.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const currentMonth = useMemo(() => startOfMonth(date), [date]);
  const endMonth = useMemo(() => endOfMonth(currentMonth), [currentMonth]);
  const startMonth = useMemo(() => startOfWeek(currentMonth, { weekStartsOn: 1 }), [currentMonth]);
  const endCalendar = useMemo(() => endOfWeek(endMonth, { weekStartsOn: 1 }), [endMonth]);

  const days = useMemo(() => eachDayOfInterval({ start: startMonth, end: endCalendar }), [startMonth, endCalendar]);

  const handleDayClick = (day: Date) => {
    setDate(day);
    const selectedDate = format(day, 'MM/dd/yyyy');
    const eventsOnSelectedDate = events.filter(event =>
      event.dates.some(date => format(date, 'MM/dd/yyyy') === selectedDate)
    );
    setSelectedEvents(eventsOnSelectedDate);
    setIsModalOpen(true);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setDate(prevDate => direction === 'prev' ? subMonths(prevDate, 1) : addMonths(prevDate, 1));
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    setDate(prevDate => direction === 'prev' ? subYears(prevDate, 1) : addYears(prevDate, 1));
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="calendar-container">
      <div className="controls flex justify-center items-center my-4">
      <button
          onClick={() => handleYearChange('prev')}
          className="btn-year-month mx-2 p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none flex items-center"
          aria-label="Previous Year"
        >
          <AiOutlineDoubleLeft size={20} />
          <span className="ml-2 text-sm">Previous Year</span>
        </button>
        <button
          onClick={() => handleMonthChange('prev')}
          className="btn-year-month mx-2 p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none flex items-center"
          aria-label="Previous Month"
        >
          <AiOutlineLeft size={20} />
          <span className="ml-2 text-sm">Previous Month</span>
        </button>
        <span className="text-xl font-semibold mx-4">
          {format(date, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => handleMonthChange('next')}
          className="btn-year-month mx-2 p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none flex items-center"
          aria-label="Next Month"
        >
          <AiOutlineRight size={20} />
          <span className="ml-2 text-sm">Next Month</span>
        </button>
        <button
          onClick={() => handleYearChange('next')}
          className="btn-year-month mx-2 p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none flex items-center"
          aria-label="Next Year"
        >
          <AiOutlineDoubleRight size={20} />
          <span className="ml-2 text-sm">Next Year</span>
        </button>
      </div>
      {isModalOpen && (
        <CalendarModal selectedEvents={selectedEvents} onClose={handleCloseModal} />
      )}
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-[#1e5695] text-white">
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => (
                <th
                  key={index}
                  className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5"
                >
                  <span className="hidden lg:block">{day}</span>
                  <span className="block lg:hidden">{day.substring(0, 3)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, weekIndex) => (
              <tr key={weekIndex} className="grid grid-cols-7">
                {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map(day => (
                  <td
                    key={day.toString()}
                    className={`relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 ${
                      events.some(event => event.dates.some(date => format(date, 'MM/dd/yyyy') === format(day, 'MM/dd/yyyy'))) ? 'bg-orange-500' : ''
                    } ${format(day, 'MM/yyyy') === format(date, 'MM/yyyy') && format(day, 'dd') === format(date, 'dd')
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    <span className="font-medium text-black dark:text-white">{format(day, 'd')}</span>
                    {events.some(event => event.dates.some(date => format(date, 'MM/dd/yyyy') === format(day, 'MM/dd/yyyy'))) && (
                      <div className="event-info absolute right-2 top-2 text-xs text-gray-600 bg-white p-1 rounded">
                        <span className="font-semibold text-black dark:text-white">
                          Voir détails
                        </span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendrier;
