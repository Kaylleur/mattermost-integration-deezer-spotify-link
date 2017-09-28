/**
 * mattermost-integration-deezer-spotify-link - config.js
 * 12/09/17
 * thomas
 * */

module.exports = {
  mattermost: {
    token: (process.env.MATTERMOST_TOKEN || ''),
    bot : {
      username : (process.env.MATTERMOST_USERNAME || 'Music-bot'),
      icon_url : (process.env.MATTERMOST_ICON_URL || 'https://maxcdn.icons8.com/Share/icon/Music//metal_music1600.png'),
    }
  },
  spotify: {
    clientId: (process.env.MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_ID || 'CLIENT_ID'),
    clientSecret: (process.env.MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_SECRET || 'CLIENT_SECRET'),
  },
  global: {
    port: (process.env.MATTERMOST_INTEGRATION_PORT || '3000'),
    debug: (process.env.MATTERMOST_INTEGRATION_DEBUG || false),
  },

  checkConfig: function () {
    return (this.mattermost.token && this.spotify.clientId && this.spotify.clientSecret);
  },
};
