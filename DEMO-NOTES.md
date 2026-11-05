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
4. Video sistem/POS (Self Order, Kasir, Dapur & Inventaris, Kasir & Inventaris) **tidak boleh diarahkan ke `demo/`**; tetap popup video sampai tahap berikutnya.
5. Kafe ada di **FnB**. Sanurhasta = **Website Company Profile** di **Lainnya**. Dapur Awan Checkout **dihapus** (web Dapur Awan sudah cukup).
6. FnB 02 bernama **Self Order Menu / Menu Self Order** (dulu Food Catalogue Menu).
7. **Urutan konten di tiap halaman: Landing page → Booking app → Sistem manajemen.**
8. Contoh dalam satu layanan dikelompokkan per **kategori bisnis** (tombol kategori di atas stage, mis. Restoran / Cloud kitchen / Kafe & coffee shop; Barbershop / Laundry / Olahraga & kebugaran). Tiap contoh menampilkan jenis bisnisnya (mis. "Coffee shop & roastery").
9. Jangkar & Bilas Booking pakai **versi bahasa Indonesia**. Rumah Senja Booking tanpa video (poster screenshot). Dapur Awan pindah ke **FnB**.
   Urutan FnB Landing: **Kafe & coffee shop** (Elevate, First Floor, Kopi Kala) → **Restoran** (Rumah Senja) → **Cloud kitchen** (Dapur Awan).
   Scrollbar di dalam demo: tipis & track transparan di tampilan Web, disembunyikan di tampilan Mobile (diatur `demo-bar.js`, style `#om-sb` di iframe).
10. Company Profile: **tanpa harga**, estimasi **1–3 minggu, tergantung scope**.
11. Desain mengikuti WCAG AAA (kontras teks ≥ 7:1, target sentuh ≥ 44px, fokus terlihat, konten bergerak bisa dijeda) dan 10 heuristik Nielsen.

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
| Lainnya | 01 | Landing Page Bisnis | jangkar |
| Lainnya | 02 | Website Company Profile | sanurhasta |
| Lainnya | 03 | Sistem Booking Order | Barbershop: jangkar-booking · Laundry: bilas-laundry · Olahraga & kebugaran: vetro-padel, nucleo-pilates |
| Lainnya | 04 | Pesanan & Inventori | pos-inventory (video) |

**Link langsung ke kategori (untuk sales):** `FnB/#fnb-01-resto`, `FnB/#fnb-01-cloud`, `FnB/#fnb-01-cafe`,
`Lainnya/#p-03-barber`, `Lainnya/#p-03-laundry`, `Lainnya/#p-03-sport`. Klik tombol kategori juga mengubah URL, jadi link di address bar bisa langsung dikirim.

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
- [ ] Landing page untuk bisnis olahraga (sports) akan ditambahkan. Kemungkinan di Lainnya 01 dengan `cat: 'sport'` (kategori sudah ada), jadi Landing Page Lainnya otomatis dapat tombol kategori Barbershop / Olahraga & kebugaran.

### Menambah contoh baru
1. Export "Bundled Page": `python3 -I tools/unbundle.py "<file>.html" showcase/<slug>` lalu `python3 tools/wrap-demo.py showcase/<slug> "Nama" web|mobile "<Halaman>/#<id>"`.
   Folder `.dc.html`: salin file `.dc.html` (jadi `index.html`) + `support.js` + aset yang dirujuk saja, lalu `wrap-demo.py`.
2. Cek di 390px (`node tools/serve.mjs`); perbaiki lewat `<style id="om-mobile">`.
3. Tanpa video? Buat poster: screenshot 1440×900 (web) atau 390×844 @2x (app) → `uploads/posters/<slug>.jpg` (960×600 / 540×960).
4. Tambah entri di `showcase/demos.js` (dengan `type` dan, kalau perlu, `cat`), lalu tambahkan id ke `demos: [...]` layanan yang sesuai di halaman.
5. Set `data-back` di `showcase/<slug>/index.html` ke halaman + kategori, mis. `FnB/#fnb-01-cafe`.

## Tahap berikutnya

**Showcase khusus sistem/POS dengan screenshot thumbnail.** Detail desain belum ditentukan; tanya pemilik saat dimulai.
- Contoh terkait: self-order (FnB 02), pos (FnB 04), ikm (FnB 05), pos-inventory (Marketplace 03, Lainnya 03).
- Begitu halamannya ada: beri `href` di `showcase/demos.js` → otomatis jadi "Coba demo". Jangan arahkan ke `demo/` (PIN).
- Setelah itu kode popup (`openPop`, `closePop`, blok `popOpen`) dan video penuh sistem boleh dihapus.
