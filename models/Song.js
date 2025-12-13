const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    apiId: String,
    title: String,
    artist: String,
    album: String,
    previewUrl: String,
    artworkUrl: String,
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("Song", songSchema);