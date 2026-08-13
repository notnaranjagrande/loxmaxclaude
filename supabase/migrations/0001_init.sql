-- GlowMax database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  photo_path text not null,
  overall_score int not null check (overall_score between 0 and 100),
  categories jsonb not null default '[]'::jsonb,
  tips jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists scans_user_id_created_at_idx
  on public.scans (user_id, created_at desc);

alter table public.scans enable row level security;

create policy "Users can view their own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own scans"
  on public.scans for delete
  using (auth.uid() = user_id);

-- Storage bucket for scan photos (private; access via signed URLs only).
insert into storage.buckets (id, name, public)
values ('scan-photos', 'scan-photos', false)
on conflict (id) do nothing;

create policy "Users can upload their own scan photos"
  on storage.objects for insert
  with check (
    bucket_id = 'scan-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can read their own scan photos"
  on storage.objects for select
  using (
    bucket_id = 'scan-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own scan photos"
  on storage.objects for delete
  using (
    bucket_id = 'scan-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
