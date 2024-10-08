package com.example.spotifyyoutubetransfer.controller;

import com.example.spotifyyoutubetransfer.service.SpotifyService;
import com.example.spotifyyoutubetransfer.service.YouTubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TransferController {

    @Autowired
    private SpotifyService spotifyService;

    @Autowired
    private YouTubeService youTubeService;

    @GetMapping("/playlists")
    public List<Map<String, String>> getSpotifyPlaylists() {
        return spotifyService.getUserPlaylists();
    }

    @PostMapping("/transfer")
    public String transferPlaylist(@RequestParam String playlistId) {
        List<Map<String, String>> tracks = spotifyService.getPlaylistTracks(playlistId);
        return youTubeService.createPlaylist(tracks);
    }
}