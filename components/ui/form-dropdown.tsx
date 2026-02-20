'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from './icon';

type Option = { label: string; value: string };

type FormDropdownProps = {
  value?: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function DropdownMenu({
  label,
  onSelect,
}: {
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className="w-full rounded-[5px] px-[20px] py-[10px] text-left text-[14px] font-medium text-[#333] hover:bg-[#ffefe5] hover:text-[#ff6000]"
      onClick={onSelect}
    >
      {label}
    </button>
  );
}

function DropdownBox({
  options,
  onSelect,
}: {
  options: Option[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="absolute z-10 mt-1 w-full rounded-[10px] bg-white p-[10px] shadow-[0_0_10px_rgba(0,0,0,0.05)]">
      {options.map((opt) => (
        <DropdownMenu
          key={opt.value}
          label={opt.label}
          onSelect={() => onSelect(opt.value)}
        />
      ))}
    </div>
  );
}

export function FormDropdown({
  value,
  options,
  placeholder = '',
  required = false,
  onChange,
}: FormDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = options.find((o) => o.value === value);
  const hasValue = !!selected;

  const triggerClass = `flex h-[52px] w-full items-center justify-between rounded-[10px] px-[20px] text-left ${
    hasValue
      ? 'bg-white border border-[#b3b3b3] text-[#333]'
      : 'bg-[#fbfbfb] text-[#666]'
  }`;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        className={triggerClass}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className={
            hasValue ? 'text-[16px] font-medium' : 'text-[14px] font-medium'
          }
        >
          {selected ? selected.label : placeholder}
        </span>
        <span className="flex items-center gap-[4px]">
          {required && <Icon name="required" size={10} />}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={24} />
        </span>
      </button>
      {open && (
        <DropdownBox
          options={options}
          onSelect={(nextValue) => {
            onChange(nextValue);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
