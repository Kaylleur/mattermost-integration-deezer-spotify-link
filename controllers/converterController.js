/**
 * mattermost-integration-deezer-spotify-link -
 * 12/09/17
 * thomas
 * */
const deezerModel = require('../models/deezerModel');
const spotifyModel = require('../models/spotifyModel');

module.exports = {
  convertLink: function (req, res, next) {
    if (!req.body.link) throw { code: 400, message: 'MISSING LINK' };

    let deezerRegex = /^http[s]?:\/\/www\.deezer\.com\/([a-z]+)\/([0-9]+)\/?/m;
    let spotifyRegex = /^http[s]?:\/\/open\.spotify\.com\/([a-z]+)\/([a-zA-Z0-9]+)\/?/m;

    let deezerResult = deezerRegex.exec(req.body.link);
    let spotifyResult = spotifyRegex.exec(req.body.link);

    var fieldsAuthorized = ['artist', 'track', 'album'];

    var track;

    if (deezerResult) { //from deezer to spotify
      let fieldSearched = deezerResult[1];
      let idSearched = deezerResult[2];

      if (fieldsAuthorized.indexOf(fieldSearched) === -1)
        res.status(400).send('Can not identify the URL');

      deezerModel.getTrack(idSearched)
        .then(result => {
          track = {
            trackName: result.title,
            artistName: result.artist.name,
            albumName: result.album.title,
          };
          return spotifyModel.initSpotify();
        })
        .then(() => {
          return spotifyModel.searchTrack(track);
        })
        .then(track => {
          if (track)
            res.status(200).send({ link: track['external_urls'].spotify });
          else
            res.status(404).send({ message: 'not found' });
        })
        .error(err => {
          console.log(err);
          res.status(500).send(err);
        });

    } else if (spotifyResult) { //from spotify to deezer
      let fieldSearched = spotifyResult[1];
      let idSearched = spotifyResult[2];

      if (fieldsAuthorized.indexOf(fieldSearched) === -1)
        res.status(400).send('Can not identify the URL');

      switch(fieldSearched){
        case 'album':

          break;
        case 'track':
          break;
        case 'artist':
          break;
      }

      res.send({ message: 'spotify match' });
    }else {
      res.send({ message: "doesn't match" });
    }
  },
};