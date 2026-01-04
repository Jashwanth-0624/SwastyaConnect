import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({ children, value, onValueChange, ...props }) {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val, label) => {
    onValueChange(val);
    setSelectedLabel(label);
    setOpen(false);
  };

  return (
    <div className="relative" ref={selectRef} {...props}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { open, setOpen, value, selectedLabel });
        }
        if (child.type === SelectContent) {
          return open ? React.cloneElement(child, { handleSelect, value }) : null;
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({ children, open, setOpen, value, selectedLabel, className = '', ...props }) {
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`
        flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
        ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2
        focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      <span className={value || selectedLabel ? 'text-gray-900' : 'text-gray-500'}>
        {selectedLabel || value || children || 'Select...'}
      </span>
      <ChevronDown className={`h-4 w-4 transition-transform text-gray-500 ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}

export function SelectContent({ children, handleSelect, value, className = '', ...props }) {
  return (
    <div
      className={`
        absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200
        bg-white p-1 shadow-lg
        ${className}
      `}
      {...props}
    >
      {React.Children.map(children, child => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, { handleSelect, selected: child.props.value === value });
        }
        return child;
      })}
    </div>
  );
}

export function SelectItem({ children, value, handleSelect, selected, className = '', ...props }) {
  return (
    <div
      onClick={() => handleSelect(value, children)}
      className={`
        relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm
        outline-none hover:bg-gray-100 focus:bg-gray-100 text-gray-900
        ${selected ? 'bg-gray-100 font-medium' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder, value, children }) {
  // This is just a placeholder component - the actual value is handled by SelectTrigger
  return null;
}

