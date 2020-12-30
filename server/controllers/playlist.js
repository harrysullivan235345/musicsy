var playlist_service = require('../services/playlist');
var track_service = require('../services/track');
var unique_string = require('unique-string');
var rpos = require('random-part-of-speech');
var profile_controller = require('./profile');
var keys = require('../config/keys');
var axios = require('axios');
var mongoose = require('mongoose');
var _ = require('lodash');

exports.add = async function (user_id) {
	var random_name = await rpos.getAny();

	var thumbnail_xhr = await axios.get(`https://api.unsplash.com/photos/random?client_id=${keys.unsplash.api_key}&orientation=landscape`);

	var thumbnail = thumbnail_xhr.data.urls.small;

	var info = {
		name: random_name,
		thumbnail: thumbnail,
		creator: user_id
	}
	var playlist = await playlist_service.add(info);
	return playlist._id;
}

exports.add_track = async function (opts) {
	var playlist = await playlist_service.get_playlist(opts.playlist_id);
	var tracks_in_playlist = await track_service.get_by_ids(playlist.tracks);
	var durations = tracks_in_playlist.map((t) => t.duration);
	var sum_durations = durations.length > 0 ? durations.reduce((total, num) => {
		return total + num;
	}) : 0;
	var add_track = await playlist_service.add_track({
		duration: sum_durations + opts.duration,
		track_id: opts.track_id,
		playlist_id: opts.playlist_id
	})
	return true;
}

exports.add_tracks_bulk = async function (playlist_id, tracks) {
	return await playlist_service.add_tracks_bulk(playlist_id, tracks);
}

exports.change_name = async function (playlist_id, desired_name, user_id) {
	var done = await playlist_service.change_name(playlist_id, desired_name, user_id);
	return done;
}

exports.change_track_order = async function(playlist_id, track_ids) {
	var track_oids = track_ids.map(t => mongoose.Types.ObjectId(t));
	var done = await playlist_service.change_track_order(playlist_id, track_oids);
	return done;
}

exports.get_playlist = async function (playlist_id) {
	var playlist = await playlist_service.get_playlist(playlist_id);
	if (playlist !== null) {
		var creator = await profile_controller.get_profile(playlist.creator);
		playlist.creator = creator.username;
		var correctly_ordered_tracks = playlist.tracks;
		var tracks_in_playlist = await track_service.get_by_ids(playlist.tracks);
		tracks_in_playlist = tracks_in_playlist.map(t => {
			t._id = t._id.toString();
			return t;
		})
		playlist.tracks = correctly_ordered_tracks.map(correct_track_id => {
			return _.find(tracks_in_playlist, { _id: correct_track_id })
		})
	}
	return playlist;
}

exports.add_view = async function (playlist_id) {
	var done = await playlist_service.add_view(playlist_id);
	return true;
}

exports.top_playlists = async function () {
	var top_playlists = await playlist_service.top_playlists();
	return top_playlists.slice(0, 15);
}

exports.delete_track = async function (playlist_id, track_id) {
	var done = await playlist_service.delete_track(playlist_id, track_id);
	return true;
}

exports.delete_playlist = async function (playlist_id, user_id) {
	var playlist = await playlist_service.get_playlist(playlist_id);
	if (playlist.creator === user_id) {
		var done = await playlist_service.delete_playlist(playlist_id);
	}
	return true;
}
