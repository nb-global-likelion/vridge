'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/icon';
import { PostStatus } from '@/components/ui/post-status';
import { useI18n } from '@/lib/i18n/client';

type Props = {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phone?: string | null;
  email?: string | null;
  location?: string | null;
  headline?: string | null;
  aboutMe?: string | null;
  isOpenToWork?: boolean;
  profileImageUrl?: string | null;
  mode?: 'myPage' | 'myProfile';
  statusAccessory?: ReactNode;
};

function formatDob(date: Date, locale: string) {
  const day = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
  const month = new Intl.DateTimeFormat(locale, {
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
  const year = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  return `${day}. ${month}. ${year}`;
}

export function ProfileCard({
  firstName,
  lastName,
  dateOfBirth,
  phone,
  email,
  location,
  headline,
  aboutMe,
  isOpenToWork = false,
  profileImageUrl,
  mode = 'myPage',
  statusAccessory,
}: Props) {
  const { locale, t } = useI18n();
  const summary = aboutMe?.trim() || headline?.trim();
  const statusLabel = isOpenToWork
    ? t('profile.openToWork')
    : t('profile.notOpenToWork');
  const isMyProfile = mode === 'myProfile';

  return (
    <div
      className={[
        'rounded-[20px] bg-[#fbfbfb] px-[40px]',
        isMyProfile
          ? 'flex flex-col gap-[25px] pt-[20px] pb-[40px]'
          : 'py-[20px]',
      ].join(' ')}
    >
      {isMyProfile && (
        <h2 className="text-[22px] leading-[1.5] font-bold text-[#1a1a1a]">
          {t('profile.basicProfile')}
        </h2>
      )}
      <div className="flex items-center gap-[25px]">
        <div className="flex flex-col items-center gap-[10px]">
          <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-full bg-[#e6e6e6]">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                width={200}
                height={200}
                alt={`${firstName} ${lastName} profile image`}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <Icon name="profile" size={80} alt="Profile photo" />
            )}
          </div>
          <div className="flex items-center gap-[7px]">
            <PostStatus
              status={isOpenToWork ? 'recruiting' : 'done'}
              label={statusLabel}
              size="md"
            />
            {mode === 'myPage' && statusAccessory}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[20px]">
          <div className="flex flex-col pb-px">
            <h2 className="text-[30px] leading-[1.5] font-bold text-[#1a1a1a]">
              {firstName} {lastName}
            </h2>
            {dateOfBirth && (
              <span className="text-[16px] leading-[1.5] font-medium text-[#666]">
                {formatDob(dateOfBirth, locale)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[6px] text-[16px] leading-[1.5] font-medium text-[#333]">
            <div className="flex flex-wrap items-center gap-[25px]">
              {phone && (
                <span className="inline-flex items-center gap-[4px]">
                  <Icon name="mobile" size={24} />
                  {phone}
                </span>
              )}
              {email && (
                <span className="inline-flex items-center gap-[4px]">
                  <Icon name="mail" size={24} />
                  {email}
                </span>
              )}
            </div>
            {location && (
              <span className="inline-flex items-center gap-[4px]">
                <Icon name="location" size={24} />
                {location}
              </span>
            )}
          </div>

          <div className="rounded-[10px] bg-white p-[20px]">
            <p className="text-[18px] leading-[1.5] font-medium text-[#333]">
              {summary ?? ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
