const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res, next) => {
  let products;
  try {
    products = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8')
    );
  } catch (err) {
    return next(err);
  }
  res.render('pages/products', {
    title: 'Produk | Usimodist',
    products,
    selectedTechnique: req.query.technique || ''
  });
});

router.get('/:id', (req, res, next) => {
  let products;
  try {
    products = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8')
    );
  } catch (err) {
    return next(err);
  }
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).render('pages/404', {
      title: '404 – Halaman Tidak Ditemukan | Usimodist'
    });
  }
  res.render('pages/product', {
    title: `${product.name} | Usimodist`,
    product
  });
});

module.exports = router;
