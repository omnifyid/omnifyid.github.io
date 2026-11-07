# Demo HTML untuk portofolio — catatan & ceklis

> Untuk session Claude berikutnya: baca file ini dulu. Ini konteks tugas yang sedang berjalan.
> Dibuat 2026-11-05, terakhir diperbarui 2026-11-05. **Status: sudah di-commit & di-push** (2026-11-05). Tahap berikutnya ada di bawah.

## Tujuan

Halaman portofolio (`FnB/`, `Marketplace/`, `Lainnya/`) menampilkan contoh kerja yang bisa **dicoba langsung** (demo HTML),
bukan hanya video. Karena contohnya makin banyak, tiap layanan sekarang punya **stage + pemilih contoh**.

Keputusan yang sudah disepakati (jangan dibahas ulang):

1. Preview video di card = klip 8 detik tanpa suara dari `uploads/previews/`. Video penuh hanya untuk popup.
2. Demo dibuka di **tab yang sama**; bar demo punya ← Kembali, tab **Web / Mobile**, dan WhatsApp.
3. Landing page default tampilan **Web**, booking app default **Mobile**. Di HP (< 700px) tab disembunyikan.
4. Video sistem/POS (Self Order, Kasir, Dapur & Inventaris, Kasir & Inventaris) **tidak boleh diarahkan ke demo POS** (repo `omnify-demo-fnb`); tetap popup video sampai tahap berikutnya.
5. Kafe ada di **FnB**. Sanurhasta = **Website Company Profile** di **Lainnya**. Dapur Awan Checkout **dihapus** (web Dapur Awan sudah cukup).
6. FnB 02 bernama **Self Order Menu / Menu Self Order** (dulu Food Catalogue Menu).
7. **Urutan konten di tiap halaman: Landing page → Booking app → Sistem manajemen.**
8. Contoh dalam satu layanan dikelompokkan per **kategori bisnis** (tombol kategori di atas stage, mis. Restoran / Cloud kitchen / Kafe & coffee shop; Barbershop / Laundry / Olahraga & kebugaran). Tiap contoh menampilkan jenis bisnisnya (mis. "Coffee shop & roastery").
9. Jangkar & Bilas Booking pakai **versi bahasa Indonesia**. Rumah Senja Booking tanpa video (poster screenshot). Dapur Awan pindah ke **FnB**.
   Urutan FnB Landing: **Kafe & coffee shop** (Elevate, First Floor, Kopi Kala) → **Restoran** (Rumah Senja) → **Cloud kitchen** (Dapur Awan).
   Scrollbar di dalam demo: tipis & track transparan di tampilan Web, disembunyikan di tampilan Mobile (diatur `demo-bar.js`, style `#om-sb` di iframe).
10. Company Profile: **tanpa harga**, estimasi **1–3 minggu, tergantung scope**.
11. Desain mengikuti WCAG AAA (kontras teks ≥ 7:1, target sentuh ≥ 44px, fokus terlihat, konten bergerak bisa dijeda) dan 10 heuristik Nielsen.
12. Landing page di HP (< 640px) memakai menu **hamburger** (☰ → dropdown). Dikelola satu file `showcase/hamburger.js`, dipasang lewat `<script data-site="…">` di `site.html` tiap landing page (config per situs ada di dalam file itu). Sanurhasta sudah punya tombol Menu + drawer sendiri.

## Brand: Omnify Lab (2026-11-05, sudah di-commit)

Nama brand sekarang **Omnify Lab** (domain omnifylab.com belum dibeli; situs tetap di GitHub Pages). Semua teks "Omnify" → "Omnify Lab" (judul, meta, WA, footer, demo POS).
Nama file video `Omnify Film - …` dan key `localStorage` (`omnify-lang`, `omnify-pf-paused`, `om-demo-gate`) **sengaja tidak diubah**.
URL `omnifyid.github.io` (canonical/og) tetap sampai domain baru aktif.

| File | Dipakai untuk |
|---|---|
| `brand/logo-black.svg` | logo teks di latar terang (header/footer portofolio, header `showcase/sistem/`, sidebar POS) |
| `brand/logo-white.svg` | logo teks di latar gelap (login & PIN gate POS, kartu login mobile, gambar `og/*.png`) |
| `favicon.svg` (= `brand/icon-main.svg`, logo 1) | favicon halaman utama (FnB, Marketplace, Lainnya, root, 404) |
| `showcase/favicon.svg` (= `brand/icon-second.svg`, logo 2) | favicon semua demo drill-down + `showcase/sistem/` (`href="../favicon.svg"`) |
| `brand/icon-third.svg` (logo 3) | favicon demo POS (salinannya `favicon.svg` di repo `omnify-demo-fnb` / `omnify-demo-retail`) |

