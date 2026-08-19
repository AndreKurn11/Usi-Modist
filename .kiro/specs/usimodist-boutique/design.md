# Design Document

## Overview

Usimodist Boutique adalah website profil perusahaan boutique yang dibangun sebagai aplikasi web server-side rendered (SSR) menggunakan Node.js, Express.js, dan EJS sebagai template engine. Website ini berfungsi sebagai platform digital storytelling dan digital storefront untuk brand ecoprint Usimodist, menargetkan konsumen sadar lingkungan, penggemar fashion, dan pembeli grosir.

Pendekatan arsitektur **Multi-Page Application (MPA)** dengan SSR dipilih karena:
- Setiap halaman memiliki konten statis yang didefinisikan dengan baik dan tidak memerlukan state management kompleks di sisi klien
- SSR menghasilkan HTML yang dapat langsung diindeks oleh search engine (SEO-friendly)
- Tidak ada kebutuhan real-time data fetching atau autentikasi pengguna
- Tailwind CSS + EJS cukup untuk memenuhi seluruh kebutuhan UI/UX

Interaktivitas klien yang terbatas (hamburger menu, filter produk, smooth scroll, reveal animation) diimplementasikan menggunakan Vanilla JavaScript di `public/js/main.js`.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                        │
│  HTML/CSS/JS dari EJS render + Tailwind + public/js/main.js     │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTP Request
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Express.js Server (app.js)                  │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐│
│  │  Middleware  │   │    Router    │   │   Error Handlers     ││
│  │ (static,ejs) │──▶│  (routes/)   │──▶│  (404, 500)          ││
│  └──────────────┘   └──────┬───────┘   └──────────────────────┘│
│                             │                                   │
│                      ┌──────▼───────┐                          │
│                      │  Controller  │                          │
│                      │  (inline or  │                          │
│                      │  routes/*.js)│                          │
│                      └──────┬───────┘                          │
└─────────────────────────────┼───────────────────────────────────┘
                              │ res.render() / JSON
              ┌───────────────┴────────────────┐
              │                                │
    ┌─────────▼───────────┐        ┌──────────▼──────────┐
    │   EJS Views          │        │  data/products.json  │
    │ views/               │        │  (Product_Data)      │
    │  ├── pages/          │        └─────────────────────┘
    │  │   ├── index.ejs   │
    │  │   ├── about.ejs   │
    │  │   ├── products.ejs│
    │  │   ├── product.ejs │
    │  │   ├── gallery.ejs │
    │  │   ├── contact.ejs │
    │  │   └── 404.ejs     │
    │  └── partials/       │
    │      ├── header.ejs  │
    │      └── footer.ejs  │
    └─────────────────────┘
```

### Request Flow

1. Browser mengirim HTTP GET request ke Express server
2. Middleware statik melayani file dari `/public` (CSS, JS, gambar)
3. Router mencocokkan URL ke handler yang sesuai
4. Handler membaca `data/products.json` jika diperlukan (Products, Product Detail)
5. Handler memanggil `res.render()` dengan nama view dan data konteks
6. EJS merender template menjadi HTML (termasuk partials header/footer)
7. HTML dikembalikan ke browser

### Dependency Architecture

```
app.js
├── dotenv          – environment variable loading
├── express         – HTTP server framework
│   ├── express.static  – serve /public
│   └── express-ejs-layouts (opsional, atau manual include)
├── ejs             – view engine
├── routes/
│   ├── index.js    – GET /
│   ├── about.js    – GET /about
│   ├── products.js – GET /products, GET /products/:id
│   ├── gallery.js  – GET /gallery
│   └── contact.js  – GET /contact
└── data/
    └── products.json
```

---

## Components and Interfaces

### Server Entry Point (`app.js`)

Bertanggung jawab atas inisialisasi Express, konfigurasi middleware, mounting router, dan penanganan error.

```javascript
// Interface
app.listen(port)
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', './views')
```

**Konfigurasi Port:**
- Baca `process.env.PORT` via `dotenv`
- Validasi: `Number.isInteger(+val) && val >= 1 && val <= 65535`
- Fallback ke 3000 jika tidak valid, dengan `console.warn()`

### Router Modules (`routes/`)

Setiap file route mengekspor `express.Router()`:

| File | Route | Handler |
|------|-------|---------|
| `routes/index.js` | `GET /` | Render `pages/index` |
| `routes/about.js` | `GET /about` | Render `pages/about` |
| `routes/products.js` | `GET /products` | Baca JSON → render `pages/products` |
| `routes/products.js` | `GET /products/:id` | Cari produk by id → render `pages/product` atau 404 |
| `routes/gallery.js` | `GET /gallery` | Render `pages/gallery` |
| `routes/contact.js` | `GET /contact` | Render `pages/contact` |

**404 Handler** — dipasang di app.js setelah semua route:
```javascript
app.use((req, res) => {
  res.status(404).render('pages/404')
})
```

### EJS View Partials

#### `views/partials/header.ejs`
- Logo + nama brand (kiri)
- Nav links desktop: Beranda, Tentang, Produk, Galeri, Kontak (kanan)
- Tombol "Hubungi Kami" (link ke `/contact`)
- Hamburger icon (mobile, `<1024px`)
- Mobile menu (hidden by default, ditoggle oleh JS)

#### `views/partials/footer.ejs`
- Logo/brand name
- Nav links: Beranda, Tentang, Produk, Galeri, Kontak
- Social media links: Instagram, WhatsApp (`wa.me`)
- Copyright: `© <tahun> Usimodist`

### Page Views (`views/pages/`)

#### `index.ejs` — Homepage
Sections (dalam urutan):
1. Hero — heading H1, deskripsi, CTA button, gambar ecoprint
2. About Preview — label TENTANG KAMI, heading, deskripsi, CTA link, gambar alam
3. Technique Cards — 3 kartu teknik (Pounding, Steam, Iron Blanket)
4. Mission Section — label, heading, teks isu lingkungan, gambar + overlay, CTA
5. Contact Section — alamat, WhatsApp, email, Instagram, tombol Kontak

#### `about.ejs`
- Hero/banner dengan judul halaman
- Founding story & brand mission
- Eco-print process + environmental benefit
- Tiga teknik: Pounding, Steam, Iron Blanket
- Gambar dengan alt attribute
- Link ke `/products` atau `/contact`

#### `products.ejs`
- Tombol filter: Semua, Pounding, Steam, Iron Blanket
- Grid Product_Cards dengan data-attribute `data-technique`
- Setiap card: gambar, nama, teknik, shortDescription (≤150 karakter), link "Lihat Detail →"
- Filter pre-select via `?technique=` query param (dari server + JS)

#### `product.ejs`
- Product image (full-width mobile, ≥50% desktop)
- Nama produk H1/H2 serif
- Teknik, deskripsi lengkap, material, tanaman, proses produksi, karakteristik
- WhatsApp link + link ke `/contact`

#### `gallery.ejs`
- CSS grid/masonry, min 2 kolom ≥768px, 1 kolom <768px
- Gambar dengan alt, hover transition (opacity/scale)

#### `contact.ejs`
- Alamat fisik, WhatsApp link, email, Instagram, jam operasional
- Single column <768px, multi-column ≥768px

#### `404.ejs`
- Pesan 404 yang informatif + link kembali ke beranda

### Client-Side JavaScript (`public/js/main.js`)

Modul tunggal Vanilla JS dengan fungsi-fungsi:

```
initNavbar()
  - Hamburger toggle (#hamburger-btn → #mobile-menu)
  - Close menu saat link mobile diklik

initProductFilter()
  - Baca data-technique dari Product_Cards
  - Handle klik tombol filter
  - Tampilkan/sembunyikan cards sesuai filter
  - Sync dengan URL query param (?technique=)
  - pushState untuk update URL tanpa reload

initSmoothScroll()
  - Event listener pada anchor link href="#..."
  - scrollIntoView({ behavior: 'smooth' })

initRevealAnimation()
  - IntersectionObserver pada elemen [data-reveal]
  - Tambah class 'is-visible' saat masuk viewport
  - CSS transition: opacity 0→1, translateY 20px→0, duration 600ms
  - Elemen HARUS visible tanpa JS (graceful degradation)
```

---

## Data Models

### Product Object

Stored in `data/products.json` as a JSON array. Each product conforms to this schema:

```typescript
interface Product {
  id: string;            // slug: lowercase, digits, hyphens only. Unique. Non-empty.
  name: string;          // Non-empty display name
  technique: "Pounding" | "Steam" | "Iron Blanket";
  description: string;   // Non-empty full description
  shortDescription: string; // Non-empty, used in product cards
  material: string;      // Non-empty
  plants: string[];      // Array of at least 1 non-empty string
  image: string;         // Non-empty relative path (e.g. "/images/products/product-1.jpg")
  process: string;       // Non-empty production process description
  characteristics: string; // Non-empty
}
```

**Constraints:**
- Array HARUS mengandung ≥6 objek produk
- Minimal 2 produk per value teknik (Pounding, Steam, Iron Blanket)
- Nilai `id` unik di seluruh array
- `id` mengikuti format slug: `/^[a-z0-9]+(-[a-z0-9]+)*$/`
- `technique` harus persis salah satu dari tiga nilai (case-sensitive)

**Contoh record:**
```json
{
  "id": "batik-pounding-daun-jati",
  "name": "Kain Ecoprint Daun Jati – Pounding",
  "technique": "Pounding",
  "description": "Kain katun lembut dengan motif daun jati alami...",
  "shortDescription": "Motif daun jati alami dengan teknik pounding.",
  "material": "Katun 100%",
  "plants": ["Daun Jati", "Daun Mangga"],
  "image": "/images/products/batik-pounding-daun-jati.jpg",
  "process": "Daun segar ditata di atas kain yang telah mordanting...",
  "characteristics": "Motif organik unik, warna earthy tone, tekstur halus"
}
```

### Template Context Objects

#### Homepage (`/`)
```javascript
{ 
  title: 'Beranda | Usimodist',
  techniques: ['Pounding', 'Steam', 'Iron Blanket']
}
```

#### Products Listing (`/products`)
```javascript
{
  title: 'Produk | Usimodist',
  products: Product[],       // Array lengkap dari products.json
  selectedTechnique: string  // Dari ?technique= query param, atau ''
}
```

#### Product Detail (`/products/:id`)
```javascript
{
  title: `${product.name} | Usimodist`,
  product: Product           // Single product object
}
```

#### Other Pages (About, Gallery, Contact, 404)
```javascript
{
  title: '<Page Title> | Usimodist'
}
```

### Environment Variables (`.env`)

```
PORT=3000
```

Loaded via `dotenv.config()` di awal `app.js`.

### Project Directory Structure

```
usiModist/
├── app.js                  # Entry point, Express setup
├── package.json            # Dependencies (pinned versions)
├── .env                    # Environment variables (gitignored)
├── .env.example            # Template .env
├── README.md               # Dokumentasi proyek
├── tailwind.config.js      # Tailwind CSS configuration
├── data/
│   └── products.json       # Product_Data
├── routes/
│   ├── index.js
│   ├── about.js
│   ├── products.js
│   ├── gallery.js
│   └── contact.js
├── views/
│   ├── pages/
│   │   ├── index.ejs
│   │   ├── about.ejs
│   │   ├── products.ejs
│   │   ├── product.ejs
│   │   ├── gallery.ejs
│   │   ├── contact.ejs
│   │   └── 404.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
└── public/
    ├── css/
    │   └── style.css       # Tailwind compiled output
    ├── js/
    │   └── main.js         # Vanilla JS interactions
    └── images/
        ├── products/       # Gambar produk
        ├── gallery/        # Gambar galeri
        └── ...             # Gambar hero, about, dsb.
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

---

### Property 1: Port Resolution Falls Back to 3000 for All Invalid Input

*For any* string or value provided as the `PORT` environment variable — whether non-numeric, a float, zero, negative, above 65535, empty, undefined, or absent — the port resolution function SHALL return a valid integer in the range 1–65535, and for invalid/absent values it SHALL return 3000.

**Validates: Requirements 1.1, 1.4, 1.5**

---

### Property 2: All Undefined Routes Return HTTP 404

*For any* URL path that does not match any of the defined routes (`/`, `/about`, `/products`, `/products/:id`, `/gallery`, `/contact`), the server SHALL respond with HTTP status code 404 and render the 404 EJS template.

**Validates: Requirements 1.6**

---

### Property 3: Product Listing Shows One Card Per Product

*For any* array of N valid product objects loaded from `data/products.json` and passed to the Products_Page template, the rendered HTML SHALL contain exactly N Product_Cards, each displaying the corresponding product's name, technique, shortDescription, and a link to `/products/:id`.

**Validates: Requirements 10.2, 10.3**

---

### Property 4: Filter Correctness for All Technique Values and URL Params

*For any* set of products and *for any* filter input — whether a valid technique name ("Pounding", "Steam", "Iron Blanket") applied via button click or `?technique=` URL parameter, the "Semua" default, or an unrecognized technique string — the filter function SHALL display exactly the products whose technique matches the active filter (case-insensitive), or all products when the filter is "Semua" or the input is unrecognized.

**Validates: Requirements 10.5, 10.6, 10.8, 10.10**

---

### Property 5: Non-Existent Product ID Returns 404

*For any* string value used as the `:id` route parameter that does not correspond to an `id` field in `data/products.json`, the server SHALL respond with HTTP status code 404 and render the 404 EJS template.

**Validates: Requirements 11.3**

---

### Property 6: Product_Data Schema and ID Integrity

*For every* product object in `data/products.json` — and *for any* valid products.json file — all required fields (`id`, `name`, `technique`, `description`, `shortDescription`, `material`, `plants`, `image`, `process`, `characteristics`) SHALL be present with the correct types and non-empty values; `technique` SHALL be exactly one of "Pounding", "Steam", or "Iron Blanket"; each `id` SHALL be unique across the array; and each `id` SHALL match the slug pattern `/^[a-z0-9]+(-[a-z0-9]+)*$/`.

**Validates: Requirements 12.2, 12.4**

---

### Property 7: All Rendered Pages Have Valid Image Alt Attributes

*For any* rendered HTML page across all routes, every `<img>` element SHALL have an `alt` attribute present in the DOM. No `<img>` element SHALL be missing the `alt` attribute entirely.

**Validates: Requirements 18.2**

---

## Error Handling

### Server Startup Errors

| Kondisi | Penanganan |
|---------|------------|
| `PORT` tidak ada di `.env` / `.env` tidak ada | Gunakan port 3000, tidak melempar exception |
| `PORT` bukan integer valid (1–65535) | Gunakan port 3000, log `console.warn('Invalid PORT value, falling back to 3000')` |
| Port sudah digunakan (EADDRINUSE) | Log error dan exit dengan kode non-zero: `process.exit(1)` |

```javascript
// Contoh implementasi port resolution
function resolvePort(envValue) {
  const parsed = parseInt(envValue, 10);
  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 65535) {
    return parsed;
  }
  if (envValue !== undefined && envValue !== '') {
    console.warn(`[server] Invalid PORT value "${envValue}", falling back to 3000`);
  }
  return 3000;
}
```

### Route-Level Errors

| Kondisi | Penanganan |
|---------|------------|
| Route tidak terdefinisi (any method/path) | 404 handler → `res.status(404).render('pages/404')` |
| Error baca `products.json` | 500 handler → log error + `res.status(500).render('pages/500')` atau generic error |
| Product id tidak ditemukan | `res.status(404).render('pages/404')` |
| Error internal Express (tak terduga) | Global error handler: `app.use((err, req, res, next) => {...})` → HTTP 500 |

```javascript
// 404 handler (setelah semua route)
app.use((req, res) => {
  res.status(404).render('pages/404', { title: '404 – Halaman Tidak Ditemukan | Usimodist' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/404', { title: 'Error | Usimodist' }); // atau 500.ejs
});
```

### Data Loading Errors

Product data dibaca dari `data/products.json` di setiap request ke `/products` dan `/products/:id`. Jika file tidak dapat dibaca:

```javascript
// routes/products.js
router.get('/', (req, res, next) => {
  let products;
  try {
    products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8'));
  } catch (err) {
    return next(err); // Diserahkan ke global error handler
  }
  res.render('pages/products', { title: 'Produk | Usimodist', products, selectedTechnique: req.query.technique || '' });
});
```

**Catatan optimasi**: Untuk production, `products.json` dapat di-cache di module scope atau di-require langsung (Node.js meng-cache `require()` secara otomatis), lalu di-reload hanya saat file berubah. Untuk website company profile dengan data statis, pendekatan `require('./data/products.json')` sudah cukup.

### Client-Side Errors

| Kondisi | Penanganan |
|---------|------------|
| Gambar gagal dimuat | `alt` attribute menampilkan teks deskriptif; layout grid tidak rusak |
| JavaScript dinonaktifkan | Semua konten tetap visible (Reveal_Animation elements tidak tersembunyi sebelum JS berjalan); navigasi hamburger tidak berfungsi tapi layout desktop tetap bisa digunakan |
| URL param `?technique=` tidak valid | Filter default ke "Semua" — semua produk ditampilkan |

---

## Testing Strategy

### Pendekatan Pengujian Dual

Strategi pengujian menggunakan dua lapisan yang saling melengkapi:
- **Unit/Integration Tests** — memverifikasi contoh spesifik, kondisi edge case, dan perilaku server
- **Property-Based Tests** — memverifikasi properti universal menggunakan input yang digenerate secara acak

### Library yang Digunakan

| Keperluan | Library |
|-----------|---------|
| Test runner | **Jest** (versi pinned) |
| Property-based testing | **fast-check** (versi pinned) |
| HTTP request testing | **supertest** (versi pinned) |
| DOM testing | **JSDOM** (via Jest environment) |

### Unit Tests (Example-Based)

Test-test berikut memverifikasi perilaku spesifik dengan contoh konkret:

**Server & Routes**
- `GET /` mengembalikan HTTP 200 dan merender halaman beranda
- `GET /about` mengembalikan HTTP 200
- `GET /products` mengembalikan HTTP 200 dan HTML mengandung filter buttons
- `GET /gallery` mengembalikan HTTP 200
- `GET /contact` mengembalikan HTTP 200

**Navbar (header.ejs)**
- Rendered HTML mengandung semua 5 nav links (Beranda, Tentang, Produk, Galeri, Kontak)
- Rendered HTML mengandung link "Hubungi Kami" menuju `/contact`

**Product Data (products.json)**
- File mengandung ≥6 produk
- Minimal 2 produk per teknik (Pounding, Steam, Iron Blanket)

**Client-Side JS**
- Klik hamburger menampilkan mobile menu (JSDOM test)
- Klik link mobile menutup mobile menu (JSDOM test)
- Anchor link `#...` memicu smooth scroll (JSDOM test)

### Property-Based Tests

Setiap property test dikonfigurasi minimum **100 iterasi**. Setiap test diberi tag komentar referensi ke properti desain.

#### Test for Property 1: Port Resolution

```javascript
// Feature: usimodist-boutique, Property 1: Port resolution falls back to 3000 for all invalid input
test('resolvePort returns valid port for any input', () => {
  fc.assert(fc.property(
    fc.oneof(
      fc.integer({ min: 1, max: 65535 }),     // valid
      fc.integer({ max: 0 }),                  // too low
      fc.integer({ min: 65536 }),              // too high
      fc.string(),                              // non-numeric
      fc.constant(undefined),                   // absent
      fc.constant('')                           // empty
    ),
    (value) => {
      const result = resolvePort(value);
      return Number.isInteger(result) && result >= 1 && result <= 65535;
    }
  ), { numRuns: 100 });
});
```

#### Test for Property 2: Unknown Routes Return 404

```javascript
// Feature: usimodist-boutique, Property 2: All undefined routes return HTTP 404
test('undefined routes always return 404', async () => {
  await fc.assert(fc.asyncProperty(
    fc.webPath().filter(p => !['/', '/about', '/products', '/gallery', '/contact'].some(r => p === r || p.startsWith(r + '/'))),
    async (path) => {
      const response = await request(app).get(path);
      return response.status === 404;
    }
  ), { numRuns: 100 });
});
```

#### Test for Property 3: Product Listing Shows One Card Per Product

```javascript
// Feature: usimodist-boutique, Property 3: Product listing shows one card per product
test('rendered products page has one card per product', async () => {
  await fc.assert(fc.asyncProperty(
    fc.array(validProductArbitrary(), { minLength: 1, maxLength: 20 }),
    async (products) => {
      const html = await renderTemplate('pages/products', { products, selectedTechnique: '' });
      const cardCount = (html.match(/class="product-card"/g) || []).length;
      return cardCount === products.length;
    }
  ), { numRuns: 100 });
});
```

#### Test for Property 4: Filter Correctness

```javascript
// Feature: usimodist-boutique, Property 4: Filter correctness for all technique values and URL params
test('filter shows correct products for any technique input', () => {
  fc.assert(fc.property(
    fc.array(validProductArbitrary(), { minLength: 1, maxLength: 30 }),
    fc.oneof(
      fc.constant('Pounding'),
      fc.constant('Steam'),
      fc.constant('Iron Blanket'),
      fc.constant('Semua'),
      fc.string() // arbitrary/invalid values
    ),
    (products, filterValue) => {
      const result = applyFilter(products, filterValue);
      const validTechniques = ['Pounding', 'Steam', 'Iron Blanket'];
      if (!validTechniques.includes(filterValue) || filterValue === 'Semua') {
        return result.length === products.length;
      }
      return result.every(p => p.technique.toLowerCase() === filterValue.toLowerCase());
    }
  ), { numRuns: 100 });
});
```

#### Test for Property 5: Non-Existent Product ID Returns 404

```javascript
// Feature: usimodist-boutique, Property 5: Non-existent product ID returns 404
test('unknown product ids always return 404', async () => {
  await fc.assert(fc.asyncProperty(
    fc.string({ minLength: 1 }).filter(id => !existingProductIds.includes(id)),
    async (id) => {
      const response = await request(app).get(`/products/${id}`);
      return response.status === 404;
    }
  ), { numRuns: 100 });
});
```

#### Test for Property 6: Product_Data Schema Integrity

```javascript
// Feature: usimodist-boutique, Property 6: Product_Data schema and ID integrity
test('all products in products.json satisfy schema constraints', () => {
  const products = require('./data/products.json');
  fc.assert(fc.property(
    fc.constant(products),
    (prods) => {
      const ids = new Set();
      return prods.every(p => {
        const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
        const validTechniques = ['Pounding', 'Steam', 'Iron Blanket'];
        const unique = !ids.has(p.id) && ids.add(p.id);
        return (
          unique &&
          typeof p.id === 'string' && slugRegex.test(p.id) &&
          typeof p.name === 'string' && p.name.length > 0 &&
          validTechniques.includes(p.technique) &&
          typeof p.description === 'string' && p.description.length > 0 &&
          typeof p.shortDescription === 'string' && p.shortDescription.length > 0 &&
          typeof p.material === 'string' && p.material.length > 0 &&
          Array.isArray(p.plants) && p.plants.length >= 1 &&
          typeof p.image === 'string' && p.image.length > 0 &&
          typeof p.process === 'string' && p.process.length > 0 &&
          typeof p.characteristics === 'string' && p.characteristics.length > 0
        );
      });
    }
  ), { numRuns: 1 }); // Deterministic data, 1 run is sufficient
});
```

#### Test for Property 7: Image Alt Attribute Completeness

```javascript
// Feature: usimodist-boutique, Property 7: All rendered pages have valid image alt attributes
test('no img element is missing alt attribute across all pages', async () => {
  const routes = ['/', '/about', '/products', '/gallery', '/contact'];
  await fc.assert(fc.asyncProperty(
    fc.constantFrom(...routes),
    async (route) => {
      const response = await request(app).get(route);
      const dom = new JSDOM(response.text);
      const images = dom.window.document.querySelectorAll('img');
      return Array.from(images).every(img => img.hasAttribute('alt'));
    }
  ), { numRuns: 100 });
});
```

### Test Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'app.js',
    'routes/**/*.js',
    'public/js/main.js'
  ]
};
```

### Graceful Degradation Tests

- Verifikasi elemen dengan `data-reveal` tidak menggunakan `opacity: 0` / `visibility: hidden` via inline style (CSS class-based only)
- Verifikasi filter buttons tidak hidden via inline style di initial HTML (semua produk visible di initial render)

### Aksesibilitas

Pengujian aksesibilitas dilakukan secara manual menggunakan screen reader dan keyboard navigation. Automated checks untuk:
- Keberadaan `alt` attribute pada semua `<img>` (Property 7)
- Keberadaan `<header>`, `<nav>`, `<main>`, `<footer>` semantic elements di setiap halaman
- Semua `<button>` dan `<a>` reachable via Tab (verifikasi DOM order)

> **Catatan:** Validasi aksesibilitas penuh memerlukan pengujian manual dengan assistive technologies dan expert accessibility review. Automated tests di atas merupakan subset dari pemeriksaan yang diperlukan.
