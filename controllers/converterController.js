/**
 * mattermost-integration-deezer-spotify-link -
 * 12/09/17
 * thomas
 * */
const deezerClient = require('../clients/deezerClient');
const spotifyClient = require('../clients/spotifyClient');
const url = require('url');
const config = require('../config');
const MattermostResponse = require('../mattermostResponse');

module.exports = {
  convertLink: function (req, res) {
    if (!req.body.text) throw { code: 400, message: 'MISSING LINK' };

    let fieldsAuthorized = ['artist', 'track', 'album'];
    const sourceMessage = req.body.text;
    const link = url.parse(sourceMessage);

    console.log(`Request incoming for ${sourceMessage}`);

    const isSourceDeezer = sourceMessage.match(/deezer\.com/m);
    const isSourceSpotify = sourceMessage.match(/spotify\.com/m);

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

    if (!fieldSearched || fieldSearched === '') {
      res.status(400).send({ message: `Could'nt identify the URL`});
      return;
    }

    if (!idSearched || idSearched === '' ){
      res.status(400).send({ message: `No ID found in URL` });
      return;
    }

    console.info('INFO : Request receive for id ' + idSearched + ' on ' + fieldSearched);

    let sourceMusicClient;
    let targetMusicClient;
    if (isSourceDeezer) {
      console.log(`Source will be Deezer and target Spotify.`);
      sourceMusicClient = deezerClient;
      targetMusicClient = spotifyClient;
    } else if (isSourceSpotify) {
      console.log(`Source will be Spotify and target Deezer.`);
      sourceMusicClient = spotifyClient;
      targetMusicClient = deezerClient;
    } else {
      return res.status(404).send(`Music client not supported.`);
    }

    switch (fieldSearched) {
      case 'track':
        console.log(`URL matched on track.`);

        sourceMusicClient.getTrack(idSearched)
          .then(targetMusicClient.searchTrack)
          .then(link => {
            return res.status(200).send(new MattermostResponse(link));
          })
          .catch(err => {
            console.error(`Track not found or unhandled error on track conversion`, err);
            return res.status(200).send(new MattermostResponse(`Couldn't find the equivalent track on ${targetMusicClient.getName()}! :confused:`));
          });
        break;
      case 'album':
        console.log(`URL matched on album.`);

        sourceMusicClient.getAlbum(idSearched)
          .then(targetMusicClient.searchAlbum)
          .then(link => {
            return res.status(200).send(new MattermostResponse(link));
          })
          .catch(err => {
            console.error(`Album not found or unhandled error on track conversion`, err);
            return res.status(200).send(new MattermostResponse(`Couldn't find the equivalent album on ${targetMusicClient.getName()}! :confused:`));
          });
        break;
      case 'artist':
        console.log(`URL matched on artist.`);

        sourceMusicClient.getArtist(idSearched)
          .then(targetMusicClient.searchArtist)
          .then(link => {
            return res.status(200).send(new MattermostResponse(link));
          })
          .catch(err => {
            console.error(`Album not found or unhandled error on track conversion`, err);
            return res.status(200).send(new MattermostResponse(`Couldn't find the equivalent artist on ${targetMusicClient.getName()}! :confused:`));
          });

        break;
      default:
        console.log(`Couldn't match URL with track, album, nor artist.`);
        return res.status(400).send(`The URL isn't matching either Spotify nor Deezer resource.`);
    }
  },
};
