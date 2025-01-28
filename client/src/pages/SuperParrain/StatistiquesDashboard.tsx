import React, { useEffect, useState } from 'react';

import {  UserCircleIcon, UserGroupIcon, CalendarIcon, CheckCircleIcon, HandRaisedIcon, BuildingOffice2Icon, ChatBubbleBottomCenterTextIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import axiosInstance from '../../axiosInstance';
import StatCard from '../../components/Charts/StatCard';
import ChartThree from '../../components/Charts/ChartThree';
import ChartOne from '../../components/Charts/ChartOne';

const StatistiquesDashboard: React.FC = () => {
  const [stats, setStats] = useState<{
    nombreUtilisateurs: number;
    evenementsValides: number; // Ajouter ce champ
  eventsByDate: Record<string, number>; // Ajouter ce champ
  eventsByStructure: Record<string, number>; // Ajouter ce champ
  structureWithMostEvents: string; // Ajouter ce champ
  totalEvenements: number; // Ajouter ce champ
  totalEvenementsExternes: number;
  totalParrains: number; // Ajouter ce champ
  totalPresidents: number; // Ajouter ce champ
  totalStructures: number; // Ajouter ce champ
  dates: string[];
  nombresDate: number[];
  }>({
    nombreUtilisateurs: 0,
    evenementsValides: 0, // Initialiser
  eventsByDate: {}, // Initialiser
  eventsByStructure: {}, // Initialiser
  structureWithMostEvents: '', // Initialiser
  totalEvenements: 0, // Initialiser
  totalEvenementsExternes: 0,
  totalParrains: 0, // Initialiser
  totalPresidents: 0, // Initialiser
  totalStructures: 0, // Initialiser
  dates: [],
  nombresDate: [],

  });

  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableYears = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/statistiques/years');
      setAvailableYears(response.data || []);
    } catch (error) {
      setError('Erreur lors de la récupération des années disponibles.');
    } finally {
      setLoading(false);
    }
  };
 // Convertir dates et nombresDate en tableau d'objets pour tri
 const datesWithCounts = stats.dates.map((date, index) => ({
  date,
  count: stats.nombresDate[index] || 0
}));
  // Trier par date
  datesWithCounts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

     // Extract sorted dates and counts
     const sortedDates = datesWithCounts.map(item => item.date);
     const sortedCounts = datesWithCounts.map(item => item.count);

   const seriesData = [
     {
       name: "Evenements",
       data: sortedCounts
     }
   ];

   useEffect(() => {
    fetchAvailableYears();
  }, []);
  useEffect(() => {
    if (selectedYear) {
      fetchData(selectedYear);
    }
  }, [selectedYear]);
  const fetchData = async (year: string) => {
    setLoading(true);
    try {
  
      const response = await axiosInstance.get('/api/statistiques', {  params: { year } });
      const data = response.data || {};


      setStats({
        nombreUtilisateurs: data.nombreUtilisateurs || 0,
        evenementsValides: data.evenementsValides || 0,
        eventsByDate: data.eventsByDate || {},
        eventsByStructure: data.eventsByStructure || {},
        structureWithMostEvents: data.structureWithMostEvents || '',
        totalEvenements: data.totalEvenements || 0,
        totalEvenementsExternes: data.totalEvenementsExternes || 0,
        totalParrains: data.totalParrains || 0,
        totalPresidents: data.totalPresidents || 0,
        totalStructures: data.totalStructures || 0,
        dates: data.dates || [],
        nombresDate: data.nombresDate || [],
      });
    } catch (error) {
      setError('Erreur lors de la récupération des statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchData(selectedYear);
    }
  }, [selectedYear]);



  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Dashboard des Statistiques</h1>
      <div className="mb-4">
  <label htmlFor="year" className="block text-xs font-medium text-gray-600">Sélectionner l'année:</label>
  <div className="relative mt-1">
    <select
      id="year"
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
      className="block w-32 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs py-1 px-2 appearance-none pr-8"
    >
      <option value="" disabled>Sélectionner une année</option>
      {availableYears.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2">
      <svg
        className="w-3 h-3 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M6.293 9.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
</div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 mb-6">
      <StatCard
    icon={<UserCircleIcon className="w-8 h-8 text-custom-red" />} // Utilisez un icône approprié
    title="Total Utilisateurs"
    value={stats.nombreUtilisateurs}
  />
         <StatCard
    icon={<CheckCircleIcon  className="w-8 h-8 text-custom-blue" />} // Utilisez un icône approprié
    title="Événements Validés"
    value={stats.evenementsValides}
  />
  <StatCard
    icon={<CalendarIcon  className="w-8 h-8 text-custom-green" />} // Utilisez un icône approprié
    title="Total Événements"
    value={stats.totalEvenements}
  />
   <StatCard
    icon={<CalendarIcon  className="w-8 h-8 text-custom-green" />} // Utilisez un icône approprié
    title="Total Événements Externes"
    value={stats.totalEvenementsExternes}
  />
  <StatCard
    icon={<UserGroupIcon className="w-8 h-8 text-custom-red" />} // Utilisez un icône approprié
    title="Total Parrains"
    value={stats.totalParrains}
  />
  <StatCard
    icon={<UserGroupIcon  className="w-8 h-8 text-custom-yellow" />} // Utilisez un icône approprié
    title="Total Présidents"
    value={stats.totalPresidents}
  />
  <StatCard
    icon={<Squares2X2Icon     className="w-8 h-8 text-custom-blue" />} // Utilisez un icône approprié
    title="Total Structures"
    value={stats.totalStructures}
  />
</div>

<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
  <div className="flex-1">
    <ChartOne
       series={seriesData}            
       labels={sortedDates}
      title="Événements par Date"
    />
  </div>
  <div className="flex-1">
    <ChartThree
      series={Object.values(stats.eventsByStructure)}
      labels={Object.keys(stats.eventsByStructure)}
      title="Événements par Structure"
    />
  </div>
      </div>
    </div>
  );
};

export default StatistiquesDashboard;
