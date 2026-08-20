const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'Usimodist',
    techniques: ['Mirror', 'Blanket'],  
    transparentNav: true
  });
});

module.exports = router;