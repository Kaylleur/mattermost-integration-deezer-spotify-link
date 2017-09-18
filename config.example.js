/**
 * mattermost-integration-deezer-spotify-link - config.js
 * 12/09/17
 * thomas
 * */

module.exports = {
  mattermost: {
    token: (process.env.MATTERMOST_TOKEN || ''),
  },
  spotify: {
    redirectUri: (process.env.MATTERMOST_INTEGRATION_SPOTIFY_REDIRECTURI || 'http://localhost:3000/spotify/myToken'),
    clientId: (process.env.MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_ID || 'CLIENT_ID'),
    clientSecret: (process.env.MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_SECRET || 'CLIENT_SECRET'),
  },
  deezer: {
    accessToken: (process.env.MATTERMOST_INTEGRATION_DEEZER_ACCESS_TOKEN || 'ACCESS_TOKEN'),
  },
  global: {
    port: (process.env.MATTERMOST_INTEGRATION_DEEZER_SPOTIFY_PORT || '3000'),
  },
};
