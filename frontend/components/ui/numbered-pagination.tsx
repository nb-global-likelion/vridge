import Link from 'next/link';
import { Icon } from './icon';

type NumberedPaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  prevAriaLabel: string;
  nextAriaLabel: string;
};

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);
  return pages;
}

export function NumberedPagination({
  currentPage,
  totalPages,
  buildHref,
  prevAriaLabel,
  nextAriaLabel,
}: NumberedPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-[22px]">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          aria-label={prevAriaLabel}
          className="flex h-[31px] w-[25px] items-center justify-center"
        >
          <Icon name="chevron-left" size={25} />
        </Link>
      ) : (
        <span
          aria-label={prevAriaLabel}
          className="flex h-[31px] w-[25px] items-center justify-center opacity-30"
        >
          <Icon name="chevron-left" size={25} />
        </span>
      )}

      <div className="flex items-center gap-[30px]">
        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`dots-${i}`}
              className="text-[20px] leading-none text-black"
            >
              ···
            </span>
          ) : p === currentPage ? (
            <span
              key={p}
              className="flex h-[24px] w-[24px] items-center justify-center rounded-[60px] bg-[#ffefe5] text-[20px] leading-none font-normal text-[#ff6000]"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p)}
              className="flex items-center justify-center text-[20px] leading-none font-normal text-black"
            >
              {p}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          aria-label={nextAriaLabel}
          className="flex h-[31px] w-[25px] items-center justify-center"
        >
          <Icon name="chevron-right" size={25} />
        </Link>
      ) : (
        <span
          aria-label={nextAriaLabel}
          className="flex h-[31px] w-[25px] items-center justify-center opacity-30"
        >
          <Icon name="chevron-right" size={25} />
        </span>
      )}
    </nav>
  );
}
