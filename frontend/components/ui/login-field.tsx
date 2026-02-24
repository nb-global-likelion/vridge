import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/frontend/lib/utils';
import { Icon } from '@/frontend/components/ui/icon';

type LoginFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  filled?: boolean;
  leftIconName?: string;
  leftIconAlt?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
};

export const LoginField = forwardRef<HTMLInputElement, LoginFieldProps>(
  function LoginField(
    {
      filled,
      leftIconName,
      leftIconAlt,
      leftSlot,
      rightSlot,
      className,
      ...props
    },
    ref
  ) {
    const hasValue =
      typeof props.value === 'string'
        ? props.value.length > 0
        : Boolean(filled);

    return (
      <div
        className={cn(
          'flex h-[52px] w-full items-center justify-between overflow-hidden rounded-[10px] border border-gray-300 bg-white px-[20px] py-[10px]',
          className
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-[10px]">
          {leftSlot}
          {!leftSlot && leftIconName && (
            <Icon
              name={leftIconName}
              size={24}
              alt={leftIconAlt ?? leftIconName}
              className="shrink-0"
            />
          )}
          <input
            ref={ref}
            {...props}
            className={cn(
              'w-full bg-transparent text-body-2 outline-none',
              hasValue ? 'text-gray-800' : 'text-gray-400',
              'placeholder:text-body-2 placeholder:text-gray-400'
            )}
          />
        </div>
        {rightSlot}
      </div>
    );
  }
);
