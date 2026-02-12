type Url = {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
};

type Props = {
  urls: Url[];
};

export function UrlList({ urls }: Props) {
  if (urls.length === 0) {
    return <p className="text-muted-foreground">등록된 링크 없음</p>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {urls.map((u) => (
        <li key={u.id}>
          <a
            href={u.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand hover:underline"
          >
            {u.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
