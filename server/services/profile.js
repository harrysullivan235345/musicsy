var User = require('../models/user');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

exports.get_profile = async function (id) {
	var user = await User.findById(id);
	// if (err) { return { type: 'err', data: err } }
	if (!user) {
		return null;
	}

	return user;
}

exports.change_email = async function (id, new_email) {
	var query = User.findOneAndUpdate({ _id: id }, { 'data.email': new_email }, { new: true });
	var updated_user = await query.exec();
	return { type: 'valid' }
}

exports.password_correct = async function (user_id, password) {
	var user = await User.findById(user_id);
	var current_password_matches = bcrypt.compareSync(password, user.data.passwordHash);

	return current_password_matches;
}

exports.change_password = async function (id, current_password, new_password) {
	var current_password_matches = this.password_correct(id, current_password);

	if (current_password_matches) {
		var new_password_hash = bcrypt.hashSync(new_password);

		var query = User.findOneAndUpdate({ _id: id }, { 'data.passwordHash': new_password_hash }, { new: true });
		var updated_user = await query.exec();
		return { type: 'valid' }
	} else {
		return { type: 'invalid', data: 'Current password is incorrect' }
	}

}

exports.change_avatar = async function (id, filename) {
	// var get_profile = User.findById(id);
	// var profile = await get_profile.exec();
	// console.log(profile);
	// profile.data.avatar = filename;

	// var updated_profile = await profile.save();
	// console.log(updated_profile, filename);
	var complete = User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { 'data.avatar': filename });
	var finished = await complete.exec();
	return filename;
}