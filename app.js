'use strict';

// Load environment variables from .env at the very first line
require('dotenv').config();

const express = require('express');
const path = require('path');

// ─── Port Resolution ──────────────────────────────────────────────────────────

/**
 * Resolves the PORT to listen on.
 * Accepts any value from the environment, parses it as an integer,
 * validates it is in the range 1–65535, and falls back to 3000 otherwise.
 *
 * @param {*} envValue - The raw value from process.env.PORT (or similar)
 * @returns {number} A valid port integer between 1 and 65535
 */
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

// ─── App Setup ────────────────────────────────────────────────────────────────

const app = express();

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Configure EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Router Mounting ──────────────────────────────────────────────────────────

const indexRouter    = require('./routes/index');
const aboutRouter    = require('./routes/about');
const productsRouter = require('./routes/products');
const galleryRouter  = require('./routes/gallery');
const contactRouter  = require('./routes/contact');

app.use('/',         indexRouter);
app.use('/about',    aboutRouter);
app.use('/products', productsRouter);
app.use('/gallery',  galleryRouter);
app.use('/contact',  contactRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

// Catch-all for any request that did not match the routes above
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: '404 – Halaman Tidak Ditemukan | Usimodist',
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

// Must have four parameters so Express recognises it as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/404', {
    title: 'Error | Usimodist',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

// Only start listening when this file is run directly (not required by tests)
if (require.main === module) {
  const port = resolvePort(process.env.PORT);
  app.listen(port, () => {
    console.log(`[server] Usimodist berjalan di http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[server] Port ${port} sudah digunakan. Hentikan proses lain dan coba lagi.`);
    } else {
      console.error('[server] Gagal memulai server:', err.message);
    }
    process.exit(1);
  });
}

// Export app for testing (supertest)
module.exports = app;
module.exports.resolvePort = resolvePort;
