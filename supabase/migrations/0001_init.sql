create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('amigurumi', 'flower', 'bag', 'acc')),
  eyebrow text,
  badge text,
  badge_tone text not null default 'neutral' check (badge_tone in ('primary', 'neutral')),
  hook_size text,
  price integer not null check (price >= 0),
  short_description text,
  description text,
  images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
before update on products
for each row execute function set_updated_at();

create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_number text not null default '',
  instagram_url text not null default '',
  tiktok_url text not null default '',
  hero_badge text not null default '100% Handmade with Love & Fluffy Yarn',
  orders_badge text not null default '4.800+ Pesanan Rajutan Terkirim',
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on site_settings;
create trigger site_settings_updated_at
before update on site_settings
for each row execute function set_updated_at();

alter table products enable row level security;
alter table site_settings enable row level security;

drop policy if exists "public read published products" on products;
create policy "public read published products" on products
  for select using (published = true);

drop policy if exists "admin manage products" on products;
create policy "admin manage products" on products
  for all to authenticated using (true) with check (true);

drop policy if exists "public read site settings" on site_settings;
create policy "public read site settings" on site_settings
  for select using (true);

drop policy if exists "admin update site settings" on site_settings;
create policy "admin update site settings" on site_settings
  for update to authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select on products to anon, authenticated;
grant insert, update, delete on products to authenticated;
grant select on site_settings to anon, authenticated;
grant update on site_settings to authenticated;

insert into site_settings (id) values (1) on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'products');

drop policy if exists "admin insert product images" on storage.objects;
create policy "admin insert product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'products');

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects
  for update to authenticated using (bucket_id = 'products');

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'products');
