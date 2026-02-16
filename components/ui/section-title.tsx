import { Icon } from './icon';

type SectionTitleProps = {
  title: string;
  onAdd?: () => void;
};

export function SectionTitle({ title, onAdd }: SectionTitleProps) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex min-h-[32px] items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#1a1a1a]">{title}</h2>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex size-[32px] items-center justify-center"
          >
            <Icon name="plus" size={20} />
          </button>
        )}
      </div>
      <div className="h-px w-full bg-[#b3b3b3]" />
    </div>
  );
}
