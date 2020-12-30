// Manager

var lyrics_video_process = require('../../processes/track/lyrics_video');
var url_to_src_process = require('../../processes/track/url_to_src');

exports.get_lyrics_video_results = async function(track_name, artist, clean = false) {
	var results = await lyrics_video_process.get(track_name, artist, clean);
	var parsed_results = lyrics_video_process.parse(results);
	return parsed_results;
}

exports.url_to_src = async function(url) {
	var src = await url_to_src_process.get(url);
	return src;
}