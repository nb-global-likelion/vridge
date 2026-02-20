'use server';

import { revalidatePath } from 'next/cache';
import {
  assertCanViewCandidate,
  type AppRole,
  type ReachabilityChecker,
} from '@/lib/domain/authorization';
import { requireUser } from '@/lib/infrastructure/auth-utils';
import { prisma } from '@/lib/infrastructure/db';
import {
  profilePublicSchema,
  profilePrivateSchema,
  profileCareerSchema,
  profileEducationSchema,
  profileLanguageSchema,
  profileUrlSchema,
  profileCertificationSchema,
} from '@/lib/validations/profile';
import {
  getFullProfile,
  getProfileBySlug as ucGetProfileBySlug,
  getProfileForViewer,
  updatePublicProfile,
  updatePrivateProfile,
  addCareer,
  updateCareer,
  deleteCareer,
  addEducation,
  updateEducation,
  deleteEducation,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  addUrl,
  updateUrl,
  deleteUrl,
  addSkill,
  deleteSkill,
  addCertification,
  updateCertification,
  deleteCertification,
} from '@/lib/use-cases/profile';
import { handleActionError, type ActionError } from './_shared';

type MutationResult = { success: true } | ActionError;
type QueryResult<T> = { success: true; data: T } | ActionError;

const PROFILE_PATH = '/candidate/profile';

export async function updateProfilePublic(
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profilePublicSchema.parse(input);
    await updatePublicProfile(user.userId, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function updateProfilePrivate(
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profilePrivateSchema.parse(input);
    await updatePrivateProfile(user.userId, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function addProfileCareer(
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileCareerSchema.parse(input);
    await addCareer(user.userId, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function updateProfileCareer(
  id: string,
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileCareerSchema.parse(input);
    await updateCareer(user.userId, id, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function deleteProfileCareer(id: string): Promise<MutationResult> {
  try {
    const user = await requireUser();
    await deleteCareer(user.userId, id);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function addProfileEducation(
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileEducationSchema.parse(input);
    await addEducation(user.userId, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function updateProfileEducation(
  id: string,
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileEducationSchema.parse(input);
    await updateEducation(user.userId, id, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function deleteProfileEducation(
  id: string
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    await deleteEducation(user.userId, id);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function addProfileLanguage(
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileLanguageSchema.parse(input);
    await addLanguage(user.userId, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function updateProfileLanguage(
  id: string,
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileLanguageSchema.parse(input);
    await updateLanguage(user.userId, id, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function deleteProfileLanguage(
  id: string
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    await deleteLanguage(user.userId, id);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function addProfileUrl(input: unknown): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileUrlSchema.parse(input);
    await addUrl(user.userId, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function updateProfileUrl(
  id: string,
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileUrlSchema.parse(input);
    await updateUrl(user.userId, id, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function deleteProfileUrl(id: string): Promise<MutationResult> {
  try {
    const user = await requireUser();
    await deleteUrl(user.userId, id);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function addProfileSkill(
  skillId: string
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    await addSkill(user.userId, skillId);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deleteProfileSkill(
  skillId: string
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    await deleteSkill(user.userId, skillId);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function addProfileCertification(
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileCertificationSchema.parse(input);
    await addCertification(user.userId, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function updateProfileCertification(
  id: string,
  input: unknown
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    const data = profileCertificationSchema.parse(input);
    await updateCertification(user.userId, id, data);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e, { zodErrorKey: 'error.inputInvalid' });
  }
}

export async function deleteProfileCertification(
  id: string
): Promise<MutationResult> {
  try {
    const user = await requireUser();
    await deleteCertification(user.userId, id);
    revalidatePath(PROFILE_PATH);
    return { success: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function getMyProfile(): Promise<
  QueryResult<Awaited<ReturnType<typeof getFullProfile>>>
> {
  try {
    const user = await requireUser();
    const data = await getFullProfile(user.userId);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function getProfileForRecruiter(
  candidateId: string
): Promise<QueryResult<Awaited<ReturnType<typeof getProfileForViewer>>>> {
  try {
    const user = await requireUser();
    const checker: ReachabilityChecker = (cId) =>
      prisma.apply
        .findFirst({ where: { userId: cId } })
        .then((r) => r !== null);
    await assertCanViewCandidate(user.role as AppRole, candidateId, checker);
    const data = await getProfileForViewer(candidateId, 'full');
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function getProfileBySlug(
  slug: string
): Promise<QueryResult<Awaited<ReturnType<typeof ucGetProfileBySlug>>>> {
  try {
    const data = await ucGetProfileBySlug(slug);
    return { success: true, data };
  } catch (e) {
    return handleActionError(e);
  }
}
