import { Icon } from './icon';

type ChipVariant = 'displayed' | 'searched' | 'selected';
type ChipSize = 'sm' | 'md';

type ChipProps = {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  onRemove?: () => void;
  onSelect?: () => void;
};

const VARIANT_CLASS: Record<ChipVariant, string> = {
  displayed: 'border-[#b3b3b3]',
  searched: 'border-[#b3b3b3] text-[#333] gap-[10px]',
  selected: 'border-[#ff904c] text-[#333] gap-[10px]',
};

const SIZE_CLASS: Record<ChipSize, string> = {
  sm: 'border-[0.5px] px-[8px] py-[6px] rounded-[5px] text-[14px]',
  md: 'border px-[10px] py-[8px] rounded-[8px] text-[16px]',
};

export function Chip({
  label,
  variant = 'displayed',
  size = 'sm',
  onRemove,
  onSelect,
}: ChipProps) {
  const isSelectable = Boolean(onSelect) && variant === 'selected';
  const Tag = isSelectable ? 'button' : 'span';
  const displayedTextClass =
    variant === 'displayed'
      ? size === 'sm'
        ? 'text-[#666]'
        : 'text-[#4c4c4c]'
      : '';

  return (
    <Tag
      data-slot="chip"
      className={`inline-flex items-center justify-center bg-white ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${displayedTextClass}`}
      {...(isSelectable ? { type: 'button' as const, onClick: onSelect } : {})}
    >
      {variant === 'selected' && <Icon name="checked" size={18} />}
      <span>{label}</span>
      {variant === 'searched' && onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="inline-flex size-[18px] items-center justify-center"
        >
          <Icon name="close" size={18} />
        </button>
      )}
    </Tag>
  );
}
