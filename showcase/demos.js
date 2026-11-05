// Portfolio catalogue: every example shown on FnB/, Marketplace/ and Lainnya/.
// The pages list examples by id (see `demos: [...]` in each page's data), this file says
// what each one is and where it goes.
//
//   name    shown on the card and the stage
//   kind    'web' (website), 'app' (booking / ordering app) or 'system' (POS & back office)
//   type    what kind of business it is, { id, en }. Shown on the stage and the picker.
//   cat     category id from OMNIFY_CATS. When one product's examples span 2+ categories,
//           the page shows category buttons above the stage (e.g. Restoran / Kafe).
//   video   file in uploads/ without ".mp4". The card plays uploads/previews/<video>.mp4 and
//           uses uploads/posters/<video>.jpg as the still. Leave out when there is no video.
//   poster  still image id for examples without video: uploads/posters/<poster>.jpg
//   href    demo page from the site root. Leave out to open the full video in a popup instead.
//   live    set to false to hide a demo link without deleting it (falls back to the video).
//   detail  true = the link is a detail page, not a live demo: the button says "Lihat detail".
//   soon    true = not built yet: shown in the picker with its poster, button says "Segera hadir",
//           no link and not counted in "N contoh". (Only handled on Lainnya/ for now.)
//
// The order inside a page's `demos: [...]` is the order on the site.
// See DEMO-NOTES.md for the checklist.
window.OMNIFY_CATS = {
  resto:   { id: 'Restoran',             en: 'Restaurants' },
  cloud:   { id: 'Cloud kitchen',        en: 'Cloud kitchens' },
  cafe:    { id: 'Kafe & coffee shop',   en: 'Cafés & coffee shops' },
  barber:  { id: 'Barbershop',           en: 'Barbershops' },
  laundry: { id: 'Laundry',              en: 'Laundry' },
  sport:   { id: 'Olahraga & kebugaran', en: 'Sports & fitness' }
};

window.OMNIFY_DEMOS = {
  // Websites
  'rumah-senja':  { name: 'Rumah Senja',      kind: 'web', cat: 'resto', type: { id: 'Restoran fine dining', en: 'Fine-dining restaurant' }, video: 'Film - Rumah Senja', href: 'showcase/rumah-senja/' },
  'dapur-awan':   { name: 'Dapur Awan',       kind: 'web', cat: 'cloud', type: { id: 'Cloud kitchen, 4 brand', en: 'Cloud kitchen, 4 brands' }, video: 'Film - Dapur Awan', href: 'showcase/dapur-awan/' },
  'elevate':      { name: 'Elevate Coffee',   kind: 'web', cat: 'cafe',  type: { id: 'Kafe & klub komunitas', en: 'Café & community club' }, poster: 'elevate', href: 'showcase/elevate/' },
  'first-floor':  { name: 'First Floor',      kind: 'web', cat: 'cafe',  type: { id: 'Coffee shop & roastery', en: 'Coffee shop & roastery' }, poster: 'first-floor', href: 'showcase/first-floor/' },
  'kopi-kala':    { name: 'Kopi Kala',        kind: 'web', cat: 'cafe',  type: { id: 'Coffee shop & bar', en: 'Coffee shop & bar' }, video: 'Film - Kopi Kala', href: 'showcase/kopi-kala/' },
  'padel-me':     { name: 'Padel Me',         kind: 'web', cat: 'sport', type: { id: 'Klub padel indoor', en: 'Indoor padel club' }, poster: 'padel-me', href: 'showcase/padel-me/' },
  'nucleo-pilates-web': { name: 'Nucleo Pilates', kind: 'web', cat: 'sport', type: { id: 'Studio pilates', en: 'Pilates studio' }, poster: 'nucleo-pilates-web', soon: true },
  'jangkar':      { name: 'Jangkar Barber',   kind: 'web', cat: 'barber', type: { id: 'Barbershop', en: 'Barbershop' }, video: 'Film - Jangkar', href: 'showcase/jangkar/' },
  'sanurhasta':   { name: 'Sanurhasta Mitra', kind: 'web', type: { id: 'Perusahaan grup', en: 'Group company' }, poster: 'sanurhasta', href: 'showcase/sanurhasta/' },
  'pualam':       { name: 'Pualam',           kind: 'web', type: { id: 'Batu alam & permukaan', en: 'Stone & surfaces' }, video: 'Film - Pualam', href: 'showcase/pualam/' },
  'dynare':       { name: 'Dynaré',           kind: 'web', type: { id: 'Brand pakaian olahraga', en: 'Activewear brand' }, video: 'Dynare 1c Showcase (1)', href: 'showcase/dynare/' },

  // Booking apps (their demo pages open in the Mobile view)
  'rumah-senja-booking': { name: 'Rumah Senja',    kind: 'app', cat: 'resto',   type: { id: 'Reservasi restoran', en: 'Restaurant reservations' }, poster: 'rumah-senja-booking', href: 'showcase/rumah-senja-booking/' },
  'jangkar-booking':     { name: 'Jangkar Barber', kind: 'app', cat: 'barber',  type: { id: 'Booking barbershop', en: 'Barbershop booking' }, video: 'Reel - Jangkar Booking', href: 'showcase/jangkar-booking/' },
  'bilas-laundry':       { name: 'Bilas Laundry',  kind: 'app', cat: 'laundry', type: { id: 'Antar-jemput laundry', en: 'Laundry pickup' }, video: 'Reel - Bilas Laundry Booking', href: 'showcase/bilas-laundry/' },
  'vetro-padel':         { name: 'Vetro Padel',    kind: 'app', cat: 'sport',   type: { id: 'Sewa lapangan padel', en: 'Padel court booking' }, poster: 'vetro-padel', href: 'showcase/vetro-padel/' },
  'nucleo-pilates':      { name: 'Nucleo Pilates', kind: 'app', cat: 'sport',   type: { id: 'Kelas pilates', en: 'Pilates classes' }, poster: 'nucleo-pilates', href: 'showcase/nucleo-pilates/' },

  // Systems: the card keeps its video preview, the button opens the shared detail page
  // (showcase/sistem/, screenshots + feature checklist per module). `detail: true` turns the
  // button label into "Lihat detail". They must NOT link to demo/ (PIN-protected, owner's decision).
  'self-order':    { name: 'Self Order',          kind: 'system', video: 'Omnify Film - Self Order', href: 'showcase/sistem/#kasir', detail: true },
  'pos':           { name: 'Kasir (POS)',         kind: 'system', video: 'Omnify Film - Kasir (1)', href: 'showcase/sistem/#kasir', detail: true },
  'ikm':           { name: 'Dapur & Inventaris',  kind: 'system', video: 'Omnify Film - Dapur - Inventaris (1)', href: 'showcase/sistem/#dapur', detail: true },
  'pos-inventory': { name: 'Kasir & Inventaris',  kind: 'system', video: 'Omnify Film - Kasir - Inventaris', href: 'showcase/sistem/#inventaris', detail: true }
};
