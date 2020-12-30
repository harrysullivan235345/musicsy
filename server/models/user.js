const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  type: String,
  data: Object
});

const User = mongoose.model('user', userSchema);

module.exports = User;



