'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from './icon';
import type { AppLocale } from '@/shared/i18n/types';

type LangPickerProps = {
  value: AppLocale;
  onChange: (lang: AppLocale) => void;
  options: ReadonlyArray<{ value: AppLocale; label: string }>;
  ariaLabel?: string;
};

export function LangPicker({
  value,
  onChange,
  options,
  ariaLabel,
}: LangPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const ORDER: Record<AppLocale, number> = { vi: 0, ko: 1, en: 2 };
  const sortedOptions = [...options].sort(
    (a, b) => (ORDER[a.value] ?? 99) - (ORDER[b.value] ?? 99)
  );

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
        aria-label={ariaLabel ?? selected?.label ?? value}
        className="flex h-[50px] w-[89px] items-center justify-center gap-[2px] rounded-[80px] bg-white px-[20px] py-[10px] text-body-2 text-black shadow-[0_0_15px_rgba(255,149,84,0.2)]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{selected?.label ?? value.toUpperCase()}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={24} />
      </button>
      {open && (
        <div className="absolute top-[64px] right-0 z-10 w-[80px] rounded-[10px] bg-white py-[10px] shadow-[0_0_15px_rgba(255,149,84,0.2)]">
          {sortedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex w-full items-center justify-center px-[10px] py-[5px] text-body-2 text-black"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
