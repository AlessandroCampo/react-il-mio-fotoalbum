const express = require('express');
const router = express.Router();
const { index, show } = require('../controllers/categoryController.js');


router.get('/', index);
router.get('/:category', show);


module.exports = router;