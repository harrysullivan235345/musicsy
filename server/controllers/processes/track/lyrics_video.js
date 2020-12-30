var axios = require('axios');
var keys = require('../../../config/keys');

var search = require('youtube-search');

exports.get = async function(track_name, artist, clean = false) {
	var opts = {
		maxResults: 16,
		key: keys.youtube.api_key,
		type: 'video'
	};

	var search_promise = new Promise((resolve, reject) => {
		var query = clean ? `${track_name} ${artist} clean lyrics` : `${track_name} ${artist} lyrics`;
		search(query, opts, function(err, results) {
			if (err) return reject(err);

			resolve(results);
		});
	});

	var results = await search_promise;
	return results;
}

exports.parse = function(results) {
	// var parsed = results.filter((result) => {
	// 	return /lyrics/i.test(result.title);
	// });
	return results;
}
