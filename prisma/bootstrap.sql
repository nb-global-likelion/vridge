create extension if not exists pgcrypto;

create or replace function public.generate_profile_slug()
returns text
language sql
stable
as $fn$
  select concat(
    $q$profile-$q$,
    lpad((floor(random() * 1000000))::int::text, 6, $q$0$q$)
  );
$fn$;
