var express = require('express');
var router = express.Router();
var passport = require('passport');
var Auth_Controller = require('../../controllers/auth');

router.post('/username_unique', function (req, res, next) {
  Auth_Controller.username_unique(req.body.username).then((is_unique) => {
    if (is_unique) {
      res.json({ res: true });
    } else {
      res.json({ res: false, err: 'Username must be unique' });
    }
  })
});

router.post('/sign_up', function (req, res, next) {
  var body = req.body;
  Auth_Controller.sign_up(body).then((valid) => {
    if (valid.err) {
      res.json({ logged_in: false, err: valid.err })
    } else if (valid.redirect) {
      req.login(valid.user, function (err) {
        if (err) { return next(err); }
        res.json({ logged_in: true })
      });
    }
  });
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/api/auth/login_failed' }),
  function (req, res, next) {
    res.json({ logged_in: true });
  }
);

router.get('/login_failed', function (req, res, next) {
  res.json({ logged_in: false });
})

router.get('/get_session', function (req, res, next) {
  res.json({ id: req.user });
});

router.get('/logout', function (req, res, next) {
  req.logout();
  res.json({ status: true });
});

module.exports = router;