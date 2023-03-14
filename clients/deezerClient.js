const axios = require('axios');
const apiUrl = 'https://api.deezer.com/';

/**
 * @type {{
 *    getName: (function(): string),
 *    getTrack: (function(id: string): Promise<{track: string, album: string, artist: string}>),
 *    searchTrack: (function({track: string, album: string, artist: string}): Promise<string>),
 *    getAlbum: (function(id: string): Promise<{artist: string, title: string}>),
 *    searchAlbum: (function({album: string, artist: string}): Promise<string>),
 *    getArtist: (function(id: string): Promise<{artist: *}>),
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
    return "Deezer";
  },

  /**
   * Retrieve a track using its id.
   *
   * @param id {string}
   * @returns {Promise<{track: string, album: string, artist: string}>}
   * @throws Error
   */
  getTrack: function (id) {
    return axios.get(apiUrl + 'track/' + id)
      .then(response =>  {
          console.log(`Found track ${response.data.title} on album ${response.data.album.title} from artist ${response.data.artist.name}.`);

          return {
              track: response.data.title,
              album: response.data.album.title,
              artist: response.data.artist.name,
          }
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
    return axios.get(apiUrl + 'search/track/?q=track:"' + toSearch.track + '" artist:"' + toSearch.artist + '"')
      .then(result => {
        for (let i = 0; i < result.data.data.length; i++) {
          let track = result.data.data[i];
          if (track.artist.name.toLowerCase() === toSearch.artist.toLowerCase() && track.title.toLowerCase() === toSearch.track.toLowerCase()) {
            return track.link;
          }
        }

        throw new Error(`Track ${toSearch.track} on album ${toSearch.album} from ${toSearch.artist} not found.`);
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
    return axios.get(apiUrl + 'album/' + id)
      .then(response =>  {
        console.log(`Found album ${response.data.title} from artist ${response.data.artist.name}.`);
        return {
          album: response.data.title,
          artist: response.data.artist.name,
        }
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
    return axios.get(apiUrl + 'search/album/?q=album:"' + toSearch.album + '" artist:"' + toSearch.artist + '"')
      .then(result => {
        for (let i = 0; i < result.data.data.length; i++) {
          let album = result.data.data[i];
          if (album.artist.name.toLowerCase() === toSearch.artist.toLowerCase() && album.title.toLowerCase() === toSearch.album.toLowerCase())
            return album.link;
        }

        throw new Error(`Album ${toSearch.album} from ${toSearch.artist} not found.`);
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
    return axios.get(apiUrl + 'artist/' + id)
      .then(response =>  {
        console.log(`Found artist ${response.data.artist.name}.`);
        return {
          artist: response.data.name
        }
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
    return axios.get(apiUrl + 'search/artist/?q=artist:"' + toSearch.artist + '"')
      .then(result => {
        for (let i = 0; i < result.data.data.length; i++) {
          let artist = result.data.data[i];
          if (artist.name.toLowerCase() === toSearch.artist.toLowerCase())
            return artist.link;
        }

        throw new Error(`Artist ${toSearch.artist} not found.`);
      });
  },
};
