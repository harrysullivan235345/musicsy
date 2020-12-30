const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  name: String,
  thumbnail: String,
  creator: String,
  tracks: Array,
  date_added: String,
  num_tracks: Number,
  duration: Number,
  num_views: Number
});

const Playlist = mongoose.model('playlist', playlistSchema);

module.exports = Playlist;