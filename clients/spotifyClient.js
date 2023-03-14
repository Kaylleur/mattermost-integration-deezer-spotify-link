const config = require('../config');
const SpotifyApi = require('spotify-web-api-node');
const spotify = new SpotifyApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
});

/**
 * Initialize the Spotify client.
 * 
 * @returns {Promise<any>}
 */
const initSpotify = function () {
  return spotify.clientCredentialsGrant()
    .then(function (data) {
      // Save the access token so that it's used in future calls
      spotify.setAccessToken(data.body['access_token']);
    });
}

/**
 *
 * @type {{
 *    getName: (function(): string),
 *    getTrack: (function(id: string): Promise<{track: string, album: string, artist: string}>),
 *    searchTrack: (function({track: string, album: string, artist: string}): Promise<string>),
 *    getAlbum: (function(id: string): Promise<{artist: string, title: string}>),
 *    searchAlbum: (function({album: string, artist: string}): Promise<string>),
 *    getArtist: (function(id: string): Promise<{artist: string}>),
 *    searchArtist: (function({artist: string}): Promise<string>)
 *  }}
 */
module.exports = {
  /**
   * Gives the name of this client.
   *
   * @returns {string}
   */
  getName: function () {
      return "Spotify";
  },

  /**
   * Retrieve a track using its id.
   *
   * @param id
   * @returns {Promise<{track: string, album: string, artist: string}>}
   * @throws Error
   */
  getTrack: function (id) {
    return initSpotify().then(() => {
      return spotify.getTracks([id])
        .then(data => {
          if (data.body.tracks[0]) {
            const result = data.body.tracks[0];

            console.log(`Found track ${result.name} on album ${result.album.name} from artist ${result.artists[0].name}.`);
            return {
              track: result.name,
              album: result.album.name,
              artist: result.artists[0].name,
            }
          }

          throw new Error(`Track ${id} not found.`);
        });
    });
  },

  /**
   * Search a track using its metadata.
   *
   * @param toSearch {{track: string, album: string, artist: string}}
   * @returns {Promise<string>} The link to the found resource.
   * @throws Error
   */
  searchTrack: function (toSearch) {
    return initSpotify().then(() => {
      return spotify.searchTracks(toSearch.track)
        .then(data => {
          for (let i = 0; i < data.body.tracks.items.length; i++) {
            let track = data.body.tracks.items[i];
            if (track.artists[0].name.toLowerCase() === toSearch.artist.toLowerCase() && track.name.toLowerCase() === toSearch.track.toLowerCase()) {
              return track.external_urls.spotify;
            }
          }

          throw new Error(`Track ${toSearch.track} on album ${toSearch.artist} from ${toSearch.artist} not found.`);
        });
    });
  },

  /**
   * Retrieve an album using its id.
   *
   * @param id
   * @returns {Promise<{album: string, artist: string}>}
   * @throws Error
   */
  getAlbum: function (id) {
    return initSpotify().then(() => {
      return spotify.getAlbum(id)
        .then(data => {
          console.log(`Found album ${data.body.name} from artist ${data.body.artists[0].name}.`);

          return {
            album: data.body.name,
            artist: data.body.artists[0].name,
          }
        });
    });
  },

  /**
   * Search an album using its metadata.
   *
   * @param toSearch {{album: string, artist: string}}
   * @returns {Promise<string>} The link to the found resource.
   * @throws Error
   */
  searchAlbum: function (toSearch) {
    return initSpotify().then(() => {
      return spotify.searchAlbums(toSearch.album)
        .then(data => {
          for (let i = 0; i < data.body.albums.items.length; i++) {
            let album = data.body.albums.items[i];
            if (album.artists[0].name.toLowerCase() === toSearch.artist.toLowerCase() && album.name.toLowerCase() === toSearch.album.toLowerCase()) {
              return album.external_urls.spotify;
            }
          }

          throw new Error(`Album ${toSearch.album} from ${toSearch.artist} not found.`);
        });
    });
  },

  /**
   * Retrieve an artist using its id.
   *
   * @param id
   * @returns {Promise<{artist: string}>}
   * @throws Error
   */
  getArtist: function (id) {
    return initSpotify().then(() => {
      return spotify.getArtist(id)
        .then(data => {
          console.log(`Found artist ${data.body.name}.`);

          return {
            artist: data.body.name
          }
        });
    });
  },

  /**
   * Search an artist using its metadata.
   *
   * @param toSearch {{artist: string}}
   * @returns {Promise<string>} The link to the found resource.
   * @throws Error
   */
  searchArtist: function (toSearch) {
    return initSpotify().then(() => {
      return spotify.searchArtists(toSearch.artist)
        .then(data => {
          for (let i = 0; i < data.body.artists.items.length; i++) {
            let artist = data.body.artists.items[i];
            if (artist.name.toLowerCase() === toSearch.artist.toLowerCase()) {
              return artist.external_urls.spotify;
            }
          }

          throw new Error(`Artist ${toSearch.artist} not found.`);
        });
    });
  },
};
