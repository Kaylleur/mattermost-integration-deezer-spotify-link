/**
 * mattermost-integration-deezer-spotify-link -
 * 12/09/17
 * thomas
 * */
const deezerModel = require('../models/deezerModel');
const spotifyModel = require('../models/spotifyModel');
const url = require('url');

module.exports = {
  convertLink: function (req, res, next) {
    if (!req.body.link) throw { code: 400, message: 'MISSING LINK' };

    let fieldsAuthorized = ['artist', 'track', 'album'];
    const link = url.parse(req.body.link);

    // let deezerRegex = /^http[s]?:\/\/www\.deezer\.com\/([a-z]+)\/([0-9]+)\/?/m;
    let deezerRegex = /deezer\.com/m;

    // let spotifyRegex = /^http[s]?:\/\/open\.spotify\.com\/([a-z]+)\/([a-zA-Z0-9]+)\/?/m;
    let spotifyRegex = /spotify\.com/m;

    let deezerResult = deezerRegex.exec(req.body.link);
    let spotifyResult = spotifyRegex.exec(req.body.link);

    let fieldSearched = '';
    let idSearched = '';

    let fields = link.pathname.split('/');
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];

      if (fieldsAuthorized.indexOf(field) !== -1) {
        fieldSearched = field;
        idSearched = fields[i + 1];
        break;
      }
    }

    if (fieldSearched === '')
      res.status(400).send({ message: 'Can not identify the URL' });

    if (!idSearched)
      res.status(400).send({ message: 'No id found' });

    let track;
    let album;
    let artist;

    if (deezerResult) { //from deezer to spotify

      switch (fieldSearched){
        case 'track':
          deezerModel.getTrack(idSearched)
            .then(result => {
              track = result.title;
              album = result.album.title;
              artist =  result.artist.name;
              return spotifyModel.initSpotify();
            })
            .then(() => {
              return spotifyModel.searchTrack(track, album, artist);
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

          break;
        case 'album':
          deezerModel.getAlbum(idSearched)
            .then(result => {
              album = result.title;
              artist =  result.artist.name;
              return spotifyModel.initSpotify();
            })
            .then(() => {
              return spotifyModel.searchAlbum(album, artist);
            })
            .then(album => {
              if (album)
                res.status(200).send({ link: album['external_urls'].spotify });
              else
                res.status(404).send({ message: 'not found' });
            })
            .error(err => {
              console.log(err);
              res.status(500).send(err);
            });
          break;
        case 'artist':
          deezerModel.getArtist(idSearched)
            .then(result => {
              artist = result.name;
              return spotifyModel.initSpotify();
            })
            .then(() => {
              return spotifyModel.searchArtist(artist);
            })
            .then(artist => {
              if (artist)
                res.status(200).send({ link: artist['external_urls'].spotify });
              else
                res.status(404).send({ message: 'not found' });
            })
            .error(err => {
              console.log(err);
              res.status(500).send(err);
            });
          break;
      }
    } else if (spotifyResult) { //from spotify to deezer
      console.log('spotify match');

      switch (fieldSearched){
        case 'track':
          spotifyModel.initSpotify()
            .then(() =>  spotifyModel.getTrack(idSearched))
            .then(result => {
              track = result.name;
              album = result.album.name;
              artist =  result.artists[0].name;
              return deezerModel.searchTrack(track, album, artist);
            })
            .then(track => {
              if (track)
                res.status(200).send({ link: track.link });
              else
                res.status(404).send({ message: 'not found' });
            }, err => {

              console.log(err);
              res.status(500).send(err);
            });

          break;
        case 'album':
          spotifyModel.initSpotify()
            .then(() =>  spotifyModel.getAlbum(idSearched))
            .then(result => {
              album = result.name;
              artist =  result.artists[0].name;
              return deezerModel.searchAlbum(album, artist);
            })
            .then(album => {
              if (album)
                res.status(200).send({ link: album.link });
              else
                res.status(404).send({ message: 'not found' });
            }, err => {

              console.log(err);
              res.status(500).send(err);
            });
          break;
        case 'artist':
          spotifyModel.initSpotify()
            .then(() =>  spotifyModel.getArtist(idSearched))
            .then(result => {
              artist = result.name;
              return deezerModel.searchArtist(artist);
            })
            .then(artist => {
              if (artist)
                res.status(200).send({ link: artist.link });
              else
                res.status(404).send({ message: 'not found' });
            }, err => {

              console.log(err);
              res.status(500).send(err);
            });
          break;
      }

    }else {
      res.send({ message: "doesn't match" });
    }
  },
};
