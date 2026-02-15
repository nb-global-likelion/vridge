import Link from 'next/link';
import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getMyProfile } from '@/lib/actions/profile';
import { getJobFamilies } from '@/lib/actions/catalog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/section-title';
import { ProfilePublicForm } from '@/features/profile-edit/ui/profile-public-form';
import { ContactForm } from '@/features/profile-edit/ui/contact-form';
import { CareerSection } from '@/features/profile-edit/ui/career-form';
import { EducationSection } from '@/features/profile-edit/ui/education-form';
import { LanguageSection } from '@/features/profile-edit/ui/language-form';
import { UrlSection } from '@/features/profile-edit/ui/url-form';
import { SkillPicker } from '@/features/profile-edit/ui/skill-picker';
import { CertificationSection } from '@/features/profile-edit/ui/certification-form';

export default async function CandidateProfileEditPage() {
  await requireUser();
  const [profileResult, familiesResult] = await Promise.all([
    getMyProfile(),
    getJobFamilies(),
  ]);

  if ('error' in profileResult) {
    return <p className="text-destructive">{profileResult.error}</p>;
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
  const jobFamilies = 'error' in familiesResult ? [] : familiesResult.data;

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
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/candidate/profile"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← 프로필로 돌아가기
      </Link>

      <Card>
        <CardHeader>
          <SectionTitle title="기본 정보" />
        </CardHeader>
        <CardContent>
          <ProfilePublicForm initialData={profilePublic ?? undefined} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="연락처" />
        </CardHeader>
        <CardContent>
          <ContactForm initialData={profilePrivate ?? undefined} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="스킬" />
        </CardHeader>
        <CardContent>
          <SkillPicker currentSkills={profileSkills} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="경력" />
        </CardHeader>
        <CardContent>
          <CareerSection careers={careers} jobFamilies={jobFamilies} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="학력" />
        </CardHeader>
        <CardContent>
          <EducationSection educations={educations} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="자격증" />
        </CardHeader>
        <CardContent>
          <CertificationSection certifications={certifications} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="언어" />
        </CardHeader>
        <CardContent>
          <LanguageSection languages={languages} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="링크" />
        </CardHeader>
        <CardContent>
          <UrlSection urls={urls} />
        </CardContent>
      </Card>
    </div>
  );
}