Logo dipasang sebagai `<img>` SVG dengan `height` tetap/`clamp()` dan `width:auto` (rasio 461:126). `og/*.png` dibuat ulang dengan logo baru.

## Peta portofolio (sumber: `data` di tiap halaman + `showcase/demos.js`)

| Halaman | # | Layanan | Contoh (id di `demos.js`) |
|---|---|---|---|
| FnB | 01 | Landing Page FnB | Kafe & coffee shop: elevate, first-floor, kopi-kala · Restoran: rumah-senja · Cloud kitchen: dapur-awan |
| FnB | 02 | Reservasi & Booking Meja | rumah-senja-booking |
| FnB | 03 | Self Order Menu | self-order (video) |
| FnB | 04 | POS | pos (video) |
| FnB | 05 | Inventori & Dapur (IKM) | ikm (video) |
| Marketplace | 01 | Landing + Katalog | pualam |
| Marketplace | 02 | Fashion E-commerce | dynare |
| Marketplace | 03 | POS & Inventori | pos-inventory (video) |
| Lainnya | 01 | Landing Page Bisnis | Olahraga & kebugaran: padel-me, nucleo-pilates-web (*segera hadir*) · Barbershop: jangkar |
| Lainnya | 02 | Website Company Profile | sanurhasta |
| Lainnya | 03 | Sistem Booking Order | Olahraga & kebugaran: vetro-padel, nucleo-pilates · Barbershop: jangkar-booking · Laundry: bilas-laundry |
| Lainnya | 04 | Pesanan & Inventori | pos-inventory (video) |

**Link langsung ke kategori (untuk sales):** `FnB/#fnb-01-resto`, `FnB/#fnb-01-cloud`, `FnB/#fnb-01-cafe`,
`Lainnya/#p-01-sport`, `Lainnya/#p-03-barber`, `Lainnya/#p-03-laundry`, `Lainnya/#p-03-sport`. Klik tombol kategori juga mengubah URL, jadi link di address bar bisa langsung dikirim.

## Cara kerjanya

**Katalog contoh — `showcase/demos.js`.** `OMNIFY_CATS` = daftar kategori (label ID/EN). Satu entri per contoh: `name`, `kind` (`web` / `app` / `system`),
`type` (jenis bisnis, ID/EN), `cat` (id kategori; tombol kategori muncul kalau contoh satu layanan ada di 2+ kategori), `video` (nama file di `uploads/`)
atau `poster` (gambar diam di `uploads/posters/<poster>.jpg`), dan `href` ke demo. Tanpa `href` = popup video. `live: false` menyembunyikan link demo.
Halaman hanya menyebut id-nya di `demos: [...]`.

**Stage + pemilih (di tiap halaman portofolio).**
- Satu stage besar per layanan: label jenis (Website / Aplikasi booking / Sistem), "1 / 4", nama contoh, tombol **Coba demo** (atau **Tonton video**), dan tombol **jeda** 44×44.
- Di bawahnya pemilih contoh (`role="tablist"`): thumbnail + nama + jenis. Panah ←/→, Home, End untuk keyboard. Di HP jadi baris yang bisa di-swipe.
- Hanya video yang terlihat di layar yang diputar. Jeda disimpan di `localStorage` (`omnify-pf-paused`) dan otomatis aktif kalau pengguna memilih *reduce motion*.
- Kartu ringkasan di hero menampilkan jumlah contoh ("4 contoh").
- Link "Langsung ke portofolio" muncul saat menekan Tab (skip link).
- Tombol kategori (`.pf-cat`, `aria-pressed`) di atas stage: "Semua" + tiap kategori dengan jumlah contoh. Urutan contoh = urutan di `demos: [...]`.
- Kode: `pfItem()`, `pfCats()`, `pfVals()`, `pickDemo()`, `pickCat()`, `applyHash()`, `togglePause()`, `setupVideos()/syncVid()` di script tiap halaman; CSS `.pf-*` di `<helmet><style>`.

**Kontras (AAA).** Abu-abu teks diganti: `#6d7469`/`#8a9186` → `#4b5247`, `#5d6459` → `#454b42`, `#7f8c80` → `#a9b5a6`;
tombol hijau dengan teks putih → `oklch(0.42 0.12 140)` (hover `oklch(0.36 0.11 140)`); centang spesifikasi → `oklch(0.42 0.13 140)`.
Audit terakhir: semua teks ≥ 7:1 kecuali tanda ">" di logo (logotype dikecualikan WCAG).

