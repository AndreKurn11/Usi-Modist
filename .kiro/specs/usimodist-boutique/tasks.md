# Implementation Plan: Usimodist Boutique Website

## Overview

Implementasi website profil perusahaan Usimodist sebagai aplikasi Multi-Page Application (MPA) berbasis Node.js + Express.js + EJS + Tailwind CSS. Pengerjaan dilakukan secara bertahap: mulai dari fondasi server dan data, lalu halaman-halaman EJS, kemudian interaktivitas klien, dan diakhiri dengan pengujian menyeluruh.

## Tasks

- [x] 1. Setup proyek, konfigurasi server, dan data produk
  - [x] 1.1 Inisialisasi `package.json` dengan dependensi pinned: express, ejs, dotenv; devDependencies: jest, fast-check, supertest, jsdom, tailwindcss, nodemon
    - Buat `package.json` dengan semua versi exact (tanpa `^` atau `~`)
    - Tambahkan script: `start`, `dev`, `test`, `build:css`
    - _Requirements: 18.8_
  - [x] 1.2 Buat `app.js` sebagai entry point Express, implementasikan fungsi `resolvePort()` dan konfigurasi middleware
    - Implementasikan `resolvePort(envValue)`: parse integer, validasi range 1–65535, fallback ke 3000 + `console.warn()`
    - Setup `express.static('public')`, `app.set('view engine', 'ejs')`, `app.set('views', './views')`
    - Mount semua router dari `routes/`
    - Pasang 404 handler dan global error handler
    - Load `.env` via `dotenv.config()` di baris pertama
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 18.6_
  - [x] 1.3 Buat file-file route: `routes/index.js`, `routes/about.js`, `routes/products.js`, `routes/gallery.js`, `routes/contact.js`
    - Setiap file mengekspor `express.Router()`
    - `routes/products.js` menangani `GET /products` (baca JSON, pass ke template) dan `GET /products/:id` (cari produk by id, 404 jika tidak ditemukan)
    - Pass `selectedTechnique` dari `req.query.technique` ke template products
    - _Requirements: 1.6, 10.2, 11.2, 11.3_
  - [x] 1.4 Buat `data/products.json` dengan minimal 6 produk (min 2 per teknik: Pounding, Steam, Iron Blanket)
    - Setiap produk harus memiliki field lengkap: `id` (slug unik), `name`, `technique`, `description`, `shortDescription`, `material`, `plants[]`, `image`, `process`, `characteristics`
    - Semua konten dalam Bahasa Indonesia
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  - [ ]* 1.5 Tulis property test untuk Property 1: Port Resolution
    - **Property 1: Port Resolution Falls Back to 3000 for All Invalid Input**
    - **Validates: Requirements 1.1, 1.4, 1.5**
    - Test menggunakan `fc.oneof()` dengan nilai valid, terlalu kecil, terlalu besar, non-numerik, undefined, dan string kosong
    - Verifikasi hasil selalu integer dalam range 1–65535
  - [ ]* 1.6 Tulis property test untuk Property 6: Product_Data Schema Integrity
    - **Property 6: Product_Data Schema and ID Integrity**
    - **Validates: Requirements 12.2, 12.4**
    - Test semua field produk: tipe, non-empty, slug format, unique id, valid technique value

- [x] 2. Checkpoint — Verifikasi server berjalan dan data produk valid
  - Pastikan `node app.js` berjalan di port 3000 tanpa error
  - Pastikan semua route mengembalikan HTTP 200 (atau 404 untuk unknown routes)
  - Tanyakan kepada user jika ada pertanyaan sebelum melanjutkan.

