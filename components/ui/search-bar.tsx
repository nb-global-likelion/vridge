import { Icon } from './icon';

type SearchBarProps = {
  variant?: 'main' | 'skills';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const VARIANT_CLASS = {
  main: 'h-[50px] rounded-[60px] border border-[#b3b3b3] bg-white px-[20px]',
  skills: 'h-[52px] rounded-[999px] bg-[#fbfbfb] px-[20px] pl-[54px]',
} as const;

export function SearchBar({
  variant = 'main',
  value,
  onChange,
  placeholder,
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      {variant === 'skills' && (
        <span className="pointer-events-none absolute top-1/2 left-[16px] -translate-y-1/2">
          <Icon name="search" size={24} />
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full bg-transparent outline-none placeholder:text-[#999]',
          variant === 'skills'
            ? 'text-[14px] leading-[1.5] font-bold tracking-[0.4354px]'
            : 'text-[16px] leading-normal font-normal',
          value ? 'text-[#333]' : 'text-[#999]',
          VARIANT_CLASS[variant],
        ].join(' ')}
      />
    </div>
  );
}
