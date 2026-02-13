import Link from 'next/link';
import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getMyProfile } from '@/lib/actions/profile';
import { getJobFamilies } from '@/lib/actions/catalog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfilePublicForm } from '@/features/profile-edit/ui/profile-public-form';
import { ContactForm } from '@/features/profile-edit/ui/contact-form';
import { CareerSection } from '@/features/profile-edit/ui/career-form';
import { EducationSection } from '@/features/profile-edit/ui/education-form';
import { LanguageSection } from '@/features/profile-edit/ui/language-form';
import { UrlSection } from '@/features/profile-edit/ui/url-form';
import { SkillPicker } from '@/features/profile-edit/ui/skill-picker';

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
    languages,
    urls,
    profileSkills,
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
    sortOrder: c.sortOrder,
  }));

  const educations = rawEducations.map((e) => ({
    id: e.id,
    institutionName: e.institutionName,
    educationType: e.educationType,
    field: e.field ?? undefined,
    isGraduated: e.isGraduated,
    startDate: e.startDate.toISOString().split('T')[0],
    endDate: e.endDate?.toISOString().split('T')[0],
    sortOrder: e.sortOrder,
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
          <CardTitle className="text-base">기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfilePublicForm initialData={profilePublic ?? undefined} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">연락처</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm initialData={profilePrivate ?? undefined} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">스킬</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillPicker currentSkills={profileSkills} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">경력</CardTitle>
        </CardHeader>
        <CardContent>
          <CareerSection careers={careers} jobFamilies={jobFamilies} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">학력</CardTitle>
        </CardHeader>
        <CardContent>
          <EducationSection educations={educations} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">언어</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSection languages={languages} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">링크</CardTitle>
        </CardHeader>
        <CardContent>
          <UrlSection urls={urls} />
        </CardContent>
      </Card>
    </div>
  );
}
