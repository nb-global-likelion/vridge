'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { PostStatus } from '@/components/ui/post-status';
import { ToggleSwitch } from '@/components/ui/toggle-switch';

type Props = {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  headline?: string | null;
  variant?: 'profile' | 'page';
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDob(date: Date) {
  const d = date.getUTCDate();
  const m = MONTHS[date.getUTCMonth()];
  const y = date.getUTCFullYear();
  return `${String(d).padStart(2, '0')}. ${m}. ${y}`;
}

export function ProfileCard({
  firstName,
  lastName,
  dateOfBirth,
  phone,
  email,
  city,
  headline,
  variant = 'profile',
}: Props) {
  const [openToWork, setOpenToWork] = useState(true);

  return (
    <div className="rounded-[20px] bg-[#fbfbfb] px-[40px] py-[30px]">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-[200px] w-[200px] items-center justify-center rounded-full bg-[#e6e6e6]">
            <Icon name="profile" size={80} alt="Profile photo" />
          </div>
          <div className="flex items-center gap-2">
            <PostStatus status="recruiting" label="Open to Work" size="sm" />
            {variant === 'page' && (
              <ToggleSwitch checked={openToWork} onChange={setOpenToWork} />
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <h2 className="text-[30px] font-bold text-[#1a1a1a]">
            {firstName} {lastName}
          </h2>
          {dateOfBirth && (
            <span className="text-[14px] text-[#808080]">
              {formatDob(dateOfBirth)}
            </span>
          )}

          <div className="flex flex-col gap-1 text-[14px] text-[#4c4c4c]">
            {phone && (
              <span className="inline-flex items-center gap-2">
                <Icon name="mobile" size={16} />
                {phone}
              </span>
            )}
            {email && (
              <span className="inline-flex items-center gap-2">
                <Icon name="mail" size={16} />
                {email}
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-2">
                <Icon name="location" size={16} />
                {city}
              </span>
            )}
          </div>

          {headline && (
            <div className="rounded-[10px] bg-white p-[20px] text-[14px] text-[#333]">
              {headline}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
