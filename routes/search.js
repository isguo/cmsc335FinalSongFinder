const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        error: null,
        songs: null,
        term: "",
        mode: "title",
    });
});

router.get("/search", async (req, res) => {
    const { term, mode } = req.query;

    if (!term || !mode) {
        return res.render("index", {
            error: "Please enter a search term and select a mode.",
            songs: null,
            term: term || "",
            mode: mode || "title",
        });
    }

    const token = process.env.GENIUS_API_TOKEN;
    if (!token) {
        return res.render("index", {
            error: "Server is missing GENIUS_API_TOKEN.",
            songs: null,
            term,
            mode,
        });
    }

    try {
        let query = term;

        const url = new URL("https://api.genius.com/search");
        url.searchParams.set("q", query);

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Genius API responded with status ${response.status}`);
        }

        const data = await response.json();

        const hits = data?.response?.hits || [];

        const songs = hits.map((hit) => {
            const song = hit.result;
            return {
                id: song.id,
                title: song.title,
                fullTitle: song.full_title,
                artist: song.primary_artist ? song.primary_artist.name : "Unknown Artist", 
                url: song.url,
                artworkUrl: 
                    song.song_art_image_thumbnail_url ||
                    song.song_art_image_url ||
                    null,
            };
        });

        if (mode === "artist") {
            const filteredSongs = songs.filter(song => 
                song.artist.toLowerCase().includes(term.toLowerCase())
            );
            
            return res.render("index", {
                error: filteredSongs.length === 0 ? "No songs found for this artist." : null,
                songs: filteredSongs,
                term,
                mode,
            });
        }

        res.render("index", {
            error: songs.length === 0 ? "No songs found." : null,
            songs,
            term,
            mode,
        });
    } catch (err) {
        console.error("Error contacting Genius: ", err);
        res.render("index", {
            error: "There was a problem contacting Genius API.",
            songs: null,
            term,
            mode,
        });
    }
});

module.exports = router;