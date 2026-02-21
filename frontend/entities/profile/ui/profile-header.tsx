type Props = {
  firstName: string;
  lastName: string;
  aboutMe?: string | null;
};

export function ProfileHeader({ firstName, lastName, aboutMe }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        {firstName} {lastName}
      </h1>
      {aboutMe && <p className="mt-2 text-muted-foreground">{aboutMe}</p>}
    </div>
  );
}
