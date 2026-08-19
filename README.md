# Usimodist Boutique — Website Profil Perusahaan

Website profil perusahaan boutique ecoprint Usimodist. Dibangun dengan Node.js + Express.js + EJS + Tailwind CSS sebagai Multi-Page Application (MPA).

---

## Prerequisites

- **Node.js** v18.8.0 or higher
- **npm** v9.0.0 or higher

Cek versi yang terinstall:
```bash
node --version
npm --version
```

---

## Installation

1. Clone atau download repositori ini:
   ```bash
   git clone <repo-url>
   cd usiModist
   ```

2. Install semua dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env` dari template:
   ```bash
   copy .env.example .env
   ```
   Sesuaikan `PORT` jika diperlukan (default: `3000`).

4. Build Tailwind CSS:
   ```bash
   npm run build:css
   ```

---

## Starting the Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`. Nodemon akan me-restart server otomatis saat ada perubahan file.

Untuk production:
```bash
npm start
```

---

## Running Tests

```bash
npm test
```

Menjalankan semua unit tests, integration tests, dan property-based tests menggunakan Jest + fast-check + supertest.

---

## Project Structure

```
usiModist/
├── app.js                  # Entry point Express — resolvePort(), middleware, routers, error handlers
├── package.json            # Dependencies dengan versi pinned (tanpa ^ atau ~)
├── tailwind.config.js      # Konfigurasi Tailwind CSS (content paths, fonts, breakpoints)
├── .env                    # Environment variables (tidak di-commit ke git)
├── .env.example            # Template .env
├── README.md               # Dokumentasi proyek ini
│
├── data/
│   └── products.json       # Product_Data: array produk ecoprint (6+ produk, 3 teknik)
│
├── routes/
│   ├── index.js            # GET / → halaman beranda
│   ├── about.js            # GET /about → halaman tentang
│   ├── products.js         # GET /products, GET /products/:id
│   ├── gallery.js          # GET /gallery → halaman galeri
│   └── contact.js          # GET /contact → halaman kontak
│
├── views/
│   ├── pages/
│   │   ├── index.ejs       # Homepage (Hero, About Preview, Technique Cards, Mission, Contact)
│   │   ├── about.ejs       # Halaman Tentang
│   │   ├── products.ejs    # Daftar produk dengan filter
│   │   ├── product.ejs     # Detail satu produk
│   │   ├── gallery.ejs     # Galeri foto
│   │   ├── contact.ejs     # Halaman kontak
│   │   └── 404.ejs         # Halaman 404
│   └── partials/
│       ├── head.ejs        # HTML <head> (meta, CSS, fonts, JS deferred)
│       ├── header.ejs      # Navbar (logo, nav links, hamburger menu)
│       └── footer.ejs      # Footer (brand, nav links, social media, copyright)
│
├── public/
│   ├── css/
│   │   ├── style.css       # Tailwind source (input)
│   │   └── output.css      # Tailwind compiled output (gunakan ini di HTML)
│   ├── js/
│   │   └── main.js         # Vanilla JS: navbar toggle, product filter, smooth scroll, reveal animation
│   └── images/
│       ├── products/       # Gambar produk (format: /images/products/<slug>.jpg)
│       ├── gallery/        # Gambar galeri
│       └── ...             # Hero, about, technique images
│
└── __tests__/              # Test suite (Jest + fast-check + supertest)
    ├── routes.test.js      # Integration tests semua route
    └── properties.test.js  # Property-based tests (7 properties)
```

---

## Available Routes

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/` | Halaman beranda |
| GET | `/about` | Halaman tentang |
| GET | `/products` | Daftar semua produk |
| GET | `/products?technique=Pounding` | Produk difilter by teknik |
| GET | `/products/:id` | Detail satu produk |
| GET | `/gallery` | Galeri foto |
| GET | `/contact` | Halaman kontak |
| `*` | `*` | 404 — Halaman tidak ditemukan |

---

## Environment Variables

| Variabel | Default | Deskripsi |
|----------|---------|-----------|
| `PORT` | `3000` | Port server Express (integer 1–65535) |

---

## Menambahkan Produk Baru

Edit `data/products.json` dan tambahkan objek produk baru mengikuti schema:

```json
{
  "id": "nama-produk-slug",
  "name": "Nama Produk Lengkap",
  "technique": "Pounding",
  "description": "Deskripsi lengkap produk...",
  "shortDescription": "Deskripsi singkat ≤150 karakter.",
  "material": "Material kain",
  "plants": ["Daun A", "Daun B"],
  "image": "/images/products/nama-produk-slug.jpg",
  "process": "Proses produksi...",
  "characteristics": "Karakteristik produk..."
}
```

Nilai `technique` harus salah satu dari: `"Pounding"`, `"Steam"`, atau `"Iron Blanket"`.
