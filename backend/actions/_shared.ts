import { ZodError } from 'zod';
import { DomainError } from '@/backend/domain/errors';

export type ActionError = {
  errorCode: string;
  errorKey: string;
  errorMessage?: string;
};

export function domainErrorToActionError(error: DomainError): ActionError {
  return {
    errorCode: error.code,
    errorKey: error.key,
    errorMessage: error.message,
  };
}

export function handleActionError(
  error: unknown,
  options?: {
    zodErrorKey?: string;
    zodErrorCode?: string;
  }
): ActionError {
  if (error instanceof DomainError) {
    return domainErrorToActionError(error);
  }

  if (error instanceof ZodError) {
    return {
      errorCode: options?.zodErrorCode ?? 'INVALID_INPUT',
      errorKey: options?.zodErrorKey ?? 'error.inputInvalid',
      errorMessage: error.issues.map((item) => item.message).join(', '),
    };
  }

  throw error;
}
