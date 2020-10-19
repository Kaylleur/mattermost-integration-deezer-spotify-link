/**
 * mattermost-integration-deezer-spotify-link -
 * 12/09/17
 * thomas
 * */
const config = require("../config");
const SpotifyApi = require("spotify-web-api-node");
const spotify = new SpotifyApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUri,
});

module.exports = {
  getTrack: function (id) {
    return spotify
      .getTracks([id])
      .then((data) => (data.body.tracks[0] ? data.body.tracks[0] : null));
  },

  searchTrack: function (trackSearched, album, artist) {
    return spotify.searchTracks(trackSearched).then((data) => {
      for (let i = 0; i < data.body.tracks.items.length; i++) {
        let track = data.body.tracks.items[i];
        if (
          track.artists[0].name.toLowerCase() === artist.toLowerCase() &&
          track.name.toLowerCase() === trackSearched.toLowerCase()
        )
          return track;
      }

      return null;
    });
  },

  getAlbum: function (id) {
    return spotify.getAlbum(id).then((data) => data.body);
  },

  searchAlbum: function (albumSearched, artist) {
    return spotify.searchAlbums(albumSearched).then((data) => {
      for (let i = 0; i < data.body.albums.items.length; i++) {
        let album = data.body.albums.items[i];
        if (
          album.artists[0].name.toLowerCase() === artist.toLowerCase() &&
          album.name.toLowerCase() === albumSearched.toLowerCase()
        )
          return album;
      }

      return null;
    });
  },

  getArtist: function (id) {
    return spotify.getArtist(id).then((data) => data.body);
  },

  searchArtist: function (artistSearched) {
    return spotify.searchArtists(artistSearched).then((data) => {
      for (let i = 0; i < data.body.artists.items.length; i++) {
        let artist = data.body.artists.items[i];
        if (artist.name.toLowerCase() === artistSearched.toLowerCase())
          return artist;
      }

      return null;
    });
  },

  initSpotify: function () {
    return spotify.clientCredentialsGrant().then(function (data) {
      // Save the access token so that it's used in future calls
      spotify.setAccessToken(data.body["access_token"]);
      return spotify;
    });
  },
};
