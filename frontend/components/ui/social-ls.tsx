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
    iconSize: 24,
    circle: true,
  },
  facebook: {
    iconName: 'facebook',
    iconSize: 24,
    circle: true,
  },
  email: {
    iconName: 'mail',
    iconSize: 18,
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
        'flex h-[52px] w-full items-center justify-center gap-[10px] overflow-hidden rounded-[10px] border border-gray-300 bg-white px-[90px] py-[20px] text-gray-800',
        className
      )}
      {...props}
    >
      {meta.circle ? (
        <span className="flex size-[32px] items-center justify-center rounded-full bg-white">
          <Icon name={meta.iconName} size={meta.iconSize} alt={provider} />
        </span>
      ) : (
        <Icon name={meta.iconName} size={meta.iconSize} alt={provider} />
      )}
      <span className="text-center text-[15px] text-gray-800">{label}</span>
    </button>
  );
}