**Demo — `showcase/<slug>/`.** `index.html` = shell Omnify (`../demo-bar.js`: bar + tab Web/Mobile + iframe), `site.html` = demo, `assets/` = gambar/font/JS.
Perbaikan mobile ada di `<style id="om-mobile">` di `site.html`. Jangkar punya `reveal.js` (scroll reveal).

| Alat | Fungsi |
|---|---|
| `tools/unbundle.py` | Bongkar export "Bundled Page" (satu HTML berisi aset base64) jadi `index.html` + `assets/` |
| `tools/wrap-demo.py` | Pindah `index.html` → `site.html`, tulis shell. `python3 tools/wrap-demo.py showcase/<slug> "Nama" web\|mobile "Lainnya/#p-04"` |
| `tools/make-previews.sh` | Buat ulang preview 8 detik (`avconvert` macOS) |
| `tools/serve.mjs` | Server lokal: `node tools/serve.mjs` → http://localhost:8765/ |

## Status demo (semua live)

| Demo | Jenis | Dari | Catatan |
|---|---|---|---|
| rumah-senja | web | export | mobile: nav, kolom cerita, judul & footer diperbaiki |
| kopi-kala | web | export | pindah ke FnB 01 |
| elevate | web | folder `.dc.html` | baru; poster dari screenshot; `overflow-x: clip` agar tidak geser ke samping |
| first-floor | web | folder `.dc.html` | baru; poster dari screenshot |
| dapur-awan | web | export | mobile: ticker, nav, galeri swipe |
| padel-me | web | export | 2026-11-05, di-commit 46b32b4. Overlay drawer rusak diperbaiki; hero reveal (`.pm-h`, `.pm-hbg`, kelas `pm-in` lewat IntersectionObserver) + konten hero memudar saat di-scroll; performa: tanpa `backdrop-filter`, marquee pakai CSS animation (dulu rAF baca `scrollWidth` tiap frame), scroll handler baca-lalu-tulis, gambar dikompres 8,6 → 3,9 MB + lazy. Poster dari screenshot |
| jangkar | web | export | scroll reveal; 5 tombol booking → `../jangkar-booking/?view=mobile` (`target=_top`) |
| sanurhasta | web | folder `.dc.html` | file penting saja; card baru Company Profile |
| pualam | web | export | mobile: header, katalog 2 kolom |
| dynare | web | export (responsive) | navbar desktop dibuat sticky (sebelumnya hilang saat scroll) |
| rumah-senja-booking | app | export | poster screenshot (video reel dihapus) |
| jangkar-booking | app | export (versi **Indonesia**, `booking-apps/`) | |
| bilas-laundry | app | export (versi Indonesia) | |
| nucleo-pilates | app | export | baru, bahasa Indonesia; poster dari screenshot |
| vetro-padel | app | export | baru, bahasa Indonesia; poster dari screenshot |

## Ceklis

### Sudah dikerjakan (belum di-commit)
- [x] 8 demo baru masuk + dicek di 390px; 5 poster baru di `uploads/posters/`
- [x] Dapur Awan Checkout dihapus (video, poster, preview, entri)
- [x] Stage + pemilih contoh di 3 halaman; konten (Self Order Menu, Company Profile, kafe ke FnB)
- [x] Kontras AAA, skip link, tombol jeda, navigasi keyboard pemilih
- [x] Gambar JPG besar di `showcase/` dikompres (61 file, 39 MB → 16 MB; total `showcase/` 91 → 68 MB)
- [x] Diuji di Chrome headless: klik/keyboard/jeda/popup, ID & EN, tidak ada error JS di semua halaman & demo

### Perlu keputusan / tinjauan pemilik
- [ ] Teks Company Profile (Lainnya 02) saya tulis sendiri (deskripsi & spesifikasi). Mohon dicek.
- [ ] Teks Self Order Menu (FnB 02) disesuaikan: deskripsi + satu spesifikasi ("Pesanan langsung ke kasir & dapur"). Mohon dicek.
- [x] Dapur Awan pindah ke FnB; Jangkar/Bilas versi Indonesia; Company Profile tanpa harga, 1–3 minggu.
- [ ] Label jenis bisnis di `demos.js` (`type`) saya simpulkan dari isi demo, mis. Elevate = "Kafe & klub komunitas", Kopi Kala = "Coffee shop & bar", Sanurhasta = "Perusahaan grup". Mohon dicek.
- [ ] Preview 8 detik pertama sudah yang paling menarik? (`--start` di `tools/make-previews.sh`)

