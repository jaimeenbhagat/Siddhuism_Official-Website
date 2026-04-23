create table if not exists public.portfolio_videos (
  id text primary key,
  title text not null,
  project_slug text,
  project_title text,
  video_url text not null,
  thumbnail text,
  category text not null check (category in ('travel', 'products', 'events')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.portfolio_videos
  add column if not exists project_slug text;

alter table public.portfolio_videos
  add column if not exists project_title text;

update public.portfolio_videos
set
  project_title = coalesce(project_title, title),
  project_slug = coalesce(
    project_slug,
    trim(both '-' from regexp_replace(lower(coalesce(project_title, title)), '[^a-z0-9]+', '-', 'g'))
  )
where project_title is null or project_slug is null;

alter table public.portfolio_videos
  alter column project_title set not null;

alter table public.portfolio_videos
  alter column project_slug set not null;

create index if not exists portfolio_videos_category_idx
  on public.portfolio_videos (category);

create index if not exists portfolio_videos_featured_idx
  on public.portfolio_videos (is_featured desc);

create index if not exists portfolio_videos_created_at_idx
  on public.portfolio_videos (created_at desc);

create index if not exists portfolio_videos_project_slug_idx
  on public.portfolio_videos (project_slug);

insert into public.portfolio_videos (
  id,
  title,
  project_title,
  project_slug,
  video_url,
  thumbnail,
  category,
  is_featured
)
values
  (
    'hosteller-video-1',
    'Hosteller Video 1',
    'The Hosteller',
    'the-hosteller',
    'https://www.youtube.com/watch?v=GlucobCFSes',
    'https://img.youtube.com/vi/GlucobCFSes/hqdefault.jpg',
    'travel',
    true
  ),
  (
    'hosteller-video-2',
    'Hosteller Video 2',
    'The Hosteller',
    'the-hosteller',
    'https://www.youtube.com/watch?v=iCgcMb1AcqA',
    'https://img.youtube.com/vi/iCgcMb1AcqA/hqdefault.jpg',
    'travel',
    false
  ),
  (
    'hosteller-video-3',
    'Hosteller Video 3',
    'The Hosteller',
    'the-hosteller',
    'https://www.youtube.com/watch?v=j1M9hCaklxc',
    'https://img.youtube.com/vi/j1M9hCaklxc/hqdefault.jpg',
    'travel',
    false
  )
on conflict (id) do update
set
  title = excluded.title,
  project_title = excluded.project_title,
  project_slug = excluded.project_slug,
  video_url = excluded.video_url,
  thumbnail = excluded.thumbnail,
  category = excluded.category,
  is_featured = excluded.is_featured;
