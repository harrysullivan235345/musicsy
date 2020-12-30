// Controller

var search_manager = require('./managers/track/search')

exports.g_search = async function (query) {
  var results = await search_manager.g_search(query);
  var condensed = search_manager.remove_duplicates_by(x => x.artist, results);
  return condensed.slice(0, 6);
}

exports.y_search = async function (query) {
  var results = await search_manager.y_search(query);
  return results.slice(0, 6);
}

exports.a_search = async function (query) {
  var results = await search_manager.a_search(query);
  return results.slice(0, 6);
}