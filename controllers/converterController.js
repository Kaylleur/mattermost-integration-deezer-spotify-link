/**
 * mattermost-integration-deezer-spotify-link -
 * 12/09/17
 * thomas
 * */
const deezerModel = require('../models/deezerModel');
const spotifyModel = require('../models/spotifyModel');
const url = require('url');
const config = require('../config');
const MattermostResponse = require('../mattermostResponse');

module.exports = {
  convertLink: function (req, res) {
    if (!req.body.text) throw { code: 400, message: 'MISSING LINK' };

    let fieldsAuthorized = ['artist', 'track', 'album'];
    const link = url.parse(req.body.text);

    let deezerRegex = /deezer\.com/m;
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

    if (fieldSearched === ''){
      res.status(400).send({ message: 'Can not identify the URL' });
      return;
    }

    if (!idSearched){
      res.status(400).send({ message: 'No id found' });
      return;
    }

    let track;
    let album;
    let artist;

    console.info('INFO : Request receive for id ' + idSearched + ' on ' + fieldSearched);

    if (deezerResult) { //from deezer to spotify
      if (config.global.debug) console.debug('url matching with deezer');
      switch (fieldSearched){
        case 'track':
          if (config.global.debug) console.debug('url matched on track url');
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
                res.status(200).send(new MattermostResponse(track['external_urls'].spotify));
              else
                res.status(200).send(new MattermostResponse('Can not find the equivalent on Spotify! :confused:'));
            })
            .catch(err => {
              console.log(err);
              res.status(500).send(err);
            });

          break;
        case 'album':
          if (config.global.debug) console.debug('url matched on album url');
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
                res.status(200).send(new MattermostResponse(album['external_urls'].spotify));
              else
                res.status(200).send(new MattermostResponse('Can not find the equivalent on Spotify! :confused:'));
            })
            .catch(err => {
              console.log(err);
              res.status(500).send(err);
            });
          break;
        case 'artist':
          if (config.global.debug) console.debug('url matched on artist url');
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
                res.status(200).send(new MattermostResponse(artist['external_urls'].spotify));
              else
                res.status(200).send(new MattermostResponse('Can not find the equivalent on Spotify! :confused:'));
            })
            .catch(err => {
              console.log(err);
              res.status(500).send(err);
            });
          break;
      }
    } else if (spotifyResult) { //from spotify to deezer
      if (config.global.debug) console.debug('url matching on spotify');
      switch (fieldSearched){
        case 'track':
          if (config.global.debug) console.debug('url matched on track url');
          spotifyModel.initSpotify()
            .then(() =>  spotifyModel.getTrack(idSearched))
            .then(result => {
              if(!result) return;

              track = result.name;
              album = result.album.name;
              artist =  result.artists[0].name;
              return deezerModel.searchTrack(track, album, artist);
            })
            .then(track => {
              if (track)
                res.status(200).send(new MattermostResponse(track.link));
              else
                res.status(200).send(new MattermostResponse('Can not find the equivalent on Deezer! :confused:'));
            }, err => {

              console.log(err);
              res.status(500).send(err);
            });

          break;
        case 'album':
          if (config.global.debug) console.debug('url matched on album url');
          spotifyModel.initSpotify()
            .then(() =>  spotifyModel.getAlbum(idSearched))
            .then(result => {
              if(!result) return;

              album = result.name;
              artist =  result.artists[0].name;
              return deezerModel.searchAlbum(album, artist);
            })
            .then(album => {
              if (album)
                res.status(200).send(new MattermostResponse(album.link));
              else
                res.status(200).send(new MattermostResponse('Can not find the equivalent on Deezer! :confused:'));
            }, err => {

              console.log(err);
              res.status(500).send(err);
            });
          break;
        case 'artist':
          if (config.global.debug) console.debug('url matched on artist url');
          spotifyModel.initSpotify()
            .then(() =>  spotifyModel.getArtist(idSearched))
            .then(result => {
              if(!result) return;

              artist = result.name;
              return deezerModel.searchArtist(artist);
            })
            .then(artist => {
              if (artist)
                res.status(200).send(new MattermostResponse(artist.link));
              else
                res.status(200).send(new MattermostResponse('Can not find the equivalent on Deezer! :confused:'));
            }, err => {

              console.log(err);
              res.status(500).send(err);
            });
          break;
      }

    }else {
      res.status(400).send({ message: "URL doesn't match deezer or spotify rules." });
    }
  },
};
