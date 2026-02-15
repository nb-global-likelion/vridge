import Link from 'next/link';
import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getMyProfile } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/section-title';
import { SkillBadges } from '@/entities/profile/ui/skill-badges';
import { CareerList } from '@/entities/profile/ui/career-list';
import { EducationList } from '@/entities/profile/ui/education-list';
import { LanguageList } from '@/entities/profile/ui/language-list';
import { UrlList } from '@/entities/profile/ui/url-list';
import { ProfileCard } from '@/entities/profile/ui/profile-card';
import { CertificationList } from '@/entities/profile/ui/certification-list';

export default async function CandidateProfilePage() {
  const user = await requireUser();
  const result = await getMyProfile();

  if ('error' in result) {
    return <p className="text-destructive">{result.error}</p>;
  }

  const {
    profilePublic,
    profilePrivate,
    careers,
    educations,
    languages,
    urls,
    profileSkills,
    certifications,
  } = result.data;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <SectionTitle title="기본 정보" />
        <Button variant="outline" size="sm" asChild>
          <Link href="/candidate/profile/edit">편집</Link>
        </Button>
      </div>

      <Card>
        <CardContent>
          <ProfileCard
            firstName={profilePublic?.firstName ?? ''}
            lastName={profilePublic?.lastName ?? ''}
            dateOfBirth={profilePublic?.dateOfBirth ?? undefined}
            phone={profilePrivate?.phoneNumber}
            email={user.email}
            location={profilePublic?.location}
            headline={profilePublic?.headline}
            aboutMe={profilePublic?.aboutMe}
            isOpenToWork={profilePublic?.isOpenToWork ?? false}
            profileImageUrl={profilePublic?.profileImageUrl}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="학력" />
        </CardHeader>
        <CardContent>
          <EducationList educations={educations} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="스킬" />
        </CardHeader>
        <CardContent>
          <SkillBadges skills={profileSkills} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="경력" />
        </CardHeader>
        <CardContent>
          <CareerList careers={careers} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="자격증" />
        </CardHeader>
        <CardContent>
          <CertificationList certifications={certifications} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="언어" />
        </CardHeader>
        <CardContent>
          <LanguageList languages={languages} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle title="링크" />
        </CardHeader>
        <CardContent>
          <UrlList urls={urls} />
        </CardContent>
      </Card>
    </div>
  );
}