- [x] 3. Buat EJS Partials: header dan footer
  - [x] 3.1 Buat `views/partials/header.ejs` — Navbar dengan logo, nav links, tombol CTA, dan hamburger menu mobile
    - Logo + brand name (kiri), nav links desktop (kanan): Beranda, Tentang, Produk, Galeri, Kontak
    - Tombol "Hubungi Kami" link ke `/contact`
    - Hamburger icon (`id="hamburger-btn"`) yang tampil di viewport `<1024px`
    - Mobile menu (`id="mobile-menu"`) hidden by default, berisi semua nav links + Hubungi Kami
    - Background near-white (lightness ≥95%), tipografi gelap, kontras ≥4.5:1
    - Semua touch target minimum 44×44px
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 16.7, 17.1_
  - [x] 3.2 Buat `views/partials/footer.ejs` — Footer dengan logo, nav links, social media, dan copyright
    - Logo/brand name, nav links: Beranda, Tentang, Produk, Galeri, Kontak
    - Link Instagram (target `_blank`) dan WhatsApp (`wa.me`, target `_blank`)
    - Copyright: `© <tahun> Usimodist` (tahun dinamis dari JavaScript/server)
    - Background gelap (lightness ≤30%) atau terang (≥90%) dengan kontras tipografi ≥4.5:1
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 4. Buat halaman Homepage (`views/pages/index.ejs`)
  - [x] 4.1 Implementasikan Hero Section pada homepage
    - H1 serif: "Alam. Tradisi. Usimodist."
    - Deskripsi body text: "Usimodist adalah butik ecoprint yang menghadirkan keindahan alam ke dalam setiap helai karya."
    - CTA button "Lihat Produk →" link ke `/products`
    - Gambar ecoprint (kanan, desktop ≥1024px); single column di mobile
    - Background lightness ≥90%, padding vertikal min 64px desktop / 40px mobile
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 17.7_
  - [x] 4.2 Implementasikan About Preview Section pada homepage
    - Label "TENTANG KAMI" uppercase sans-serif di atas heading
    - Heading: "Dari Alam, Untuk Kehidupan yang Lebih Baik"
    - Deskripsi 50–200 karakter tentang eco-print dan sustainability
    - CTA link "Selengkapnya Tentang Kami →" ke `/about` (same tab)
    - Gambar alam (kiri, desktop ≥1024px, min-height 400px); gambar atas teks di mobile (min-height 240px)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 4.3 Implementasikan Technique Cards Section pada homepage
    - Heading "Ecoprint Berdasarkan Teknik"
    - 3 kartu: Pounding, Steam, Iron Blanket — masing-masing dengan gambar (`alt` non-empty), nama teknik, link "Lihat Produk →" ke `/products?technique=<nama>`
    - Grid 3 kolom desktop (≥1024px), 2 kolom tablet (768–1023px), 1 kolom mobile (≤767px)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  - [x] 4.4 Implementasikan Mission Section pada homepage
    - Label "ISU YANG DIANGKAT" uppercase, heading "Kenapa Kami Melakukan Ini?"
    - Teks menyebut: limbah tekstil, pencemaran air kimia, fast fashion
    - CTA link "Pelajari Lebih Lanjut →" ke `/about`
    - Gambar lingkungan + overlay 4 label: Limbah Tekstil, Pencemaran Air, Fast Fashion, Solusi Kami
    - Single column di viewport <1024px
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  - [x] 4.5 Implementasikan Contact Section pada homepage
    - Heading "Lokasi & Kontak"
    - Alamat fisik, WhatsApp link (`wa.me`, target `_blank`), email, link Instagram (target `_blank`)
    - Tombol "Hubungi Kami" link ke `/contact`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 5. Buat halaman About (`views/pages/about.ejs`)
  - [x] 5.1 Implementasikan halaman About lengkap
    - Hero/banner dengan judul halaman sebagai visible text
    - Bagian founding story & brand mission
    - Bagian eco-print process + minimal 1 environmental benefit konkret
    - Deskripsi ketiga teknik: Pounding, Steam, Iron Blanket
    - Minimal 1 gambar dengan `alt` non-empty
    - Link navigasi ke `/products` atau `/contact`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 6. Buat halaman Products (`views/pages/products.ejs`)
  - [x] 6.1 Implementasikan Products Listing Page dengan filter buttons dan grid Product_Cards
    - 4 tombol filter: "Semua", "Pounding", "Steam", "Iron Blanket" (dengan `data-technique` attribute)
    - Grid Product_Cards: 3 kolom desktop (≥1024px), 2 kolom tablet (768–1023px), 1 kolom mobile (<768px)
    - Setiap card (`class="product-card"`) mengandung: gambar, nama, teknik (`data-technique`), shortDescription (≤150 karakter), link "Lihat Detail →" ke `/products/:id`
    - Pre-select filter dari `selectedTechnique` server-side untuk initial render yang sesuai
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.9_

