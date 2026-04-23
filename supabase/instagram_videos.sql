create table if not exists public.instagram_media (
  id text primary key,
  caption text,
  media_type text not null,
  media_url text not null,
  thumbnail_url text,
  permalink text not null,
  like_count integer not null default 0,
  comments_count integer not null default 0,
  timestamp timestamptz not null,
  fetched_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.instagram_media
  add column if not exists thumbnail_url text;

create index if not exists instagram_media_timestamp_idx
  on public.instagram_media (timestamp desc);

create index if not exists instagram_media_like_count_idx
  on public.instagram_media (like_count desc);

create index if not exists instagram_media_fetched_at_idx
  on public.instagram_media (fetched_at desc);

create index if not exists instagram_media_type_idx
  on public.instagram_media (media_type);
