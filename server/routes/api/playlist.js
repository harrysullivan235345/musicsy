var express = require('express');
var router = express.Router();
var axios = require('axios');
var playlist_controller = require('../../controllers/playlist');
var playlist_service = require('../../services/playlist');
var track_service = require('../../services/track');
var track_controller = require('../../controllers/track');
var url = require('url')

router.post('/add', async function(req, res, next) {
  var playlist_id = await playlist_controller.add(req.body.user_id);
  res.json({ playlist_id: playlist_id })
});

router.post('/get_playlist', async function(req, res, next) {
  var playlist = await playlist_controller.get_playlist(req.body.playlist_id);
  res.json({ playlist: playlist })
})

router.post('/change_name', async function(req, res, next) {
  var playlist_id = req.body.playlist_id;
  var desired_name = req.body.desired_name;

  var done = await playlist_controller.change_name(playlist_id, desired_name, req.user);
  res.json({ done: true });
});

router.post('/change_track_order', async function(req, res, next) {
  var playlist_id = req.body.playlist_id;
  var new_track_order = req.body.new_track_order;

  var done = await playlist_controller.change_track_order(playlist_id, new_track_order);
  res.json({ done: true });
});

router.post('/add_track', async function(req, res, next) {
  var track = await track_controller.add_track(req.body);
  var add_to_playlist = await playlist_controller.add_track({
    track_id: track._id,
    playlist_id: req.body.playlist_id,
    duration: track.duration
  });
  res.json({ track: track });
})

router.post('/add_tracks_bulk', async function(req, res, next) {
  var tracks = await track_controller.add_tracks_bulk(req.body.tracks);
  var track_ids = tracks.map(t => t._id);
  var add_to_playlist = await playlist_controller.add_tracks_bulk(req.body.playlist_id, track_ids);
  res.json({ tracks: tracks });
})

router.post('/add_view', async function(req, res, next) {
  var done = await playlist_controller.add_view(req.body.playlist_id);
  res.json({ done: done })
});

router.get('/top_playlists', async function(req, res, next) {
  var top_playlists = await playlist_controller.top_playlists();
  res.json({ top_playlists: top_playlists });
})

router.post('/delete_track', async function(req, res, next) {
  var done = await playlist_controller.delete_track(req.body.playlist_id, req.body.track_id);
  res.json({ done: done });
})

router.post('/delete_playlist', async function(req, res, next) {
  var done = await playlist_controller.delete_playlist(req.body.playlist_id, req.user);
  res.json({ done: done });
})

router.post('/download', async function(req, res, next) {
  var playlist = await playlist_service.get_playlist(req.body.playlist_id);
  var tracks = await track_service.get_by_ids(playlist.tracks);
  var links = tracks.map(t => {
    var src = t.src;
    var URL = url.parse(src);
    return URL.pathname.replace(/(^\/|\/$)/g,''); 
  });
  res.json({ done: "will do" });
  var res = await axios.post("http://musicsy-cdn.ml/app/download.php", {
    "files": links
  })
  
})

router.get('/uptime', (req, res) => {
  var d = new Date();
  res.send(String(d.toUTCString()));
})

module.exports = router;
