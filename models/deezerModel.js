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

  searchTrack: function (trackSearched, album, artist) {
    return deezer.requestAsync(config.deezer.accessToken,
      {
        resource: 'search/track/?q=track:"' + trackSearched + '"',
        method: 'get',
      })
      .then(result => {
        for (let i = 0; i < result.data.length; i++) {
          let track = result.data[i];
          if (track.artist.name.toLowerCase() === artist.toLowerCase() && track.title.toLowerCase() === trackSearched.toLowerCase())
            return track;
        }

        return null;
      });
  },

  getAlbum: function (id) {
    return deezer.requestAsync(config.deezer.accessToken,
      {
        resource: 'album/' + id,
        method: 'get',
      });
  },

  searchAlbum: function (albumSearched, artist) {
    return deezer.requestAsync(config.deezer.accessToken,
      {
        resource: 'search/album/?q=album:"' + albumSearched + '"',
        method: 'get',
      })
      .then(result => {
        for (let i = 0; i < result.data.length; i++) {
          let album = result.data[i];
          if (album.artist.name.toLowerCase() === artist.toLowerCase() && album.title.toLowerCase() === albumSearched.toLowerCase())
            return album;
        }

        return null;
      });
  },

  getArtist: function (id) {
    return deezer.requestAsync(config.deezer.accessToken,
      {
        resource: 'artist/' + id,
        method: 'get',
      });
  },

  searchArtist: function (artistSearched) {
    return deezer.requestAsync(config.deezer.accessToken,
      {
        resource: 'search/artist/?q=artist:"' + artistSearched + '"',
        method: 'get',
      })
      .then(result => {
        for (let i = 0; i < result.data.length; i++) {
          let artist = result.data[i];
          if (artist.name.toLowerCase() === artistSearched.toLowerCase())
            return artist;
        }

        return null;
      });
  },
};
