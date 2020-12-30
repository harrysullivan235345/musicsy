var MiniSearch = require('minisearch');
var track_controller = require('./controllers/track');

exports.minisearch = null;

exports.init = async function () {
  var tracks = await track_controller.get_all();
  console.log(tracks[0]);
}