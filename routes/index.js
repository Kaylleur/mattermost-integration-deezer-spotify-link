var express = require('express');
var router = express.Router();
const converterController = require('../controllers/converterController');

router.post('/convert', converterController.convertLink);

module.exports = router;
