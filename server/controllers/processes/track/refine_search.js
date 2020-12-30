var axios = require('axios');
var keys = require('../../../config/keys');
var _ = require('lodash');

var search_artist = async function(artist_name) {
  var encoded_artist_name = encodeURIComponent(artist_name);
  var xhr = await axios.get(`https://www.theaudiodb.com/api/v1/json/1/search.php?s=${encoded_artist_name}`);
  var data = xhr.data;
  return data.artists === null ? null : data.artists[0].idArtist;

  //https://www.theaudiodb.com/api/v1/json/1/search.php?s=lil+dicky
}

var get_albums = async function(artist_id) {
  if (artist_id === null) {
    return null;
  }
  var xhr = await axios.get(`https://theaudiodb.com/api/v1/json/${keys.theaudiodb.api_key}/album.php?i=${artist_id}`);
  var data = xhr.data;
  return data.album.map(album => album.idAlbum);
  //https://theaudiodb.com/api/v1/json/195003/album.php?i=121937
}

var get_tracks_in_album = async function(album_id) {
  if (album_id === null) {
    return null;
  }
  var xhr = await axios.get(`https://theaudiodb.com/api/v1/json/${keys.theaudiodb.api_key}/track.php?m=${album_id}`);
  var data = xhr.data;
  return data.track.map(track => {
    return {
      track_name: track.strTrack,
      artist: track.strArtist,
      mbid: track.strMusicBrainzID,
      thumbnail: track.strTrackThumb
    };
  });
  //https://theaudiodb.com/api/v1/json/195003/track.php?m=2300971
}

var get_tags_for_track = async function(track_id) {
  if (track_id === null) {
    return null;
  }
  //https://musicbrainz.org/ws/2/recording/b6292db6-80ae-45ca-a6fd-d16274f1924d?inc=tags
}

exports.refine = async function(data) {
  // Youtube Shit
  var artist_ids_promise = data.map(async result => {
    return await search_artist(result.artist);
  });

  var artist_ids = await Promise.all(artist_ids_promise);
  console.log('data', data)
  console.log('artist_ids', artist_ids)

  var artist_album_ids_promise = artist_ids.map(async artist_id => {
    return await get_albums(artist_id);
  })

  var artist_album_ids = await Promise.all(artist_album_ids_promise);
  var tracks_promise = artist_album_ids.map(async albums => {
    if (albums === null) {
      return null;
    }
    var tracks_promise = albums.map(async album_id => {
      return await get_tracks_in_album(album_id);
    });
    return await Promise.all(tracks_promise);
  })

  var tracks = await Promise.all(tracks_promise);

  var flattened = tracks.map(sub => _.flatten(sub));

  var refined = flattened.map((result_tracks, index) => {
    var with_nulls = result_tracks.map(track => {
      var result_track_name = data[index].track_name.replace(/(\(.*\)|\[.*\])/, '').trim();
      var this_track_name = track.track_name.replace(/(\(.*\)|\[.*\])/, '').trim();

      // var this_track_name_regex = new RegExp(this_track_name.replace(/([^a-zA-Z\d\s:])/gi, "\\$1"), 'gi');
      // var result_track_name_regex = new RegExp(result_track_name.replace(/([^a-zA-Z\d\s:])/gi, "\\$1"), 'gi');
      if (this_track_name.includes(result_track_name) || result_track_name.includes(this_track_name)) {
        // console.log(result_track_name, '*********', this_track_name)
        track.id = data[index].id;
        track.thumbnail = track.thumbnail !== null ? track.thumbnail : data[index].thumbnail;
        track.channelId = data[index].id;
        track.tags = [];
        return track;
      } else {
        return null;
        // CHECK WHERE ELSE THINGS ARE HAPPENING
      }
    });

    return with_nulls.filter(x => x !== null);
  });
  // console.log(refined);

  var handle_empty_refined = refined.filter(result => {
    return result.length > 0;
  });

  var flattened = _.flatten(handle_empty_refined);
  var yt_final = _.uniq(flattened, p => p.id);
  if (yt_final.length > 4) {
    return yt_final;
  }

  return yt_final
}

// var axios = require('axios')
// var cheerio = require('cheerio');
// var _ = require('lodash');
// var sleep = require('sleep-promise');
// var levenshtein = require('fast-levenshtein');

// var normalize = (str) => str.trim().toLowerCase();

