var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to Community API...!' });
});

module.exports = router;
