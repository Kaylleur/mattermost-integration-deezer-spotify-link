/**
 * mattermost-integration-deezer-spotify-link -
 * 12/09/17
 * thomas
 * */

const Promise = require('bluebird'); // Promises
const config = require('../config');
const deezer = new (require('node-deezer'))();

Promise.promisifyAll(deezer);

module.exports = {
  getTrack: function (id) {
    return deezer.requestAsync(config.deezer.accessToken,
      {
        resource: 'track/' + id,
        method: 'get',
      });
  },

  searchTrack: function (track) {

  },

  getAlbum: function (id) {
    return deezer.requestAsync(config.deezer.accessToken,
      {
        resource: 'album/' + id,
        method: 'get',
      });
  },

  searchAlbum: function (album) {

  },

  getArtist: function (id) {
    return deezer.requestAsync(config.deezer.accessToken,
      {
        resource: 'artist/' + id,
        method: 'get',
      });
  },

  searchArtist: function (artist) {

  },
};