// async function find_artist(artist) {
//   console.log(artist)
//   var normalized_artst = normalize(artist);
//   var xhr = await axios.get(`https://www.lyricsmania.com/lyrics/${normalized_artst.slice(0, 1).toUpperCase()}.html`);
//   var data = xhr.data;

//   var $ = cheerio.load(data);
//   var found_artists = $(".list-lyrics a[href]").map((i, el) => {
//     var link = $(el).attr('href');
//     return {
//       name: normalize($(el).text()).replace('lyrics', '').trim(),
//       link: link
//     }
//   }).get();

//   // Check if substring
//   var index_of_artists = found_artists.filter(found_artist => {
//     if (found_artist.name.indexOf(artist) !== -1 || artist.indexOf(found_artist.name) !== -1) {
//       return true;
//     }
//     return false;
//   })

//   // Lewenshtien distances
//   var distanced_artists = found_artists.filter(found_artist => {
//     return levenshtein.get(found_artist.name, artist) < 3;
//   })

//   var joined = _.union(index_of_artists, distanced_artists);

//   return {
//     is_artist: joined.length > 0,
//     link: joined.length > 0 ? joined[0].link : '',
//     name: joined.length > 0 ? joined[0].name : ''
//   };
// }

// async function search_artist_for_track(track_name, link) {
//   console.log(track_name)
//   track_name = normalize(track_name)
//   var xhr = await axios.get(`https://www.lyricsmania.com/${link}`);
//   var data = xhr.data;
//   var $ = cheerio.load(data);
//   var all_tracks = $(".album a[href]").map((i, el) => {
//     return { name: normalize($(el).text()).replace(/\(.*\)/gi, '').replace(/lyrics/gi, '').trim() }
//   }).get();

//   var index_of_tracks = all_tracks.filter(this_track => {
//     if (this_track.name.indexOf(track_name) !== -1 || track_name.indexOf(this_track.name) !== -1) {
//       return true;
//     }
//     return false;
//   })

//   var distanced_tracks = all_tracks.filter(this_track => {
//     return levenshtein.get(this_track.name, track_name) < 4;
//   });

//   var joined = _.union(index_of_tracks, distanced_tracks);

//   return { found: joined.length > 0, track_name: joined.length > 0 ? joined[0].name : '' };
// }

// async function main(track_name, artist) {
//   var found_artist = await find_artist(artist);
//   if (found_artist.is_artist) {
//     var searched = await search_artist_for_track(track_name, found_artist.link);
//     if (searched.found) {
//       return {
//         track_name: searched.track_name,
//         artist: found_artist.name,
//         valid: true
//       }
//     }

//     return {
//       valid: false
//     }
//   }

//   return {
//     valid: false
//   }
// }

// exports.refine = async function(data) {
//   data = data.slice(0, 4);
//   var found = []
//   for (var i = 0; i < data.length; i++) {
//     var res = data[i]
//     var info = await main(res.track_name, res.artist);
//     await sleep(500);
//     // console.log(info)
//     if (info.valid) {
//       found.push({
//         track_name: info.track_name,
//         artist: info.artist,
//         id: res.id
//       });
//     }
//   }
//   // var found_promise = data.map(async res => {
//   //   // try {

//   //   // } catch (e) {}
//   // })

//   // var found = await Promise.all(found_promise);

//   found = found.filter(x => x !== undefined)


//   var filtered_found = _.uniqWith(found, (val1, val2) => {
//     return val1.track_name === val2.track_name && val1.artist === val2.artist
//   });

//   var final = filtered_found.map(res => {
//     var i = data.map(d => d.id).indexOf(res.id);
//     var yt_res = data[i];
//     return {
//       track_name: res.track_name,
//       artist: res.artist,
//       thumbnail: yt_res.thumbnail,
//       id: yt_res.id,
//       tags: []
//     }
//   });

//   return final;
// }


// // { track_name: 'Without Me',
// //     artist: 'Halsey',
// //     mbid: '01552e9a-11b0-4b5d-bcd5-cd15850ebd29',
// //     thumbnail:
// //      'https://www.theaudiodb.com/images/media/track/thumb/sptxvw1541940225.jpg',
// //     id: 'b2a97d34981b503ac817a7da27ce2ba8',
// //     channelId: 'b2a97d34981b503ac817a7da27ce2ba8',
// //     tags: [] }
