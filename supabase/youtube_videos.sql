create table if not exists public.youtube_videos (
  id text primary key,
  title text not null,
  description text,
  thumbnail text,
  published_at timestamptz not null,
  duration text not null default 'PT0S',
  is_short boolean not null default false,
  fetched_at timestamptz not null default now(),
  views integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  video_url text not null,
  created_at timestamptz not null default now()
);

alter table public.youtube_videos
  add column if not exists duration text not null default 'PT0S';

alter table public.youtube_videos
  add column if not exists is_short boolean not null default false;

alter table public.youtube_videos
  add column if not exists fetched_at timestamptz not null default now();

alter table public.youtube_videos
  add column if not exists views integer not null default 0;

alter table public.youtube_videos
  add column if not exists likes integer not null default 0;

alter table public.youtube_videos
  add column if not exists comments integer not null default 0;

create index if not exists youtube_videos_published_at_idx
  on public.youtube_videos (published_at desc);

create index if not exists youtube_videos_views_idx
  on public.youtube_videos (views desc);

create index if not exists youtube_videos_is_short_idx
  on public.youtube_videos (is_short);

create index if not exists youtube_videos_fetched_at_idx
  on public.youtube_videos (fetched_at desc);
