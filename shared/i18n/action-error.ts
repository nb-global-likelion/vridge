import type { ActionError } from '@/backend/actions/_shared';
import type { Translator } from './types';

export function getActionErrorMessage(
  error: ActionError,
  t: Translator
): string {
  const translated = t(error.errorKey);
  if (translated !== error.errorKey) return translated;
  return error.errorMessage ?? translated;
}
