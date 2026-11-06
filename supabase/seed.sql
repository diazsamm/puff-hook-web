insert into site_settings (id, instagram_url)
values (1, 'https://www.instagram.com/puffhook.crochet_')
on conflict (id) do update
set instagram_url = excluded.instagram_url
where site_settings.instagram_url = '';

insert into products (
  slug, name, category, eyebrow, badge, badge_tone, hook_size, price,
  short_description, description, images, featured, published, sort_order
) values
(
  'blushing-bunny-amigurumi',
  'Blushing Bunny Amigurumi',
  'amigurumi',
  'Amigurumi Premium',
  'Best Seller',
  'primary',
  '4.0mm Hook',
  145000,
  'Boneka kelinci empuk berbahan chenille chunky dengan aksen pipi blush dan pita satin.',
  'Dirajut satu per satu dengan teknik puff stitch padat. Tinggi sekitar 18 cm, cocok untuk hadiah dan koleksi.',
  array['/seed/bunny.jpg'],
  true,
  true,
  1
),
(
  'puff-blossom-flower-bouquet',
  'Puff Blossom Flower Bouquet',
  'flower',
  'Bouquet Gift',
  'Bunga Abadi',
  'neutral',
  '3.0mm Hook',
  175000,
  'Buket bunga rajutan 7 tangkai kombinasi mawar puff, daisy, dan lavender.',
  'Cantik abadi tanpa layu. Dikirim dengan wrapping frosted dan pita.',
  array['/seed/bouquet.jpg'],
  true,
  true,
  2
),
(
  'cloudy-marshmallow-tote-bag',
  'Cloudy Marshmallow Tote Bag',
  'bag',
  'Tas & Jinjing',
  'Favorit Hangout',
  'neutral',
  '6.0mm Hook',
  220000,
  'Tas rajut puff tebal, muat tablet dan dompet, dengan furing satin dan kancing magnet.',
  'Tekstur puff stitch yang padat dan empuk dengan dual-tone pastel pink dan ivory.',
  array['/seed/tote.jpg'],
  true,
  true,
  3
),
(
  'strawberry-charm',
  'Strawberry Charm',
  'acc',
  'Aksesoris',
  'Charm',
  'neutral',
  '2.5mm Hook',
  35000,
  'Gantungan kunci stroberi mini dari benang milk cotton.',
  'Ukuran sekitar 6 cm, bisa dipasang di tas atau kunci.',
  array['/seed/strawberry.jpg'],
  false,
  true,
  4
),
(
  'bear-coaster-4pcs',
  'Bear Coaster (4pcs)',
  'acc',
  'Aksesoris',
  'Isi 4',
  'neutral',
  '3.5mm Hook',
  65000,
  'Set 4 coaster berbentuk beruang dengan tekstur rajut rapat.',
  'Diameter 12 cm per coaster, menyerap panas dengan baik.',
  array['/seed/coaster.jpg'],
  false,
  true,
  5
),
(
  'pastel-cardigan',
  'Pastel Cardigan',
  'acc',
  'Rajutan Apparel',
  'Limited',
  'primary',
  '5.0mm Hook',
  380000,
  'Cardigan granny square pastel dengan potongan longgar.',
  'Dirajut tangan dengan benang cotton, tersedia dalam ukuran all size.',
  array['/seed/cardigan.jpg'],
  false,
  true,
  6
)
on conflict (slug) do nothing;
