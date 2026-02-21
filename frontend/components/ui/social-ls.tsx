import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/frontend/lib/utils';
import { Icon } from '@/frontend/components/ui/icon';

type SocialProvider = 'google' | 'facebook' | 'email';

type SocialLsProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  provider: SocialProvider;
  label: string;
};

const PROVIDER_META: Record<
  SocialProvider,
  { iconName: string; iconSize: number; circle: boolean }
> = {
  google: {
    iconName: 'google',
    iconSize: 32,
    circle: true,
  },
  facebook: {
    iconName: 'facebook',
    iconSize: 32,
    circle: true,
  },
  email: {
    iconName: 'email-at',
    iconSize: 32,
    circle: false,
  },
};

export function SocialLs({
  provider,
  label,
  className,
  ...props
}: SocialLsProps) {
  const meta = PROVIDER_META[provider];

  return (
    <button
      type="button"
      className={cn(
        'flex h-[60px] w-full items-center justify-center overflow-hidden rounded-[10px] border border-[#b3b3b3] bg-white px-[10px] py-[20px] text-[#333]',
        className
      )}
      {...props}
    >
      <span className="flex w-[254px] items-center gap-[20px]">
        {meta.circle ? (
          <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white">
            <Icon name={meta.iconName} size={meta.iconSize} alt={provider} />
          </span>
        ) : (
          <Icon name={meta.iconName} size={meta.iconSize} alt={provider} />
        )}
        <span className="text-center text-[18px] leading-[1.5] font-medium text-[#333]">
          {label}
        </span>
      </span>
    </button>
  );
}
