const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackSchema = new Schema({
	thumbnail: String,
	track_name: String,
	artist: String,
	date_added: String,
	tags: Array,
	duration: Number,
	is_explicit: Boolean,
	yt_id: String,
	clean_yt_id: String,
	src: String,
	clean_src: String,
});

const Track = mongoose.model('track', trackSchema);

module.exports = Track;