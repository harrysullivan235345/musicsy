var axios = require('axios');
var unique_string = require('unique-string');

var baseUrl = process.env.NODE_ENV === 'production' ? "https://musicsy.herokuapp.com" : "http://localhost:3000";

exports.g_search_napster = async function(url) {
  var xhr = await axios.get(url).catch(err => {
    console.log('500 Error on url of: ', url);
  })
  var data = xhr.data;
  var results = data.search.data.tracks;

  var parsed = results.slice(0, 6).map((result) => {
    return {
      id: unique_string(),
      // duration: result.playbackSeconds,
      is_explicit: result.isExplicit,
      tags: result.links.tags.ids,
      track_name: result.name,
      artist: result.artistName,
      thumbnail: `http://direct.napster.com/imageserver/v2/albums/${result.albumId}/images/200x200.jpg`
    }
  });

  return parsed;
}

exports.g_search_last_fm = async function(url) {
  var xhr = await axios.get(url).catch(err => {
    console.log('500 Error on url of: ', url);
  })
  var data = xhr.data;
  var results = data.results.trackmatches.track;

  var parsed_promise = results.slice(0, 6).map(async (result) => {
    var track_name = result.name;
    var artist = result.artist;
    // var thumbnail = await perform_gis(`${track_name} ${artist}`);
    var thumbnail = `${baseUrl}/music.jpg`;

    return {
      id: unique_string(),
      // duration: result.playbackSeconds,
      is_explicit: false,
      tags: [],
      track_name: track_name,
      artist: artist,
      thumbnail: thumbnail,
      thumbnail_to_be_changed: true
    }
  });

  return await Promise.all(parsed_promise);
}


// Think about this

// ----- 1st ------
// ws.audioscrobbler.com/2.0/?method=track.search&track=me taylor&api_key=6aa189bf00f57f07e98f7d7c3d474be6&format=json
// http://ws.audioscrobbler.com/2.0/?method=track.search&track=me%20taylor&api_key=6aa189bf00f57f07e98f7d7c3d474be6&format=json

// ------ 2nd ------
// https://musicbrainz.org/ws/2/recording/70ecebf2-6dc0-4cc8-8f6c-52f7de1fdeb0?fmt=json&inc=artist-credits+isrcs
// https://musicbrainz.org/ws/2/recording/70ecebf2-6dc0-4cc8-8f6c-52f7de1fdeb0?fmt=json&inc=artist-credits+isrcs

// ----- 3rd (Branch 1) ------
// https://theaudiodb.com/api/v1/json/195003/artist-mb.php?i=20244d07-534f-4eff-b4d4-930878889970
// https://theaudiodb.com/api/v1/json/195003/artist-mb.php?i=20244d07-534f-4eff-b4d4-930878889970

// ----- 3rd (Branch 2) ------
// api.napster.com/v2.2/tracks/isrc/USCJY0803328?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4
// http://api.napster.com/v2.2/tracks/isrc/USCJY0803328?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4

// ----- 4th (Branch 2) ------
// https://api.napster.com/v2.2/albums/alb.24042741/images?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4
// https://api.napster.com/v2.2/albums/alb.24042741/images?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4


// ########## OR TRY THIS ########
// var gis = require('g-i-s');
// gis('me taylor swift', logResults);

// function logResults(error, results) {
//   if (error) {
//     console.log(error);
//   }
//   else {
//     console.log(results[0].url);
//   }
// }
