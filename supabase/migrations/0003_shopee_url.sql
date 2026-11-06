alter table site_settings
  add column if not exists shopee_url text not null default '';
