import React from 'react';
import { BsArrowUpRight } from 'react-icons/bs';

// Define the props interface for the CategoryCard component
interface CategoryCardProps {
  icon: React.ReactNode; // ReactNode type is used for React elements or components
  title: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title }) => {
  return (
    <div className='category bg-white p-4 shadow-lg rounded-md flex items-center gap-4 justify-between border border-transparent hover:border-[#3c50e0] hover:cursor-pointer group/edit'>
        <div className="flex gap-4">
            {icon}
            <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div className="rounded-lg p-3 group-hover/edit">
            <BsArrowUpRight size={30} style={{ color:'#3c50e0' }} className='icon'/>
        </div>
    </div>
  );
}

export default CategoryCard;
