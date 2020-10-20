const express = require('express');
const router = express.Router();

/**
 * @api {get} /unsecure/test Request Test
 * @apiName GetTest
 * @apiGroup Test
 *
 * @apiSuccess {String} message Ok.
 */
router.get('/test', (req, res) => {
  res.send( { message: 'ok' } );
});

module.exports = router;
