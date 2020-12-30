// Track.Search Manager

var _ = require('lodash');
var g_search_process = require('../../processes/track/g_search');
var y_search_process = require('../../processes/track/y_search');
var a_search_process = require('../../processes/track/a_search');
var refine_search_process = require('../../processes/track/refine_search');
var levenshtein = require('fast-levenshtein');

var keys = require('../../../config/keys');
var _ = require('lodash');

var normalize = (str) => str.toLowerCase().trim();

exports.g_search = async function(query) {
  var query = encodeURIComponent(query);
  var NAPSTER_API_KEY = keys.napster.api_key;
  var url_napster = `http://api.napster.com/v2.2/search?apikey=${NAPSTER_API_KEY}&query=${query}&type=track`

  var LAST_FM_API_KEY = keys.audioscrobbler.api_key;
  var url_last_fm = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=${LAST_FM_API_KEY}&format=json`;

  var execution = [];
  execution.push(g_search_process.g_search_napster(url_napster));
  execution.push(g_search_process.g_search_last_fm(url_last_fm));
  var results = await Promise.all(execution);

  results = _.flatten(results);

  var unique_results = _.uniqWith(results, (val1, val2) => {
    return val1.track_name === val2.track_name && val1.artist === val2.artist
  });

  var scoresheet = {};

  for (var i = 0; i < unique_results.length; i++) {
    scoresheet[unique_results[i].id] = 0;
  }

  var split_query = decodeURIComponent(query).split(' ');
  for (var i = 0; i < split_query.length; i++) {
    var query_chunk = normalize(split_query[i]);
    for (var j = 0; j < unique_results.length; j++) {
      var regexp = new RegExp(`\\b${query_chunk}\\b`, 'gi')

      var track_name = unique_results[j].track_name;
      var artist = unique_results[j].artist;

      // if (regexp.test() || regexp.test(unique_results[j].artist)) {
      //   scoresheet[unique_results[j].id]++;
      // }


      var track_distance = levenshtein.get(normalize(track_name), query_chunk);
      var artist_distance = levenshtein.get(normalize(artist), query_chunk);

      var lev_score = 0;

      if (track_distance < 4) {
        lev_score += (-12.5 * track_distance) + 37.5;
      }

      if (artist_distance < 4) {
        lev_score += (-12.5 * artist_distance) + 37.5;
      }

      scoresheet[unique_results[j].id] += lev_score;
    }
  }

  var keysorted = Object.keys(scoresheet).sort(function(a, b) { return scoresheet[b] - scoresheet[a] })

  var sorted = keysorted.map(key => {
    var i = unique_results.map(r => r.id).indexOf(key);
    return unique_results[i];
  })

  return sorted;
}

exports.y_search = async function(query) {
  var query = query.trim();
  var results = await y_search_process.search_youtube(query);
  var condensed = this.remove_duplicates_by(x => x.channelId, results);
  var parsed = y_search_process.parse(condensed);

  var refined = await refine_search_process.refine(parsed);
  return refined;
}

exports.a_search = async function(query) {
  var query = query.trim();
  var youtube_res = await this.y_search(query);

  var results = youtube_res.map(async (y_result) => {
    var result = await a_search_process.search(y_result.track_name, y_result.artist);
    if (result === null) { return null; }
    result.thumbnail = y_result.thumbnail;
    result.is_explicit = null;
    return result;
  });

  results = await Promise.all(results);
  results = results.filter(x => x !== null);

  return results;
}

exports.remove_duplicates_by = function(keyFn, array) {
  var mySet = new Set();
  return array.filter(function(x) {
    var key = keyFn(x),
      isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}
