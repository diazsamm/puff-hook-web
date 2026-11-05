alter table site_settings
  add column if not exists whatsapp_number_2 text not null default '';
