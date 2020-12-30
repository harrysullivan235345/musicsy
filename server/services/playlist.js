var Playlist = require('../models/playlist');
var track_service = require('./track');

exports.get_playlist = async function (playlist_id) {
	var query = Playlist.findById(playlist_id);
	return await query.exec();
}

exports.change_name = async function (playlist_id, desired_name, user_id) {
	var get_playlist = Playlist.findById(playlist_id);
	var playlist = await get_playlist.exec();
	playlist.name = desired_name

  if(user_id === playlist.creator) {
     await playlist.save();
  }

	return true;
}

exports.change_track_order = async function (playlist_id, track_ids) {
	var get_playlist = Playlist.findById(playlist_id);
	var playlist = await get_playlist.exec();
	playlist.tracks = track_ids
	await playlist.save();

	return true;
}

exports.add = async function (info) {
	var new_playlist = new Playlist({
		name: info.name,
		thumbnail: info.thumbnail,
		creator: info.creator,
		tracks: [],
		date_added: Date.now(),
		num_tracks: 0,
		duration: 0,
		num_views: 0
	});

	var saved_playlist = await new_playlist.save();
	return saved_playlist;
}

exports.add_track = async function (info) {
	var get_playlist = Playlist.findById(info.playlist_id);
	var playlist = await get_playlist.exec();

	playlist.tracks.push(info.track_id);
	playlist.duration = info.duration;

	playlist.num_tracks = playlist.tracks.length;

	var updated_playlist = await playlist.save();
	return updated_playlist;
}

exports.add_tracks_bulk = async function (playlist_id, tracks) {
	var get_playlist = Playlist.findById(playlist_id);
	var playlist = await get_playlist.exec();

	playlist.tracks = playlist.tracks.concat(tracks);

	var additional_tracks = await track_service.get_by_ids(tracks)
	var additional_duration = additional_tracks.map(t => t.duration).reduce((acc, curr_val) => acc + curr_val);
	playlist.duration += additional_duration;

	playlist.num_tracks += tracks.length;

	var updated_playlist = await playlist.save();
	return updated_playlist;
}

exports.delete_track = async function (playlist_id, track_id) {
	var get_playlist = Playlist.findById(playlist_id);
	var playlist = await get_playlist.exec();

	var track_ids = playlist.tracks.map(t => t._id.toString());
	var i = track_ids.indexOf(track_id);

	playlist.tracks.splice(i, 1);
	playlist.num_tracks--;

	var get_track_duration = await track_service.get_by_ids([track_id]);
	var track_duration = get_track_duration[0].duration;
	playlist.duration -= track_duration;

	var updated_playlist = await playlist.save();
	return updated_playlist;
}

exports.add_view = async function (playlist_id) {
	var get_playlist = Playlist.findById(playlist_id);
	var playlist = await get_playlist.exec();

	playlist.num_views++;
	var updated_playlist = await playlist.save();
	return updated_playlist;
}

exports.delete_playlist = async function (playlist_id) {
	var done = await Playlist.findById(playlist_id).deleteOne().exec();
	return done;
}

exports.top_playlists = async function () {
	var get_top_playlists = Playlist.find({}, 'name thumbnail creator date_added num_views').sort({ num_views: -1 });
	return await get_top_playlists.exec();
}
