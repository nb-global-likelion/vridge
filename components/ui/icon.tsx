import Image from 'next/image';

type IconProps = {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
};

export function Icon({ name, size = 24, className, alt = '' }: IconProps) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      width={size}
      height={size}
      alt={alt}
      className={className}
      unoptimized
    />
  );
}
