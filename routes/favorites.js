const express = require("express");
const router = express.Router();
const Song = require("../models/Song");

router.get("/", async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.render("favorites", { songs });
    } catch (err) {
        console.error("Error fetching favorite songs: ", err);
        res.render("favorites", { songs: [] });
    }
});

router.post("/", async (req, res) => {
    const { apiId, title, artist, album, previewUrl, artworkUrl } = req.body;

    try {
        await Song.findOneAndUpdate(
            { apiId },
            { apiId, title, artist, album, previewUrl, artworkUrl },
            { upsert: true, new: true }
        );

        res.redirect("/favorites");
    } catch (err) {
        console.error("Error saving favorite song: ", err);
        res.redirect("/");
    }
});

router.post("/delete", async (req, res) => {
    try {
        await Song.findOneAndDelete({ apiId: req.body.apiId });
        res.redirect("/favorites");
    } catch (err) {
        console.error("Error deleting song:", err);
        res.redirect("/favorites");
    }
});

module.exports = router;