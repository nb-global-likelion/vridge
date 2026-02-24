'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Icon } from './icon';
import { useI18n } from '@/shared/i18n/client';

type DatePickerProps = {
  type?: 'full' | 'month';
  value?: Date;
  onChange: (date: Date) => void;
  required?: boolean;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatDate(date: Date, type: 'full' | 'month') {
  const d = date.getUTCDate();
  const m = date.getUTCMonth() + 1;
  const y = date.getUTCFullYear();
  return type === 'full' ? `${pad(d)}.${pad(m)}.${y}` : `${pad(m)}.${y}`;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 50 }, (_, i) => 2030 - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function ScrollColumn({
  items,
  selected,
  onSelect,
  widthClass,
  format,
}: {
  items: number[];
  selected: number;
  onSelect: (v: number) => void;
  widthClass: string;
  format?: (v: number) => string;
}) {
  return (
    <div
      className={`scroll scrollbar-thin flex h-[194px] flex-col gap-[10px] overflow-y-auto ${widthClass}`}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`flex h-[41px] w-full items-center justify-center rounded-[5px] px-[10px] text-center text-caption-1 ${
            item === selected
              ? 'font-medium text-brand'
              : 'text-gray-800 hover:bg-brand-sub hover:text-brand'
          }`}
          onClick={() => onSelect(item)}
        >
          {format ? format(item) : item}
        </button>
      ))}
    </div>
  );
}

export function DatePicker({
  type = 'full',
  value,
  onChange,
  required = false,
}: DatePickerProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const now = useMemo(() => new Date(), []);
  const [selDay, setSelDay] = useState(
    value ? value.getUTCDate() : now.getUTCDate()
  );
  const [selMonth, setSelMonth] = useState(
    value ? value.getUTCMonth() + 1 : now.getUTCMonth() + 1
  );
  const [selYear, setSelYear] = useState(
    value ? value.getUTCFullYear() : now.getUTCFullYear()
  );

  const monthLabels = useMemo(
    () =>
      MONTHS.map((month) => t(`datePicker.month.${month}` as const)).map(
        String
      ),
    [t]
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

  const hasValue = !!value;
  const placeholder =
    type === 'full'
      ? t('datePicker.placeholder.full')
      : t('datePicker.placeholder.month');
  const triggerWidthClass = type === 'full' ? 'min-w-[150px]' : 'min-w-[126px]';

  function handleSelect() {
    const date = new Date(
      Date.UTC(selYear, selMonth - 1, type === 'full' ? selDay : 1)
    );
    onChange(date);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={`flex h-[52px] items-center justify-between rounded-[10px] px-[20px] text-left ${triggerWidthClass} ${
          hasValue
            ? 'border border-gray-300 bg-white text-gray-800'
            : 'bg-bg text-gray-600'
        }`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-caption-1">
          {hasValue ? formatDate(value, type) : placeholder}
        </span>
        {required && <Icon name="required" size={24} />}
      </button>
      {open && (
        <div className="absolute top-[57px] left-0 z-10 rounded-[10px] bg-white px-[20px] py-[10px] shadow-[0_0_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-[10px] overflow-hidden">
            {type === 'full' && (
              <>
                <ScrollColumn
                  items={DAYS}
                  selected={selDay}
                  onSelect={setSelDay}
                  widthClass="w-[37px]"
                  format={pad}
                />
              </>
            )}
            <ScrollColumn
              items={MONTHS}
              selected={selMonth}
              onSelect={setSelMonth}
              widthClass="w-[81px]"
              format={(month) => monthLabels[month - 1]}
            />
            <ScrollColumn
              items={YEARS}
              selected={selYear}
              onSelect={setSelYear}
              widthClass="w-[57px]"
            />
          </div>
          <div className="mt-[10px] flex justify-end">
            <button
              type="button"
              className="rounded-[60px] bg-brand px-[10px] py-[5px] text-center text-body-2 text-white"
              onClick={handleSelect}
            >
              {t('datePicker.select')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
