type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-[16px] w-[32px] rounded-[999px] transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#ff6000]/40 ${
        checked ? 'bg-[#00a600]' : 'bg-[#e6e6e6]'
      }`}
    >
      <span
        className={`absolute top-px h-[14px] w-[14px] rounded-full bg-white transition-[left] duration-150 ${
          checked ? 'left-[17px]' : 'left-px'
        }`}
      />
    </button>
  );
}
