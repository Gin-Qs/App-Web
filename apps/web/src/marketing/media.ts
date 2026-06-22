// Curated stock photography (free, Unsplash CDN). Every usage layers a brand
// gradient ON TOP via CSS, so if a URL ever fails the panel still looks
// intentional (tinted gradient) instead of a broken image.
const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const PHOTOS = {
  hero: U('1601584115197-04ecc0da31d7', 1800), // cargo truck on the road (cinematic)
  road: U('1586528116311-ad8dd3c8310d'), // truck
  warehouse: U('1553413077-190dd305871c'), // logistics warehouse
  control: U('1521737604893-d14cc237f11d'), // team at screens (ops / support)
  produce: U('1542838132-92c53300491e', 1200), // market produce (fruits/veg)
  support: U('1556761175-5973dc0f32e7', 1000), // support agent with headset
}
