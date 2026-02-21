'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Icon } from './icon';
import { useI18n } from '@/shared/i18n/client';

type FormInputSize = 'sm' | 'md' | 'lg';
type FormInputVariant = 'default' | 'file';

type FormInputProps = {
  size?: FormInputSize;
  filled?: boolean;
  required?: boolean;
  variant?: FormInputVariant;
} & Omit<ComponentPropsWithoutRef<'input'>, 'size'> &
  Omit<ComponentPropsWithoutRef<'textarea'>, 'size'>;

const SIZE_CLASS: Record<FormInputSize, string> = {
  sm: 'h-[41px] px-[20px] py-[10px]',
  md: 'h-[52px] px-[20px]',
  lg: 'h-[130px] p-[20px]',
};

const baseClass =
  'w-full rounded-[10px] text-[16px] text-[#333] placeholder:text-[14px] placeholder:text-[#666] outline-none';

export const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormInputProps
>(function FormInput(
  {
    size = 'md',
    filled = false,
    required = false,
    variant = 'default',
    className,
    ...props
  },
  ref
) {
  const { t } = useI18n();

  if (variant === 'file') {
    const fileText =
      typeof props.value === 'string' && props.value.length > 0
        ? props.value
        : (props.placeholder ?? t('form.fileUpload'));

    return (
      <span
        className={`inline-flex h-[52px] w-full items-center justify-center gap-[5px] rounded-[10px] bg-[#fbfbfb] px-[20px] ${className ?? ''}`}
      >
        <Icon name="plus" size={24} />
        <span className="text-[14px] font-medium text-[#666]">{fileText}</span>
      </span>
    );
  }

  const stateClass = filled
    ? 'bg-white border border-[#b3b3b3]'
    : 'bg-[#fbfbfb]';

  const combinedClass = `${baseClass} ${SIZE_CLASS[size]} ${stateClass} ${className ?? ''}`;

  return (
    <span className="relative inline-flex w-full items-center">
      {size === 'lg' ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={combinedClass}
          {...(props as ComponentPropsWithoutRef<'textarea'>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={combinedClass}
          {...(props as ComponentPropsWithoutRef<'input'>)}
        />
      )}
      {required && (
        <span className="pointer-events-none absolute right-3">
          <Icon name="required" size={10} />
        </span>
      )}
    </span>
  );
});
