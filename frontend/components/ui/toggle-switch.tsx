type ToggleSwitchSize = 'sm' | 'lg';

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: ToggleSwitchSize;
};

const SIZE_CONFIG: Record<
  ToggleSwitchSize,
  { track: string; thumb: string; thumbChecked: string }
> = {
  sm: {
    track: 'h-[14px] w-[28px]',
    thumb: 'h-[12px] w-[12px]',
    thumbChecked: 'right-px',
  },
  lg: {
    track: 'h-[16px] w-[32px]',
    thumb: 'h-[14px] w-[14px]',
    thumbChecked: 'left-[17px]',
  },
};

export function ToggleSwitch({
  checked,
  onChange,
  size = 'lg',
}: ToggleSwitchProps) {
  const config = SIZE_CONFIG[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative rounded-[999px] transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${config.track} ${
        checked ? 'bg-success' : 'bg-gray-100'
      }`}
    >
      <span
        className={`absolute top-px rounded-full bg-white transition-[left,right] duration-150 ${config.thumb} ${
          checked ? config.thumbChecked : 'left-px'
        }`}
      />
    </button>
  );
}
