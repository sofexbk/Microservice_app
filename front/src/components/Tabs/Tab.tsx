import React, { useState, ReactNode } from 'react';

interface TabProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick, disabled }) => {
  const baseClasses = 'inline-block p-4 border-b-2 rounded-t-lg';
  const activeClasses = 'text-blue-600 border-blue-600 dark:text-blue-500 dark:text-white';
  const inactiveClasses = 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-white';
  const disabledClasses = 'text-gray-400 cursor-not-allowed dark:text-white';

  return (
    <li className="me-2">
      <button
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${disabled ? disabledClasses : ''}`}
        onClick={onClick}
        disabled={disabled}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </button>
    </li>
  );
};

interface TabsContainerProps {
  children: ReactNode;
}

const TabsContainer: React.FC<TabsContainerProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className=" text-black  text-gray-500  border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement<TabProps>(child)) {
            return React.cloneElement(child, {
              isActive: index === activeTab,
              onClick: () => handleTabClick(index),
            });
          }
          return child;
        })}
      </ul>
      <div className="p-4">
        {React.Children.map(children, (child, index) => {
          if (index === activeTab && React.isValidElement(child)) {
            return child.props.children;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export { TabsContainer, Tab };
