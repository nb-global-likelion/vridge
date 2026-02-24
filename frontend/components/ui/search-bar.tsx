import { Icon } from './icon';

type SearchBarProps = {
  variant?: 'main' | 'skills';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const VARIANT_CLASS = {
  main: 'h-[50px] rounded-[60px] border border-gray-300 bg-white px-[20px]',
  skills: 'h-[52px] rounded-[999px] bg-bg px-[20px] pl-[54px]',
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
          'w-full bg-transparent outline-none placeholder:text-gray-400',
          variant === 'skills'
            ? 'text-caption-1 font-bold tracking-[0.4354px]'
            : 'text-body-2 font-normal',
          value ? 'text-gray-800' : 'text-gray-400',
          VARIANT_CLASS[variant],
        ].join(' ')}
      />
    </div>
  );
}
