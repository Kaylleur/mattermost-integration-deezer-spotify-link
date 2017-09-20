 # mattermost-integration-deezer-spotify-link
 
 Detect and convert Spotify or Deezer links into each others   
 
 #### Beta test
 
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
    deezer
    spotify
``` 
- - Callback URLs : `http://[your_host]:[port_setted]/convert`

- Copy the token to the config file
- After App start, app default is listenning on port 3000
- Send POST request on /convert with body
```json
    {
      "link" : "http://www.deezer.com/track/405503712" 
    }
```
```json
    {
      "link" : "https://open.spotify.com/track/3aLSrx8qhssXrh5yjB6oy9" 
    }
```

- Server will answer by json with
```json
    {
      "text" : "//link converted"
    }
```

Mattermost will type it into the channel.

Link to [Docker hub](https://hub.docker.com/r/kaylleur/mattermost-integration-deezer-spotify-link/)