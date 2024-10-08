package com.example.spotifyyoutubetransfer.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.Playlist;
import com.google.api.services.youtube.model.PlaylistItem;
import com.google.api.services.youtube.model.PlaylistItemSnippet;
import com.google.api.services.youtube.model.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class YouTubeService {

    @Autowired
    private OAuth2AuthorizedClientService clientService;

    public String createPlaylist(List<Map<String, String>> tracks) {
        try {
            YouTube youtube = getYouTubeService();

            // Create a new playlist
            Playlist playlistInsertRequest = new Playlist();
            playlistInsertRequest.setSnippet(new PlaylistSnippet().setTitle("Transferred from Spotify"));
            Playlist playlistInsertResponse = youtube.playlists()
                    .insert("snippet", playlistInsertRequest)
                    .execute();
            String playlistId = playlistInsertResponse.getId();

            // Add tracks to the playlist
            for (Map<String, String> track : tracks) {
                String query = track.get("name") + " " + track.get("artist");
                SearchResult searchResult = youtube.search().list("id")
                        .setQ(query)
                        .setType("video")
                        .setMaxResults(1L)
                        .execute()
                        .getItems()
                        .get(0);

                PlaylistItem playlistItem = new PlaylistItem();
                playlistItem.setSnippet(new PlaylistItemSnippet()
                        .setPlaylistId(playlistId)
                        .setResourceId(new ResourceId().setKind("youtube#video").setVideoId(searchResult.getId().getVideoId())));
                youtube.playlistItems().insert("snippet", playlistItem).execute();
            }

            return "Playlist created successfully. ID: " + playlistId;
        } catch (Exception e) {
            throw new RuntimeException("Error creating YouTube playlist", e);
        }
    }

    private YouTube getYouTubeService() {
        OAuth2AuthenticationToken authentication = (OAuth2AuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName());

        GoogleCredential credential = new GoogleCredential().setAccessToken(client.getAccessToken().getTokenValue());
        return new YouTube.Builder(new NetHttpTransport(), new JacksonFactory(), credential)
                .setApplicationName("Spotify-YouTube-Transfer")
                .build();
    }
}