const express = require('express');

// const { route } = require('../app');

const file = require('../components/file/routes');
const generate = require('../components/generate/routes');

const router = express.Router();

router.use('/api/v1.0/files', file);
router.use('/api/v1.0/generate', generate);

router.get('/about', (req, res) => {
  res.send('Acerca de nosotros');
});


module.exports = router;