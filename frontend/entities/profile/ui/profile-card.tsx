'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { Icon } from '@/frontend/components/ui/icon';
import { PostStatus } from '@/frontend/components/ui/post-status';
import { useI18n } from '@/shared/i18n/client';

type Props = {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phone?: string | null;
  email?: string | null;
  location?: string | null;
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
  aboutMe,
  isOpenToWork = false,
  profileImageUrl,
  mode = 'myPage',
  statusAccessory,
}: Props) {
  const { locale, t } = useI18n();
  const summary = aboutMe?.trim();
  const statusLabel = isOpenToWork
    ? t('profile.openToWork')
    : t('profile.notOpenToWork');
  const isMyProfile = mode === 'myProfile';

  return (
    <div
      className={[
        'rounded-[20px] bg-bg px-[40px]',
        isMyProfile
          ? 'flex flex-col gap-[25px] pt-[20px] pb-[40px]'
          : 'py-[20px]',
      ].join(' ')}
    >
      {isMyProfile && (
        <h2 className="text-h2 text-gray-950">{t('profile.basicProfile')}</h2>
      )}
      <div className="flex items-center gap-[25px]">
        <div className="flex flex-col items-center gap-[10px]">
          <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                width={200}
                height={200}
                alt={t('profile.image.userAlt', {
                  name: `${firstName} ${lastName}`.trim(),
                })}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <Icon
                name="profile"
                size={80}
                alt={t('profile.image.defaultAlt')}
              />
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
            <h2 className="text-title text-gray-950">
              {firstName} {lastName}
            </h2>
            {dateOfBirth && (
              <span className="text-body-2 text-gray-600">
                {formatDob(dateOfBirth, locale)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[6px] text-body-2 text-gray-800">
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
            <p className="text-body-1 text-gray-800">{summary ?? ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
