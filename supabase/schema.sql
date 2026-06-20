create extension if not exists "pgcrypto";

create table if not exists public.app_admin (
  id boolean primary key default true check (id),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null default 'Администратор',
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_name text not null check (char_length(client_name) >= 2),
  phone text not null default '',
  email text not null default '',
  service text not null,
  specialist text not null default '',
  visit_date date not null,
  visit_time time not null,
  duration integer not null default 45 check (duration between 15 and 480),
  comment text not null default '',
  status text not null default 'new' check (status in ('new', 'confirmed', 'done', 'cancelled')),
  notification_status text not null default 'not_sent' check (notification_status in ('not_sent', 'queued', 'sent')),
  created_at timestamptz not null default now()
);

alter table public.appointments add column if not exists phone text not null default '';
alter table public.appointments add column if not exists email text not null default '';
alter table public.appointments add column if not exists specialist text not null default '';
alter table public.appointments add column if not exists duration integer not null default 45;
alter table public.appointments add column if not exists notification_status text not null default 'not_sent';

create index if not exists appointments_visit_date_idx on public.appointments(visit_date);
create index if not exists appointments_status_idx on public.appointments(status);
create index if not exists appointments_specialist_idx on public.appointments(specialist);
create index if not exists appointments_notification_status_idx on public.appointments(notification_status);

create unique index if not exists appointments_active_slot_unique_idx
  on public.appointments(specialist, visit_date, visit_time)
  where status <> 'cancelled';

drop view if exists public.appointment_slots;

create view public.appointment_slots as
select
  id,
  service,
  specialist,
  visit_date,
  visit_time,
  duration,
  status
from public.appointments
where status <> 'cancelled';

alter table public.app_admin enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "Admin can read own profile" on public.app_admin;
drop policy if exists "Public read appointments" on public.appointments;
drop policy if exists "Public insert appointments" on public.appointments;
drop policy if exists "Public update appointments" on public.appointments;
drop policy if exists "Public delete appointments" on public.appointments;
drop policy if exists "Admins read appointments" on public.appointments;
drop policy if exists "Admins update appointments" on public.appointments;
drop policy if exists "Admins delete appointments" on public.appointments;
drop policy if exists "Public demo read appointments" on public.appointments;
drop policy if exists "Public demo insert appointments" on public.appointments;
drop policy if exists "Public demo update appointments" on public.appointments;
drop policy if exists "Public demo delete appointments" on public.appointments;

create policy "Admin can read own profile"
  on public.app_admin for select
  to authenticated
  using (user_id = auth.uid());

create policy "Public insert appointments"
  on public.appointments for insert
  to anon
  with check (true);

create policy "Admins read appointments"
  on public.appointments for select
  to authenticated
  using (
    exists (
      select 1
      from public.app_admin
      where app_admin.user_id = auth.uid()
    )
  );

create policy "Admins update appointments"
  on public.appointments for update
  to authenticated
  using (
    exists (
      select 1
      from public.app_admin
      where app_admin.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.app_admin
      where app_admin.user_id = auth.uid()
    )
  );

create policy "Admins delete appointments"
  on public.appointments for delete
  to authenticated
  using (
    exists (
      select 1
      from public.app_admin
      where app_admin.user_id = auth.uid()
    )
  );

grant select on public.app_admin to authenticated;
grant insert on public.appointments to anon;
grant select, update, delete on public.appointments to authenticated;
grant select on public.appointment_slots to anon, authenticated;
