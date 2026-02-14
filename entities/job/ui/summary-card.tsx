import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { EMPLOYMENT_TYPE_LABELS } from '@/entities/profile/ui/_utils';
import { WORK_ARRANGEMENT_LABELS } from '@/entities/job/ui/_utils';

type Props = {
  jobDisplayNameEn: string;
  employmentType: string;
  workArrangement: string;
  skills: { skill: { displayNameEn: string } }[];
  onApply?: () => void;
};

export function SummaryCard({
  jobDisplayNameEn,
  employmentType,
  workArrangement,
  skills,
  onApply,
}: Props) {
  return (
    <div className="w-[300px] rounded-[20px] border border-[#b3b3b3] bg-white px-[20px] py-[40px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-[14px] text-[#4c4c4c]">
          <span className="inline-flex items-center gap-2">
            <Icon name="jobs" size={16} />
            {jobDisplayNameEn}
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon name="location" size={16} />
            {WORK_ARRANGEMENT_LABELS[workArrangement] ?? workArrangement}
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon name="experience" size={16} />
            {EMPLOYMENT_TYPE_LABELS[employmentType] ?? employmentType}
          </span>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map(({ skill }) => (
              <Chip
                key={skill.displayNameEn}
                label={skill.displayNameEn}
                variant="displayed"
                size="sm"
              />
            ))}
          </div>
        )}

        <Button
          variant="brand"
          size="brand-md"
          className="w-full"
          onClick={onApply}
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
}
