import Image from 'next/image';
import { Icon } from '@/components/ui/icon';
import { PostStatus } from '@/components/ui/post-status';

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
  location,
  headline,
  aboutMe,
  isOpenToWork = false,
  profileImageUrl,
}: Props) {
  return (
    <div className="rounded-[20px] bg-[#fbfbfb] px-[40px] py-[30px]">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-2">
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
          <PostStatus
            status={isOpenToWork ? 'recruiting' : 'done'}
            label={isOpenToWork ? 'Open to Work' : 'Not Open to Work'}
            size="sm"
          />
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
            {location && (
              <span className="inline-flex items-center gap-2">
                <Icon name="location" size={16} />
                {location}
              </span>
            )}
          </div>

          {aboutMe && <p className="text-[14px] text-[#4c4c4c]">{aboutMe}</p>}

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
