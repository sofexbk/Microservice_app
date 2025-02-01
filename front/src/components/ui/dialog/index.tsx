// src/components/ui/dialog/index.tsx
import React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative z-50 w-full max-w-md p-6 bg-white dark:bg-boxdark rounded-lg shadow-lg mx-4 ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mb-6">{children}</div>;
};

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h3 className="text-xl font-semibold text-black dark:text-white">{children}</h3>;
};

export const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ 
  htmlFor, 
  children 
}) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className="block mb-2 text-sm font-medium text-black dark:text-white"
    >
      {children}
    </label>
  );
};