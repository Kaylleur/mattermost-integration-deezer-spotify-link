/**
 * mattermost-integration-deezer-spotify-link -
 * 20/09/17
 * thomas
 * */
const express = require('express');
const router = express.Router();
const config = require('./config');

router.use(function (req, res, next) {
  if (config.mattermost.token !== req.body.token)
    res.status(400).send({ error: 'MATTERMOST TOKEN DOESNT MATCH' });
  next();
});

module.exports = router;
