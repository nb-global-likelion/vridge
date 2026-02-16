import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

type SocialProvider = 'google' | 'facebook' | 'email';

type SocialLsProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  provider: SocialProvider;
  actionLabel: string;
};

const PROVIDER_META: Record<
  SocialProvider,
  { iconName: string; suffix: string; iconSize: number; circle: boolean }
> = {
  google: {
    iconName: 'google',
    suffix: 'with Google',
    iconSize: 32,
    circle: true,
  },
  facebook: {
    iconName: 'facebook',
    suffix: 'with Facebook',
    iconSize: 32,
    circle: true,
  },
  email: {
    iconName: 'email-at',
    suffix: 'with E-mail',
    iconSize: 32,
    circle: false,
  },
};

export function SocialLs({
  provider,
  actionLabel,
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
        <span className="flex items-center gap-[5px] text-center text-[18px] leading-[1.5] font-medium text-[#333]">
          <span>{actionLabel}</span>
          <span>{meta.suffix}</span>
        </span>
      </span>
    </button>
  );
}