- [x] 7. Buat halaman Product Detail (`views/pages/product.ejs`)
  - [x] 7.1 Implementasikan Product Detail Page
    - Gambar produk full-width mobile / min 50% layout desktop, dalam two-column layout (gambar + detail) di desktop
    - Nama produk H1/H2 serif
    - Tampilkan semua field: teknik, deskripsi lengkap, material, plants, proses produksi, karakteristik
    - WhatsApp link (`wa.me`, target `_blank`) + link ke `/contact`
    - _Requirements: 11.1, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10, 11.11, 11.12, 11.13_

- [ ] 8. Buat halaman Gallery (`views/pages/gallery.ejs`) dan 404 (`views/pages/404.ejs`)
  - [x] 8.1 Implementasikan Gallery Page
    - CSS grid/masonry, min 2 kolom desktop (≥768px), 1 kolom mobile (<768px)
    - Min 1 gambar per 4 kategori berbeda dari: eco-print products, leaves, production process, textile details, nature, artisans, finished products
    - Semua gambar dengan `alt` non-empty
    - Hover transition (desktop, pointer:fine): opacity 0.3–0.7 atau scale 1.03–1.10, via CSS transition
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_
  - [ ] 8.2 Implementasikan halaman Contact (`views/pages/contact.ejs`)
    - Alamat fisik, WhatsApp link (`https://wa.me/<phone>`, target `_blank`), email, Instagram link (target `_blank`)
    - Jam operasional dalam format: `<day-range>, <HH:MM>–<HH:MM> <timezone>`
    - Single column ≤767px, multi-column ≥768px
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_
  - [~] 8.3 Buat halaman 404 (`views/pages/404.ejs`)
    - Pesan 404 informatif dalam Bahasa Indonesia
    - Link kembali ke beranda (`/`)
    - Include header dan footer partial
    - _Requirements: 1.6_

- [~] 9. Checkpoint — Verifikasi semua halaman ter-render dengan benar
  - Pastikan semua route mengembalikan HTTP 200 dan HTML yang benar
  - Pastikan route `/products/:id` yang tidak valid mengembalikan 404
  - Tanyakan kepada user jika ada pertanyaan sebelum melanjutkan.

- [ ] 10. Implementasikan `public/js/main.js` — Vanilla JS interaktivitas
  - [~] 10.1 Implementasikan `initNavbar()` — hamburger menu toggle
    - Event listener pada `#hamburger-btn`: toggle visibility `#mobile-menu`
    - Transformasi hamburger icon ke X icon saat menu terbuka
    - Event listener pada setiap link di mobile menu: tutup menu saat diklik
    - Vanilla JavaScript only, tanpa library eksternal
    - _Requirements: 2.4, 2.5, 2.6, 2.8, 15.1_
  - [~] 10.2 Implementasikan `initProductFilter()` — filter produk client-side
    - Baca `data-technique` dari setiap `.product-card`
    - Handle klik tombol filter: tampilkan/sembunyikan cards (case-insensitive match)
    - "Semua" menampilkan semua cards
    - Sync dengan URL `?technique=` menggunakan `history.pushState()`
    - Pada page load, baca URL param dan pre-select filter yang sesuai; unknown value → default "Semua"
    - Vanilla JavaScript only, tanpa library eksternal
    - _Requirements: 10.5, 10.6, 10.7, 10.8, 10.10, 15.2_
  - [~] 10.3 Implementasikan `initSmoothScroll()` dan `initRevealAnimation()`
    - Smooth scroll: event listener pada anchor `href` yang dimulai dengan `#`, gunakan `scrollIntoView({ behavior: 'smooth' })`
    - Reveal animation: `IntersectionObserver` pada elemen `[data-reveal]`; tambah class `is-visible` saat masuk viewport
    - CSS transition: opacity 0→1 + translateY 20px→0, durasi 600ms, via CSS class (bukan inline style)
    - Elemen harus visible tanpa JS (graceful degradation)
    - _Requirements: 15.3, 15.4, 15.5, 15.6_
  - [ ]* 10.4 Tulis unit tests untuk `initNavbar()` dan `initProductFilter()` menggunakan JSDOM
    - Test klik hamburger menampilkan mobile menu
    - Test klik link mobile menutup mobile menu
    - Test filter Pounding hanya menampilkan produk Pounding
    - Test filter "Semua" menampilkan semua produk
    - _Requirements: 15.1, 15.2_

