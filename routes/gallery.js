const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/gallery', {
    title: 'Galeri | Usimodist'
  });
});

module.exports = router;
