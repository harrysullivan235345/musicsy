var axios = require('axios');
var get_video_id = require('get-video-id');
// var ytdl = require('ytdl-core');
var youtubedl = require('youtube-dl');
const AXIOS_REQUEST_OVERHEAD = 1.8e6

async function get_src(lyrics_url) {
	console.log(lyrics_url)
	var get_url_promise = new Promise((resolve, reject) => {
		youtubedl.getInfo(lyrics_url, [], function(err, info) {
		  if (err) reject(err);

		  resolve(info.url);
		});
	})
	var src = await get_url_promise;
	return src;
}

exports.get = async function (lyrics_url) {
	var src = await get_src(lyrics_url);
  	yt_id = get_video_id(lyrics_url);

  	return {src: src, yt_id: yt_id};
}