- [ ] 11. Implementasikan visual design system via Tailwind CSS
  - [~] 11.1 Buat `tailwind.config.js` dan setup `public/css/style.css` dengan Tailwind directives
    - Konfigurasi warna: primary background lightness ≥95%, earthy neutral accents (saturation 10–40%, lightness 40–80%), dark typography (lightness ≤15%)
    - Konfigurasi font: serif untuk H1/H2/H3 (via Google Fonts, font-display: swap), sans-serif untuk body/nav/button
    - Konfigurasi breakpoints: mobile <768px, tablet 768–1023px, desktop ≥1024px
    - Terapkan ke seluruh halaman: min vertical padding 64px desktop / 40px mobile antar section, separator border 1px opacity 0.1–0.25
    - Tidak ada: box-shadow blur >16px, border-radius >8px pada image container, CSS gradient pada hero/section bg, saturation >50% pada elemen UI
    - _Requirements: 16.1, 16.2, 16.6, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8_
  - [~] 11.2 Terapkan responsive layout Tailwind pada semua halaman dan partial
    - Navbar: horizontal links ≥1024px, hamburger <1024px
    - Homepage sections (Hero, About Preview, Mission): two-column ≥1024px, single-column <768px
    - Products grid: 3 col ≥1024px, 2 col 768–1023px, 1 col <768px
    - Gallery grid: min 2 col ≥768px, 1 col <768px
    - Contact: multi-column ≥768px, single-column ≤767px
    - Font sizes: body min 14px mobile / 16px desktop, H1 min 28px mobile / 40px desktop
    - Touch targets: min 44×44px pada mobile
    - _Requirements: 16.3, 16.4, 16.5, 16.6, 16.7_

- [ ] 12. Tambahkan semantic HTML, aksesibilitas, dan aset statis
  - [~] 12.1 Audit dan perbaiki semantic HTML5 pada semua views
    - Pastikan setiap halaman menggunakan `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` dengan benar
    - Pastikan semua `<img>` informatif memiliki `alt` non-empty; dekoratif menggunakan `alt=""`
    - Pastikan semua `<button>` dan `<a>` dapat dijangkau via Tab/Shift+Tab, aktivasi Enter/Space, dan menampilkan visible focus indicator
    - _Requirements: 18.1, 18.2, 18.3_
  - [~] 12.2 Tambahkan placeholder images ke `public/images/` dan buat `README.md` proyek
    - Siapkan struktur direktori `public/images/products/`, `public/images/gallery/`, dan gambar pendukung lainnya
    - Buat `README.md` dengan: prerequisites (Node.js & npm version), installation steps, cara start dev server, project structure
    - Buat `.env.example` dengan `PORT=3000`
    - _Requirements: 18.4, 18.5, 18.7_
  - [ ]* 12.3 Tulis property test untuk Property 7: Image Alt Attributes
    - **Property 7: All Rendered Pages Have Valid Image Alt Attributes**
    - **Validates: Requirements 18.2**
    - Iterasi semua route (/, /about, /products, /gallery, /contact) menggunakan `fc.constantFrom()`
    - Parse HTML dengan JSDOM, verifikasi setiap `<img>` memiliki attribute `alt`

