const passport = require('passport');
const LocalStrategy = require('../strategies/local');
const Auth_Controller = require('../controllers/auth');

passport.use(LocalStrategy);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Auth_Controller.user_by_id(id).then((user) => {
    done(null, user.id);
  })
});