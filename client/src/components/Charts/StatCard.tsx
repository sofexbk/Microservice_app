import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
    <div className="text-3xl mr-4 text-custom-blue">{icon}</div>
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default StatCard;
