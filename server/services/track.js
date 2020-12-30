var Track = require('../models/track');
var mongoose = require('mongoose');

exports.get_audio = async function(id, wants_clean) {
	var track = await Track.findById(id);
	if (wants_clean) {
		return track.clean_src;
	} else {
		return track.src;
	}
}

exports.add = async function(info) {
	var new_track = new Track({
		thumbnail: info.thumbnail,
		track_name: info.track_name,
		artist: info.artist,
		tags: info.tags,
		date_added: Date.now(),
		duration: info.duration,
		is_explicit: info.is_explicit,
		clean_yt_id: info.clean_yt_id,
		yt_id: info.yt_id,
		src: info.src,
		clean_src: info.clean
	});

	var saved_track = await new_track.save();
	return saved_track;
}

exports.get_all = async function() {
	var promise = new Promise(function(resolve, reject) {
		Track.find({}, function(err, docs) {
			resolve(docs);
		})
	});

	var docs = await promise;
	return docs;
}

exports.get_by_ids = async function(ids) {
	ids = ids.map(id => {
		return mongoose.Types.ObjectId(id);
	})
	var query = Track.find({
		_id: {
			$in: ids
		}
	});
	return await query.exec();
}

exports.replace_src = async function(track_id, new_src) {
	var track = await Track.findById(track_id);
	track.src = new_src;
	return await track.save();
}