var axios = require('axios');
var keys = require('../../../config/keys');
var unique_string = require('unique-string');

var search = require('youtube-search');

exports.search_youtube = async function (query) {
	var opts = {
		maxResults: 16,
		key: keys.youtube.api_key,
		type: 'video'
	};

	var search_promise = new Promise((resolve, reject) => {
		search(`${query} official`, opts, function (err, results) {
			if (err) return reject(err);

			resolve(results);
		});
	});

	var results = await search_promise;
	return results;
}

exports.parse = function (results) {
	var parsed = results.map((result) => {
		var item = {};
		// Fix Artist
		var artist = result.channelTitle.replace(/(vevo|official|real|music|\`|videos|video|band)/gi, "");
		artist = artist.replace(/^.*(tv)$/, "");

		var camel_case_regex = /^(.*)([a-z])([A-Z])(.*)$/;

		do {
			artist = artist.replace(camel_case_regex, "$1$2 $3$4");
		} while (camel_case_regex.test(artist));

		artist = artist.replace(/(the)/gi, "");

		item.artist = artist.trim();

		// Condense
		item.id = unique_string();
		item.track_name = result.title;
		item.thumbnail = result.thumbnails.medium.url;
		item.channelId = result.channelId;

		return item;
	});

	return parsed;
}