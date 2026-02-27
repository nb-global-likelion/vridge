import { requireUser } from '@/backend/infrastructure/auth-utils';
import { getMyProfile } from '@/backend/actions/profile';
import { getJobFamilies } from '@/backend/actions/catalog';
import { ProfileEditPageClient } from '@/frontend/features/profile-edit/ui/profile-edit-page-client';
import { getServerI18n } from '@/shared/i18n/server';
import { getActionErrorMessage } from '@/shared/i18n/action-error';

export default async function CandidateProfileEditPage() {
  const { t } = await getServerI18n();
  const user = await requireUser();
  const [profileResult, familiesResult] = await Promise.all([
    getMyProfile(),
    getJobFamilies(),
  ]);

  if ('errorCode' in profileResult) {
    return (
      <p className="text-destructive">
        {getActionErrorMessage(profileResult, t)}
      </p>
    );
  }

  const {
    profilePublic,
    profilePrivate,
    careers: rawCareers,
    educations: rawEducations,
    languages: rawLanguages,
    urls,
    profileSkills,
    certifications: rawCertifications,
  } = profileResult.data;
  const jobFamilies = 'errorCode' in familiesResult ? [] : familiesResult.data;

  const careers = rawCareers.map((c) => ({
    id: c.id,
    companyName: c.companyName,
    positionTitle: c.positionTitle,
    jobId: c.jobId,
    employmentType: c.employmentType,
    startDate: c.startDate.toISOString().split('T')[0],
    endDate: c.endDate?.toISOString().split('T')[0],
    description: c.description ?? undefined,
    experienceLevel: c.experienceLevel ?? undefined,
    sortOrder: c.sortOrder,
  }));

  const educations = rawEducations.map((e) => ({
    id: e.id,
    institutionName: e.institutionName,
    educationType: e.educationType,
    field: e.field ?? undefined,
    graduationStatus: e.graduationStatus,
    startDate: e.startDate.toISOString().split('T')[0],
    endDate: e.endDate?.toISOString().split('T')[0],
    sortOrder: e.sortOrder,
  }));

  const languages = rawLanguages.map((language) => ({
    id: language.id,
    language: language.language,
    proficiency: language.proficiency,
    testName: language.testName ?? undefined,
    testScore: language.testScore ?? undefined,
    sortOrder: language.sortOrder,
  }));

  const certifications = rawCertifications.map((certification) => ({
    id: certification.id,
    name: certification.name,
    date: certification.date.toISOString().split('T')[0],
    description: certification.description ?? undefined,
    institutionName: certification.institutionName ?? undefined,
    sortOrder: certification.sortOrder,
  }));

  return (
    <ProfileEditPageClient
      profilePublic={
        profilePublic
          ? {
              firstName: profilePublic.firstName,
              lastName: profilePublic.lastName,
              aboutMe: profilePublic.aboutMe,
              dateOfBirth: profilePublic.dateOfBirth
                ? profilePublic.dateOfBirth.toISOString().split('T')[0]
                : undefined,
              location: profilePublic.location,
              isOpenToWork: profilePublic.isOpenToWork,
            }
          : undefined
      }
      profilePrivate={profilePrivate ?? undefined}
      email={user.email}
      jobFamilies={jobFamilies}
      skills={profileSkills.map(({ skill }) => ({
        id: skill.id,
        displayNameEn: skill.displayNameEn,
      }))}
      careers={careers}
      educations={educations}
      certifications={certifications}
      languages={languages}
      urls={urls}
    />
  );
}
