const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'Beranda | Usimodist',
    techniques: ['Pounding', 'Steam', 'Iron Blanket'],
    transparentNav: true
  });
});

module.exports = router;