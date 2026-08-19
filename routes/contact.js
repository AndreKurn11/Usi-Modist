const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/contact', {
    title: 'Kontak | Usimodist'
  });
});

module.exports = router;
