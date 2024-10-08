package com.example.spotifyyoutubetransfer.service;

import com.wrapper.spotify.SpotifyApi;
import com.wrapper.spotify.model_objects.specification.Paging;
import com.wrapper.spotify.model_objects.specification.PlaylistSimplified;
import com.wrapper.spotify.model_objects.specification.PlaylistTrack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SpotifyService {

    @Autowired
    private OAuth2AuthorizedClientService clientService;

    public List<Map<String, String>> getUserPlaylists() {
        SpotifyApi spotifyApi = getSpotifyApi();
        try {
            Paging<PlaylistSimplified> playlists = spotifyApi.getListOfCurrentUsersPlaylists().build().execute();
            return Arrays.stream(playlists.getItems())
                    .map(playlist -> Map.of(
                            "id", playlist.getId(),
                            "name", playlist.getName()
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching Spotify playlists", e);
        }
    }

    public List<Map<String, String>> getPlaylistTracks(String playlistId) {
        SpotifyApi spotifyApi = getSpotifyApi();
        try {
            Paging<PlaylistTrack> tracks = spotifyApi.getPlaylistsItems(playlistId).build().execute();
            return Arrays.stream(tracks.getItems())
                    .map(track -> Map.of(
                            "name", track.getTrack().getName(),
                            "artist", track.getTrack().getArtists()[0].getName()
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching playlist tracks", e);
        }
    }

    private SpotifyApi getSpotifyApi() {
        OAuth2AuthenticationToken authentication = (OAuth2AuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName());
        
        return new SpotifyApi.Builder()
                .setAccessToken(client.getAccessToken().getTokenValue())
                .build();
    }
}