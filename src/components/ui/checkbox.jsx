import React from 'react';
import { Check } from 'lucide-react';

export function Checkbox({ checked, onCheckedChange, className = '', ...props }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`
        peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950
        focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? 'bg-gray-900 text-white' : 'bg-white'}
        ${className}
      `}
      {...props}
    >
      {checked && <Check className="h-4 w-4" />}
    </button>
  );
}