### Bersih-bersih (selesai, ikut commit)
- [x] Video penuh contoh yang punya demo live dihapus (Film - Rumah Senja / Kopi Kala / Dapur Awan / Jangkar / Pualam, Dynare 1c & 1f, Reel - Jangkar / Bilas / Rumah Senja Booking). Preview & poster tetap. Video sistem (Omnify Film - …) tetap untuk popup. Video lama masih ada di git history.
- [ ] Opsional: font ikon Material Symbols 3 MB terduplikasi di 5 booking app (`assets/*.woff2`); bisa dibagi satu file atau di-subset.

### Rencana pemilik
- [x] Landing page olahraga: **Padel Me** di Lainnya 01 (`cat: 'sport'`). Urutan kategori di Lainnya: **Olahraga → Barbershop → Laundry** (01 dan 03).
- [ ] **Web Nucleo Pilates** = `nucleo-pilates-web` dengan `soon: true` (tombol "Segera hadir", tanpa link, tidak dihitung di "N contoh"; poster `uploads/posters/nucleo-pilates-web.jpg` dari foto app Nucleo). Saat webnya jadi: hapus `soon`, tambah `href`, ganti poster. `soon` baru ditangani di `Lainnya/index.html`.

### Menambah contoh baru
1. Export "Bundled Page": `python3 -I tools/unbundle.py "<file>.html" showcase/<slug>` lalu `python3 tools/wrap-demo.py showcase/<slug> "Nama" web|mobile "<Halaman>/#<id>"`.
   Folder `.dc.html`: salin file `.dc.html` (jadi `index.html`) + `support.js` + aset yang dirujuk saja, lalu `wrap-demo.py`.
2. Cek di 390px (`node tools/serve.mjs`); perbaiki lewat `<style id="om-mobile">`.
3. Tanpa video? Buat poster: screenshot 1440×900 (web) atau 390×844 @2x (app) → `uploads/posters/<slug>.jpg` (960×600 / 540×960).
4. Tambah entri di `showcase/demos.js` (dengan `type` dan, kalau perlu, `cat`), lalu tambahkan id ke `demos: [...]` layanan yang sesuai di halaman.
5. Set `data-back` di `showcase/<slug>/index.html` ke halaman + kategori, mis. `FnB/#fnb-01-cafe`.

## Halaman detail sistem — `showcase/sistem/` (2026-11-05, belum di-commit)

Semua layanan sistem manajemen (FnB 03 Self Order, FnB 04 POS, FnB 05 IKM, Marketplace 03, Lainnya 04) sekarang tombolnya **"Lihat detail"**
(bukan "Tonton video") dan mengarah ke **satu halaman yang sama**: `showcase/sistem/`. Preview video 8 detik di card tetap.
- `demos.js`: entri sistem punya `href: 'showcase/sistem/#<modul>'` + `detail: true` → `pfItem()` di 3 halaman memberi label "Lihat detail".
  Jangkar: self-order & pos → `#kasir`, ikm → `#dapur`, pos-inventory → `#inventaris`. Lainnya: `#operasional`, `#addon`.
- Isi: hero (screenshot Ringkasan) + 4 modul. Tiap modul: teks + manfaat, screenshot (thumbnail + lightbox), lalu **kartu kelompok fitur**
  (Kasir 4 kelompok/18 fitur, Kitchen 3/13, Inventory 3/12, Operasional 4/20). Fitur yang add-on diberi badge "Add-on".
  Screenshot: Kasir = layar kasir, tambah produk, denah meja · Kitchen = KDS, resep · Inventory = stok saja (Pembelian hanya di daftar fitur) ·
  Operasional = absensi (POV kasir Bayu, tombol Clock in/out), izin & cuti, shift & kas, laporan harian (Ringkasan tidak dipakai di sini).
