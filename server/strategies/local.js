var LocalStrategy = require('passport-local').Strategy;
var Auth_Controller = require('../controllers/auth');

module.exports = new LocalStrategy(
  function (username, password, done) {
    Auth_Controller.validate_user(username, password).then((valid) => {
      switch (valid.type) {
        case 'err':
          done(valid.data);
          break;
        case 'invalid':
          done(null, false);
          break;
        case 'valid':
          done(null, valid.data);
          break;
      }
    })
  }
);