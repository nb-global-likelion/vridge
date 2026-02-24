'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from './icon';

type DialcodePickerProps = {
  value: string;
  onChange: (code: string) => void;
};

const DIAL_CODES = [
  { code: '+84', flag: 'flag-vn' },
  { code: '+82', flag: 'flag-kr' },
] as const;

export function DialcodePicker({ value, onChange }: DialcodePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = DIAL_CODES.find((option) => option.code === value);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="flex h-[44px] items-center gap-[5px] rounded-[10px] bg-bg px-[15px] py-[10px]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {selected ? (
          <Icon name={selected.flag} size={20} />
        ) : (
          <span className="h-[18px] w-[20px]" />
        )}
        <span className="text-caption-1 text-gray-600">{value}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} />
      </button>
      {open && (
        <div className="absolute top-[48px] left-0 z-10 w-[106px] rounded-[10px] bg-white px-[20px] py-[10px] shadow-[0_0_10px_rgba(0,0,0,0.05)]">
          {DIAL_CODES.map((option) => (
            <button
              key={option.code}
              type="button"
              className="flex w-full items-center gap-[10px] py-[5px] text-left"
              onClick={() => {
                onChange(option.code);
                setOpen(false);
              }}
            >
              <Icon name={option.flag} size={20} />
              <span className="text-caption-1 text-gray-600">
                {option.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
