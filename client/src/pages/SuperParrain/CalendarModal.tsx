import React from 'react';
import { format } from 'date-fns';

interface Event {
  id: number;
  dates: Date[]; // Liste des dates
  intitule: string;
  structureName: string;
}

interface ModalProps {
  selectedEvents: Event[];
  onClose: () => void;
}

const CalendarModal: React.FC<ModalProps> = ({ selectedEvents, onClose }) => {
  if (selectedEvents.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
        <h3 className="text-lg font-semibold mb-4">Événements sélectionnés:</h3>
        <ul>
          {selectedEvents.map(event => (
            <li key={event.id} className="mb-4">
              <div>
                <span className="font-semibold">Dates:</span>
                <ul className="ml-4">
                  {event.dates.map(date => (
                    <li key={date.toString()}>{format(date, 'dd MMM yyyy')}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Intitulé:</span> {event.intitule}
              </div>
              <div>
                <span className="font-semibold">Structure:</span> {event.structureName}
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default CalendarModal;
