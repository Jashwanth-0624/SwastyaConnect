import React from 'react';

export function Label({ className = '', children, ...props }) {
  return (
    <label
      className={`
        text-sm font-medium leading-none peer-disabled:cursor-not-allowed
        peer-disabled:opacity-70 text-gray-900
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
}

