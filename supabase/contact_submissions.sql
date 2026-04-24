create extension if not exists pgcrypto;

create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  phone text,
  message text,
  created_at timestamp default now()
);

alter table public.contact_submissions
  add column if not exists phone text;

alter table public.contact_submissions enable row level security;

grant insert on table public.contact_submissions to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_submissions'
      and policyname = 'Allow insert'
  ) then
    create policy "Allow insert"
      on public.contact_submissions
      for insert
      with check (true);
  end if;
end $$;
