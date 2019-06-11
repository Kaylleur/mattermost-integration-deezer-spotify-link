/**
 * mattermost-integration-deezer-spotify-link -
 * 21/09/17
 * thomas
 * */
const config = require('./config');

class MattermostResponse{

  constructor(text) {
    this.text = text;
    this.username = config.mattermost.bot.username;
    this['icon_url'] = config.mattermost.bot.icon_url;
  }

}

module.exports = MattermostResponse;
