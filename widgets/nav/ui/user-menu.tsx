'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/lib/infrastructure/auth-client';
import { useI18n } from '@/lib/i18n/client';

interface UserMenuProps {
  name: string;
  email: string;
  image?: string | null;
}

export default function UserMenu({ name, email, image }: UserMenuProps) {
  const router = useRouter();
  const { t } = useI18n();

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-[60px] w-[60px] items-center justify-center rounded-[80px] bg-white shadow-[0_0_15px_rgba(255,149,84,0.2)] outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-[32px] w-[32px] cursor-pointer">
            <AvatarImage src={image ?? undefined} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/candidate/profile')}>
          {t('nav.myProfile')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/candidate/applications')}
        >
          {t('nav.myJobs')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            signOut({ fetchOptions: { onSuccess: () => router.push('/jobs') } })
          }
          className="text-destructive focus:text-destructive"
        >
          {t('nav.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
