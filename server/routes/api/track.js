var express = require('express');
var router = express.Router();
var unique_string = require('unique-string');

var track_controller = require('../../controllers/track')

router.get('/audio/:id/:clean', async (req, res) => {
  if (req.params.id !== "pageload") {
    var src = await track_controller.get_audio(req.params.id, req.params.clean);
    res.redirect(src);
  } else {
    res.redirect('http://techslides.com/demos/samples/sample.m4a');
  }
})

router.post('/add', async function(req, res, next) {

  var track = await track_controller.add_track({
    track_name: req.body.track_name,
    artist: req.body.artist,
    tags: req.body.tags,
    thumbnail: req.body.thumbnail,
    is_explicit: req.body.is_explicit
  })
  res.json({
    track: track
  });
});

router.get('/update/:id', async function(req, res) {
  await track_controller.update(req.params.id);
  res.json({
    state: "done"
  })
})

router.post('/lyrics', async function(req, res) {
  var lyrics = await track_controller.get_lyrics(req.body.track_name, req.body.artist);
  res.json({
    lyrics: lyrics
  })
})

module.exports = router;
