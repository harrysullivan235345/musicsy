var bcrypt = require('bcryptjs');
var User = require('../models/user');

exports.validate_user = async function (username, password) {
  var user = await User.findOne({ type: 'local', 'data.username': username })

  if (!user) {
    return { type: 'invalid' };
  }
  if (!bcrypt.compareSync(password, user.data.passwordHash)) {
    return { type: 'invalid' };
  }
  return { type: 'valid', data: user };
}

exports.user_by_id = async function (id) {
  var user = await User.findById(id);
  return user;
}

exports.username_unique = async function (username) {
  var search = await User.findOne({ type: 'local', 'data.username': username });

  if (search === null) {
    return true;
  }

  return false;
}

exports.sign_up = async function (user) {
  var new_user = new User({
    type: 'local',
    data: {
      avatar: 'https://res.cloudinary.com/dvf4q79ri/image/upload/v1551309368/default.png',
      username: user.username,
      email: user.email,
      passwordHash: bcrypt.hashSync(user.password)
    }
  });

  var saved_user = await new_user.save();
  return saved_user;
}