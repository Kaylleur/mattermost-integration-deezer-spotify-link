 # mattermost-integration-deezer-spotify-link
 
 Detect and convert Spotify or Deezer links into each others   
  
 To start
 ```
 npm install
 
 cp config.example.js config.js
 
 //file it
 vim config.js
 
 npm start

```

### How to use

- Set outgoing webhooks on mattermost
- - Content Type : `application/json`
- - Channel : `//pick your channel`
- - Trigger Words : 
```
    https://open.spotify.com
    https://www.deezer.com
    http://open.spotify.com
    http://www.deezer.com
``` 
- - Trigger when : `First word starts with a trigger word`
- - Callback URLs : `http://[your_host]:[port_set]/convert`

- Copy the token to the config file
- After App start, app default is listenning on port 3000
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

Link to [Docker hub](https://hub.docker.com/r/kaylleur/mattermost-integration-deezer-spotify-link/)
