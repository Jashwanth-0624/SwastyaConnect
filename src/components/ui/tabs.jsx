import React, { createContext, useContext } from 'react';

const TabsContext = createContext();

export function Tabs({ value, onValueChange, children, className = '' }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = '' }) {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isActive = selectedValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium
        ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none
        disabled:opacity-50
        ${isActive ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-900'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }) {
  const { value: selectedValue } = useContext(TabsContext);
  
  if (selectedValue !== value) return null;

  return (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none ${className}`}>
      {children}
    </div>
  );
}

