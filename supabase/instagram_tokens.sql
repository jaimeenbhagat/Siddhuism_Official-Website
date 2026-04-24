create table if not exists public.instagram_tokens (
  id int primary key default 1,
  access_token text not null,
  updated_at timestamp with time zone default now() not null
);

alter table public.instagram_tokens enable row level security;

drop policy if exists "instagram_tokens_select_auth" on public.instagram_tokens;

create policy "instagram_tokens_select_auth"
on public.instagram_tokens
for select
to authenticated
using (true);

insert into public.instagram_tokens (id, access_token)
values (1, 'YOUR_INITIAL_TOKEN')
on conflict (id) do update set access_token = excluded.access_token;
