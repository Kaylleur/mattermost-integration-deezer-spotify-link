/**
 * mattermost-integration-deezer-spotify-link -
 * 12/09/17
 * thomas
 * */
const deezerModel = require('../models/deezerModel');
const spotifyModel = require('../models/spotifyModel');
const url = require('url');
const config = require('../config');

module.exports = {
  convertLink: function (req, res, next) {
    if (!req.body.text) throw { code: 400, message: 'MISSING LINK' };

    let fieldsAuthorized = ['artist', 'track', 'album'];
    const link = url.parse(req.body.text);

    // let deezerRegex = /^http[s]?:\/\/www\.deezer\.com\/([a-z]+)\/([0-9]+)\/?/m;
    let deezerRegex = /deezer\.com/m;
    let username = 'Music-bot';

    // let spotifyRegex = /^http[s]?:\/\/open\.spotify\.com\/([a-z]+)\/([a-zA-Z0-9]+)\/?/m;
    let spotifyRegex = /spotify\.com/m;

    let deezerResult = deezerRegex.exec(req.body.text);
    let spotifyResult = spotifyRegex.exec(req.body.text);

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
      if (config.global.debug) console.log('url matching with deezer');
      switch (fieldSearched){
        case 'track':
          if (config.global.debug) console.log('url matched on track url');
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
                res.status(200).send({ text: track['external_urls'].spotify, username : username });
              else
                res.status(404).send({ message: 'not found' });
            })
            .error(err => {
              console.log(err);
              res.status(500).send(err);
            });

          break;
        case 'album':
          if (config.global.debug) console.log('url matched on album url');
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
                res.status(200).send({ text: album['external_urls'].spotify, username : username });
              else
                res.status(404).send({ message: 'not found' });
            })
            .error(err => {
              console.log(err);
              res.status(500).send(err);
            });
          break;
        case 'artist':
          if (config.global.debug) console.log('url matched on artist url');
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
                res.status(200).send({ text: artist['external_urls'].spotify, username : username });
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
      if (config.global.debug) console.log('url matching on spotify');
      switch (fieldSearched){
        case 'track':
          if (config.global.debug) console.log('url matched on track url');
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
                res.status(200).send({ text: track.link, username : username });
              else
                res.status(404).send({ message: 'not found' });
            }, err => {

              console.log(err);
              res.status(500).send(err);
            });

          break;
        case 'album':
          if (config.global.debug) console.log('url matched on album url');
          spotifyModel.initSpotify()
            .then(() =>  spotifyModel.getAlbum(idSearched))
            .then(result => {
              album = result.name;
              artist =  result.artists[0].name;
              return deezerModel.searchAlbum(album, artist);
            })
            .then(album => {
              if (album)
                res.status(200).send({ text: album.link, username : username });
              else
                res.status(404).send({ message: 'not found' });
            }, err => {

              console.log(err);
              res.status(500).send(err);
            });
          break;
        case 'artist':
          if (config.global.debug) console.log('url matched on artist url');
          spotifyModel.initSpotify()
            .then(() =>  spotifyModel.getArtist(idSearched))
            .then(result => {
              artist = result.name;
              return deezerModel.searchArtist(artist);
            })
            .then(artist => {
              if (artist)
                res.status(200).send({ text: artist.link, username : username });
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
