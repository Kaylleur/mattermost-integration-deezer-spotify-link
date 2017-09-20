# mattermost-integration-deezer-spotify-link
 
 Detect and convert Spotify or Deezer links into each others   
 
## Environment variable 

- MATTERMOST_TOKEN
Mandatory specify the token of the outgoing webhook from mattermost to communicate

- MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_ID, MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_SECRET
Mandatory specify the client id and secret api to communicate with [spotify](https://developer.spotify.com/web-api/tutorial/)
- MATTERMOST_INTEGRATION_DEEZER_ACCESS_TOKEN
Mandatory specify the access token to communicate with [deezer](https://developers.deezer.com/api/oauth)
You should get `offline_access` to get token with no expiration date
- MATTERMOST_INTEGRATION_PORT
Optional variable, this is the port on which the server will listen (default listenning port 3000).
- MATTERMOST_INTEGRATION_DEBUG
Optional variable, this is the variable to set debug to true if necessary (default false).

```
docker run --name mattermost-integration-spotify-deezer-converter \
    -p 3000:3000 \
    -e MATTERMOST_TOKEN=myToken \
    -e MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_ID=clientId \
    -e MATTERMOST_INTEGRATION_SPOTIFY_CLIENT_SECRET=clientSecret \
    -e MATTERMOST_INTEGRATION_DEEZER_ACCESS_TOKEN=accessToken \
    -e MATTERMOST_INTEGRATION_DEEZER_ACCESS_TOKEN=accessToken \
    -d kaylleur\mattermost-integration-deezer-spotify-link
```

More info on [Github](https://github.com/Kaylleur/mattermost-integration-deezer-spotify-link)
