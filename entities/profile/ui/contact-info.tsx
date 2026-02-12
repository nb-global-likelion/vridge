type Props = {
  phoneNumber?: string | null;
  email?: string | null;
};

export function ContactInfo({ phoneNumber, email }: Props) {
  return (
    <dl className="flex flex-col gap-1 text-sm">
      <div className="flex gap-2">
        <dt className="text-muted-foreground">연락처</dt>
        <dd>{phoneNumber ?? '미제공'}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="text-muted-foreground">이메일</dt>
        <dd>{email ?? '미제공'}</dd>
      </div>
    </dl>
  );
}