- [ ] 13. Tulis integration tests dengan supertest dan property-based tests
  - [~] 13.1 Tulis route integration tests menggunakan supertest
    - `GET /` → HTTP 200, HTML berisi konten beranda
    - `GET /about` → HTTP 200
    - `GET /products` → HTTP 200, HTML berisi 4 filter buttons
    - `GET /products/:id` dengan id valid → HTTP 200
    - `GET /gallery` → HTTP 200
    - `GET /contact` → HTTP 200
    - `GET /unknown-path` → HTTP 404
    - _Requirements: 1.6, 9.1, 10.1, 13.1, 14.1_
  - [ ]* 13.2 Tulis property test untuk Property 2: All Undefined Routes Return HTTP 404
    - **Property 2: All Undefined Routes Return HTTP 404**
    - **Validates: Requirements 1.6**
    - Gunakan `fc.webPath()` dengan filter untuk mengecualikan route yang terdefinisi
    - Verifikasi semua path tak terdefinisi mengembalikan status 404
  - [ ]* 13.3 Tulis property test untuk Property 3: Product Listing Shows One Card Per Product
    - **Property 3: Product Listing Shows One Card Per Product**
    - **Validates: Requirements 10.2, 10.3**
    - Generate array produk valid secara arbitrary, render template, hitung `.product-card` di HTML output
    - Verifikasi jumlah card === jumlah produk
  - [ ]* 13.4 Tulis property test untuk Property 4: Filter Correctness
    - **Property 4: Filter Correctness for All Technique Values and URL Params**
    - **Validates: Requirements 10.5, 10.6, 10.8, 10.10**
    - Test fungsi `applyFilter(products, filterValue)` dengan kombinasi produk dan filter arbitrary
    - Verifikasi: teknik valid → hanya produk matching; "Semua"/invalid → semua produk
  - [ ]* 13.5 Tulis property test untuk Property 5: Non-Existent Product ID Returns 404
    - **Property 5: Non-Existent Product ID Returns 404**
    - **Validates: Requirements 11.3**
    - Generate id string arbitrary yang tidak ada di `data/products.json`
    - Verifikasi `GET /products/:id` mengembalikan status 404

- [~] 14. Checkpoint akhir — Semua tests harus lulus
  - Jalankan `npm test` dan pastikan semua test lulus
  - Pastikan tidak ada `<img>` tanpa `alt` attribute di seluruh halaman
  - Pastikan semantic HTML5 elemen hadir di setiap halaman
  - Tanyakan kepada user jika ada pertanyaan sebelum menutup pekerjaan.

## Notes

- Task yang ditandai `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task merujuk ke requirements spesifik untuk traceabilitas
- Semua konten dalam Bahasa Indonesia
- Checkpoint memastikan validasi bertahap
- Property tests menggunakan fast-check dengan minimum 100 iterasi (kecuali Property 6 yang deterministik, cukup 1 run)
- Unit tests memvalidasi contoh spesifik dan edge case; property tests memvalidasi invariant universal
- Semua JavaScript di `public/js/main.js` menggunakan Vanilla JS tanpa library eksternal
- Dependensi di `package.json` menggunakan versi exact (tanpa `^` atau `~`)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.4"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.5", "1.6", "3.1", "3.2"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5", "5.1", "6.1", "7.1", "8.1", "8.2", "8.3"] },
    { "id": 4, "tasks": ["10.1", "10.2", "10.3", "11.1"] },
    { "id": 5, "tasks": ["10.4", "11.2", "12.1", "12.2"] },
    { "id": 6, "tasks": ["12.3", "13.1"] },
    { "id": 7, "tasks": ["13.2", "13.3", "13.4", "13.5"] }
  ]
}
```
