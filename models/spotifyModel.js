/**
 * mattermost-integration-deezer-spotify-link -
 * 12/09/17
 * thomas
 * */
const config = require('../config');
const spotify = new (require('spotify-web-api-node'))({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri,
});

module.exports = {
  getTrack: function (id) {

  },

  searchTrack: function (trackSearched) {
    return spotify.searchTracks(trackSearched.trackName)
      .then(data => {
        for (var i = 0; i < data.body.tracks.items.length; i++) {
          let track = data.body.tracks.items[i];
          if (track.artists[0].name === trackSearched.artistName && track.name === trackSearched.trackName)
            return track;
        }

        return null;
      });
  },

  getAlbum: function (id) {

  },

  searchAlbum: function (album) {

  },

  getArtist: function (id) {

  },

  searchArtist: function (artist) {

  },

  initSpotify: function () {
    return spotify.clientCredentialsGrant()
      .then(function (data) {
        // Save the access token so that it's used in future calls
        spotify.setAccessToken(data.body['access_token']);
        return spotify;
      });
  },
};
