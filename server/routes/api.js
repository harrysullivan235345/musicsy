var express = require('express');
var router = express.Router();

var auth_router = require('./api/auth')
var profile_router = require('./api/profile')
var search_router = require('./api/search')
var track_router = require('./api/track')
var playlist_router = require('./api/playlist')

router.use('/auth', auth_router)
router.use('/profile', profile_router)
router.use('/search', search_router)
router.use('/track', track_router)
router.use('/playlist', playlist_router)

module.exports = router;