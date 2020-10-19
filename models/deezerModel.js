/**
 * mattermost-integration-deezer-spotify-link -
 * 12/09/17
 * thomas
 * */

const axios = require("axios");
const apiUrl = "https://api.deezer.com/";

module.exports = {
  getTrack: function (id) {
    return axios.get(apiUrl + "track/" + id).then((response) => response.data);
  },

  searchTrack: function (trackSearched, album, artist) {
    return axios
      .get(
        apiUrl +
          'search/track/?q=track:"' +
          trackSearched +
          '" artist:"' +
          artist +
          '"'
      )
      .then((result) => {
        for (let i = 0; i < result.data.data.length; i++) {
          let track = result.data.data[i];
          if (
            track.artist.name.toLowerCase() === artist.toLowerCase() &&
            track.title.toLowerCase() === trackSearched.toLowerCase()
          )
            return track;
        }

        return null;
      });
  },

  getAlbum: function (id) {
    return axios.get(apiUrl + "album/" + id).then((response) => response.data);
  },

  searchAlbum: function (albumSearched, artist) {
    return axios
      .get(
        apiUrl +
          'search/album/?q=album:"' +
          albumSearched +
          '" artist:"' +
          artist +
          '"'
      )
      .then((result) => {
        for (let i = 0; i < result.data.data.length; i++) {
          let album = result.data.data[i];
          if (
            album.artist.name.toLowerCase() === artist.toLowerCase() &&
            album.title.toLowerCase() === albumSearched.toLowerCase()
          )
            return album;
        }

        return null;
      });
  },

  getArtist: function (id) {
    return axios.get(apiUrl + "artist/" + id).then((response) => response.data);
  },

  searchArtist: function (artistSearched) {
    return axios
      .get(apiUrl + 'search/artist/?q=artist:"' + artistSearched + '"')
      .then((result) => {
        for (let i = 0; i < result.data.data.length; i++) {
          let artist = result.data.data[i];
          if (artist.name.toLowerCase() === artistSearched.toLowerCase())
            return artist;
        }

        return null;
      });
  },
};
