# mattermost-integration-deezer-spotify-link

[Docker hub](https://hub.docker.com/r/kaylleur/mattermost-integration-deezer-spotify-link/)

Detect and convert Spotify or Deezer links into each others   

## Quickstart

```bash
npm install

cp config.example.js config.js

# Edit the configuration
vim config.js

npm start
```

## How to use

### Mattermost Outgoing Webhook creation

Create a new outgoing webhook:

- Content Type : `application/json`
- Channel : `//pick your channel`
- Trigger Words : 
```
https://open.spotify.com
https://www.deezer.com
http://open.spotify.com
http://www.deezer.com
``` 
- Triggers when : `First word starts with a trigger word`
- Callback URLs : `http://[your_host]:[port_set]/convert`

### Mattermost global configuration

- Ensure your Mattermost allow local insecure connections (`AllowedUntrustedInternalConnections` property)

### Server configuration

#### Standalone server

- Copy `config.example.js` to `config.js`
- Update the config file `config.js`
- Run with `npm start`

#### Or Docker environment

* MATTERMOST_TOKEN
* MATTERMOST_USERNAME
* MATTERMOST_ICON_URL
* MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_ID
* MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_SECRET
* MATTERMOST_INTEGRATION_PORT
* MATTERMOST_INTEGRATION_DEBUG

You should use this variable too:

- NODE_TLS_REJECT_UNAUTHORIZED=0

### Testing the integration

- Send POST request on /convert with body
```json
    {
      "token" : "TOKEN_IN_CONFIG",
      "text" : "http://www.deezer.com/track/405503712" 
    }
```
```json
    {
      "token" : "TOKEN_IN_CONFIG",
      "text" : "https://open.spotify.com/track/3aLSrx8qhssXrh5yjB6oy9" 
    }
```

- Server will answer by json with
```json
    {
      "text" : "//link converted",
      "username" : "Music-bot",
      "icon_url" : "https://maxcdn.icons8.com/Share/icon/Music//metal_music1600.png"
    }
```

Mattermost will type it into the channel.

![capture](https://i.ibb.co/JdGwMcJ/Capture.png)