- **Add-on (5):** Integrasi WhatsApp, Absensi Foto + GPS, Denah Meja, Purchase Order, Aplikasi Booking (link ke demo `rumah-senja-booking`).
- Teks ID/EN ada di objek `T` di dalam `index.html` (ikut `omnify-lang`). Tombol kembali memakai `?from=` (divalidasi), default `FnB/#fnb-04`.
- Gambar di `showcase/sistem/img/`: `<nama>-md.jpg` (1100px, dipakai di halaman), `<nama>.jpg` (1800px, hanya lightbox/layar besar lewat srcset),
  `<nama>-sm.jpg` (thumbnail). Diambil dari demo POS FnB (repo `omnify-demo-fnb`; owner Arif / kasir Bayu, outlet Kemang, skenario "Toko sudah berjalan") lewat Chrome headless;
  kasir, KDS, meja, dan form produk diisi dulu lewat klik otomatis supaya tidak kosong. Laba rugi sengaja tidak dipakai (data contoh bulan ini rugi).
- Performa: tanpa `backdrop-filter` dan `filter: blur` (glow = radial-gradient), gambar lazy + `decoding=async`, animasi hanya opacity/transform.
  Scroll reveal: `[data-rv]` (fade/slide/zoom) dan `[data-rv-kids]` (anak muncul bergantian); satu IntersectionObserver, mati otomatis saat *reduce motion*.

### Perlu tinjauan pemilik
- [ ] Copy marketing & checklist fitur per modul (saya susun dari fitur yang ada di demo). Add-on: deskripsi saya tulis sendiri; harga tidak ditampilkan.
- [ ] Estimasi "2–6 minggu, tergantung modul" diambil dari ETA POS (14–30 hari) & IKM (4–6 minggu).
- [ ] Kode popup video (`openPop`, `closePop`, `popOpen`) & video penuh sistem di `uploads/` sekarang tidak dipakai card mana pun; boleh dihapus kalau setuju.

## Demo POS — dipisah ke repo sendiri (2026-11-07)

Demo POS **tidak lagi ada di repo ini**. Masing-masing repo GitHub Pages sendiri (riwayat commit ikut dibawa):

| Repo | URL | Isi |
|---|---|---|
| [Omnify-Lab/omnify-demo-fnb](https://github.com/Omnify-Lab/omnify-demo-fnb) | https://omnify-lab.github.io/omnify-demo-fnb/ | demo POS FnB (dulu `demo/`) |
| [Omnify-Lab/omnify-demo-retail](https://github.com/Omnify-Lab/omnify-demo-retail) | https://omnify-lab.github.io/omnify-demo-retail/ | demo POS toko fashion "Garis Goods" (dulu `demo-retail/`) |

- URL lama `/demo/` dan `/demo-retail/` **tidak berlaku lagi** (404). Ketiga repo ada di organisasi GitHub **Omnify-Lab**.
- Rencana domain: landing di domain utama (mis. `omnifylab.com`), demo di **subdomain** (mis. `demo-fnb.` / `demo-retail.`), tiap repo punya file `CNAME` sendiri.
  Saat domain aktif: ganti URL canonical/OG di `omnify-demo-fnb/index.html` dan pola URL di `omnify-demo-retail/tools/retail/index_patches.py`, lalu bangun ulang retail.
- Logo (`brand/logo-*.svg`) dan `og/demo.png` disalin ke tiap repo demo; kalau logo di sini berubah, salin ulang ke `omnify-demo-fnb` lalu bangun ulang retail.
- Retail **dibangun dari** repo FnB: `tools/make-retail.py` + `tools/retail/` ada di repo `omnify-demo-retail` (membaca `../omnify-demo-fnb`).
  Jangan edit file situs retail langsung. Detail fitur retail ada di README repo retail & riwayat commit `aed9d4b`.
- Keduanya dilindungi PIN; **jangan ditautkan dari kartu portofolio** kecuali owner minta.

## Kontak sales (2026-11-06)

- Nomor WhatsApp **utama** (tombol WA, bundle, `showcase/demo-bar.js`, `showcase/sistem/`) = **6282119688218** (+62 821-1968-8218).
  Nomor `628977887994` di dalam demo `showcase/elevate` & `showcase/first-floor` sengaja tidak diubah (bagian isi demo).
- Section `#sales` (label **"Our team"**, tanpa jabatan) ada **tepat di atas** "Apa yang ingin Anda benahi lebih dulu?" (`#estimate`) di FnB / Marketplace / Lainnya: Imam, Rizky, Hamdan (foto bulat, WA + Instagram).
  Panel Instagram @creativelogy (`#instagram`) sudah **dihapus** (2026-11-06).
  Data ada di `team:` dalam `renderVals()` tiap halaman. Foto `uploads/team/*.jpg` (480×480): crop di-center ke siluet kepala, level mata di 40% tinggi, jarak antar-mata 14,5% lebar.
  Grid 3 kolom, 1 kolom di ≤ 600px (`.team-grid`).
