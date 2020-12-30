var keys = require('../../../config/keys');
var axios = require('axios');
var unique_string = require('unique-string');

exports.search = async function(track_name, artist) {
	track_name = encodeURIComponent(track_name);
	artist = encodeURIComponent(artist);

	var url = `http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=${keys.audioscrobbler.api_key}&track=${track_name}&artist=${artist}&format=json`;
	var xhr = await axios.get(url);
	
	if (xhr.data.error === 6) { return null; } 
	var result = {};
	result.id = unique_string();
	result.track_name = xhr.data.track.name;
	result.artist = xhr.data.track.artist.name;
	return result;
}