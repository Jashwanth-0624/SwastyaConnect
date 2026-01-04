import React from 'react';

const buttonVariants = {
  default: 'bg-gray-900 text-white hover:bg-gray-800',
  outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900',
  ghost: 'hover:bg-gray-100 text-gray-900',
  link: 'text-blue-600 underline-offset-4 hover:underline',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

export function Button({ 
  className = '', 
  variant = 'default', 
  size = 'default',
  children, 
  disabled,
  ...props 
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

