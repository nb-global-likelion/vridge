import Link from 'next/link';
import { requireUser } from '@/lib/infrastructure/auth-utils';
import { getMyProfile } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileHeader } from '@/entities/profile/ui/profile-header';
import { ContactInfo } from '@/entities/profile/ui/contact-info';
import { SkillBadges } from '@/entities/profile/ui/skill-badges';
import { CareerList } from '@/entities/profile/ui/career-list';
import { EducationList } from '@/entities/profile/ui/education-list';
import { LanguageList } from '@/entities/profile/ui/language-list';
import { UrlList } from '@/entities/profile/ui/url-list';

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
  } = result.data;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <ProfileHeader
          firstName={profilePublic?.firstName ?? ''}
          lastName={profilePublic?.lastName ?? ''}
          aboutMe={profilePublic?.aboutMe}
        />
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/candidate/profile/edit">편집</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">연락처</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactInfo
            phoneNumber={profilePrivate?.phoneNumber}
            email={user.email}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">스킬</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillBadges skills={profileSkills} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">경력</CardTitle>
        </CardHeader>
        <CardContent>
          <CareerList careers={careers} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">학력</CardTitle>
        </CardHeader>
        <CardContent>
          <EducationList educations={educations} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">언어</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageList languages={languages} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">링크</CardTitle>
        </CardHeader>
        <CardContent>
          <UrlList urls={urls} />
        </CardContent>
      </Card>
    </div>
  );
}
