import React from 'react';

const badgeVariants = {
  default: 'bg-gray-900 text-white',
  secondary: 'bg-gray-100 text-gray-900',
  outline: 'border border-gray-300 bg-transparent',
};

export function Badge({ className = '', variant = 'default', children, ...props }) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors
        ${badgeVariants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}

