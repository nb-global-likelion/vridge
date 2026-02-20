create extension if not exists pgcrypto;

create or replace function public.generate_profile_slug()
returns text
language sql
volatile
as $fn$
  with
  adjs as (
    select (array[
      'brave','calm','clever','bright','gentle','mighty','nimble','quiet','rapid','sly',
      'sunny','bold','witty','eager','loyal','kind','fierce','proud','swift','steady'
    ])[1 + floor(random() * 20)::int] as adj
  ),
  nouns as (
    select (array[
      'otter','falcon','tiger','panda','wolf','lion','whale','fox','eagle','badger',
      'sparrow','koala','dolphin','rabbit','yak','orca','gecko','heron','lynx','beaver'
    ])[1 + floor(random() * 20)::int] as noun
  )
  select format(
    '%s-%s-%s',
    (select adj from adjs),
    (select noun from nouns),
    lpad((floor(random() * 10000))::int::text, 4, '0')
  );
$fn$;
