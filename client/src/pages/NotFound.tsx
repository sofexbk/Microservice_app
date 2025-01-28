import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">The page you're looking for does not exist.</p>
      <button 
        onClick={handleGoBack}
        className="text-lg text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-500 rounded px-4 py-2 transition-colors duration-300"
      >
        Go Back
      </button>
    
    </div>
  );
};

export default NotFound;
