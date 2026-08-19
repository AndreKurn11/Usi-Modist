/**
 * __tests__/routes.test.js
 * Route integration tests using supertest.
 * Requirements: 1.6, 9.1, 10.1, 13.1, 14.1
 */

'use strict';

const request = require('supertest');
const app = require('../app');

// ── GET / ─────────────────────────────────────────────────────────
describe('GET /', () => {
  it('should return HTTP 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  it('should return HTML content type', async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-type']).toMatch(/html/);
  });

  it('should contain hero heading text', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('Usimodist');
  });
});

// ── GET /about ────────────────────────────────────────────────────
describe('GET /about', () => {
  it('should return HTTP 200', async () => {
    const res = await request(app).get('/about');
    expect(res.status).toBe(200);
  });

  it('should contain page title/heading', async () => {
    const res = await request(app).get('/about');
    expect(res.text.toLowerCase()).toContain('tentang');
  });
});

// ── GET /products ─────────────────────────────────────────────────
describe('GET /products', () => {
  it('should return HTTP 200', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
  });

  it('should contain all 4 filter buttons', async () => {
    const res = await request(app).get('/products');
    expect(res.text).toContain('Semua');
    expect(res.text).toContain('Pounding');
    expect(res.text).toContain('Steam');
    expect(res.text).toContain('Iron Blanket');
  });

  it('should contain at least one product-card', async () => {
    const res = await request(app).get('/products');
    expect(res.text).toContain('product-card');
  });

  it('should accept ?technique=Pounding and return 200', async () => {
    const res = await request(app).get('/products?technique=Pounding');
    expect(res.status).toBe(200);
  });
});

// ── GET /products/:id (valid) ─────────────────────────────────────
describe('GET /products/:id', () => {
  const products = require('../data/products.json');

  it('should return HTTP 200 for a valid product id', async () => {
    const validId = products[0].id;
    const res = await request(app).get(`/products/${validId}`);
    expect(res.status).toBe(200);
  });

  it('should contain the product name in HTML', async () => {
    const product = products[0];
    const res = await request(app).get(`/products/${product.id}`);
    expect(res.text).toContain(product.name);
  });

  it('should return HTTP 404 for an unknown product id', async () => {
    const res = await request(app).get('/products/this-id-does-not-exist-xyz-123');
    expect(res.status).toBe(404);
  });
});

// ── GET /gallery ──────────────────────────────────────────────────
describe('GET /gallery', () => {
  it('should return HTTP 200', async () => {
    const res = await request(app).get('/gallery');
    expect(res.status).toBe(200);
  });
});

// ── GET /contact ──────────────────────────────────────────────────
describe('GET /contact', () => {
  it('should return HTTP 200', async () => {
    const res = await request(app).get('/contact');
    expect(res.status).toBe(200);
  });

  it('should contain contact information', async () => {
    const res = await request(app).get('/contact');
    expect(res.text).toContain('wa.me');
  });
});

// ── GET unknown path → 404 ────────────────────────────────────────
describe('Unknown routes', () => {
  it('should return HTTP 404 for /unknown-path', async () => {
    const res = await request(app).get('/unknown-path');
    expect(res.status).toBe(404);
  });

  it('should return HTTP 404 for /nonexistent/nested', async () => {
    const res = await request(app).get('/nonexistent/nested');
    expect(res.status).toBe(404);
  });
});
