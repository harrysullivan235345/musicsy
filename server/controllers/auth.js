var Auth_Service = require('../services/auth');

exports.validate_user = async function(username, password) {
  if (username.length > 0 && password.length > 0) {
    var valid = await Auth_Service.validate_user(username, password);
    return valid;
  }
}

exports.user_by_id = async function(id) {
  var user = await Auth_Service.user_by_id(id);
  return user;
}

exports.username_unique = async function(username) {
	if (username.length < 1) {
		return false;
	}
	var is_unique = await Auth_Service.username_unique(username);
	return is_unique;
}

exports.sign_up = async function(user) {
	if (user.username.length > 0 && user.email.length > 0 && user.password.length > 0 && user.confirm_password.length > 0) {
		var username_unique = await this.username_unique(user.username);
		if (username_unique) {
			if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(user.email)) {
				if (user.password == user.confirm_password) {
					var user = await Auth_Service.sign_up(user);
					return { redirect: '/', user: user}
				} else {
					return { err: 'Passwords must match' }
				}
			} else {
				return { err: 'Email must be valid' }
			}
		} else {
			return { err: 'Username must be unique' }
		}
	} else {
		return { err: 'All fields are required' }
	}
}