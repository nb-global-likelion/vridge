'use client';

import { useMutation } from '@tanstack/react-query';
import {
  updateProfilePublic,
  updateProfilePrivate,
  addProfileCareer,
  updateProfileCareer,
  deleteProfileCareer,
  addProfileEducation,
  updateProfileEducation,
  deleteProfileEducation,
  addProfileLanguage,
  updateProfileLanguage,
  deleteProfileLanguage,
  addProfileUrl,
  updateProfileUrl,
  deleteProfileUrl,
  addProfileSkill,
  deleteProfileSkill,
  addProfileCertification,
  updateProfileCertification,
  deleteProfileCertification,
} from '@/backend/actions/profile';

async function unwrap<T>(
  p: Promise<{ errorCode: string; errorKey: string; errorMessage?: string } | T>
): Promise<T> {
  const r = await p;
  if (typeof r === 'object' && r !== null && 'errorCode' in r) {
    const actionError = r as {
      errorKey: string;
      errorMessage?: string;
    };
    throw new Error(actionError.errorMessage ?? actionError.errorKey);
  }
  return r as T;
}

export const useUpdateProfilePublic = () =>
  useMutation({ mutationFn: (d: unknown) => unwrap(updateProfilePublic(d)) });

export const useUpdateProfilePrivate = () =>
  useMutation({ mutationFn: (d: unknown) => unwrap(updateProfilePrivate(d)) });

export const useAddCareer = () =>
  useMutation({ mutationFn: (d: unknown) => unwrap(addProfileCareer(d)) });

export const useUpdateCareer = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      unwrap(updateProfileCareer(id, data)),
  });

export const useDeleteCareer = () =>
  useMutation({ mutationFn: (id: string) => unwrap(deleteProfileCareer(id)) });

export const useAddEducation = () =>
  useMutation({ mutationFn: (d: unknown) => unwrap(addProfileEducation(d)) });

export const useUpdateEducation = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      unwrap(updateProfileEducation(id, data)),
  });

export const useDeleteEducation = () =>
  useMutation({
    mutationFn: (id: string) => unwrap(deleteProfileEducation(id)),
  });

export const useAddLanguage = () =>
  useMutation({ mutationFn: (d: unknown) => unwrap(addProfileLanguage(d)) });

export const useUpdateLanguage = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      unwrap(updateProfileLanguage(id, data)),
  });

export const useDeleteLanguage = () =>
  useMutation({
    mutationFn: (id: string) => unwrap(deleteProfileLanguage(id)),
  });

export const useAddUrl = () =>
  useMutation({ mutationFn: (d: unknown) => unwrap(addProfileUrl(d)) });

export const useUpdateUrl = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      unwrap(updateProfileUrl(id, data)),
  });

export const useDeleteUrl = () =>
  useMutation({ mutationFn: (id: string) => unwrap(deleteProfileUrl(id)) });

export const useAddSkill = () =>
  useMutation({
    mutationFn: (skillId: string) => unwrap(addProfileSkill(skillId)),
  });

export const useDeleteSkill = () =>
  useMutation({
    mutationFn: (skillId: string) => unwrap(deleteProfileSkill(skillId)),
  });

export const useAddCertification = () =>
  useMutation({
    mutationFn: (d: unknown) => unwrap(addProfileCertification(d)),
  });

export const useUpdateCertification = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      unwrap(updateProfileCertification(id, data)),
  });

export const useDeleteCertification = () =>
  useMutation({
    mutationFn: (id: string) => unwrap(deleteProfileCertification(id)),
  });
