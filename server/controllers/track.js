var track_manager = require('./managers/track/track');
var track_service = require('../services/track');
var io = require('../socket');
var Url = require('url-parse');
// var four_lyrics = require('4lyrics');
var unique_string = require('unique-string');
var gis = require('g-i-s');
var axios = require('axios');
var cheerio = require('cheerio');
var fs = require('fs');
var keys = require('../config/keys');
var profanity = require('./profanity');
var request = require('request');
var youtubedl = require('youtube-dl');
var axiosFileupload = require('axios-fileupload');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

async function perform_gis(query) {
  var executor = new Promise((resolve, reject) => {
    gis(decodeURIComponent(query), function(error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].url);
      }
    });
  });

  return await executor;
}

exports.get_lyrics_video_results = async function(track_name, artist, clean = false) {
  track_name = track_name.trim();
  artist = artist.trim();

  var url = await track_manager.get_lyrics_video_results(track_name, artist, clean);
  return url;
}

exports.get_duration = function(src) {
  // console.log(src);
  var url = new Url(src, true);
  return Math.round(parseFloat(url.query.dur));
}

exports.url_to_src = async function(url) {
  return await track_manager.url_to_src(url);
}

exports.get_lyrics_video_src = async function(track_name, artist) {
  var found = false;
  var src = null;
  var clean_src = null;
  var offset = 0;

  var results = await this.get_lyrics_video_results(track_name, artist);
  var clean_results = await this.get_lyrics_video_results(track_name, artist, true);

  while (!found) {
    src = await this.url_to_src(results[offset].link);
    offset++;
    found = !isNaN(this.get_duration(src.src));
  }

  found = false;

  while (!found) {
    clean_src = await this.url_to_src(clean_results[offset].link);
    offset++;
    found = !isNaN(this.get_duration(clean_src.src));
  }

  return {
    src: src,
    clean: clean_src
  };
}

exports.add_track = async function(opts) {
  var parenth_brack_regex = /(\(.*\)|\[.*\])/;

  do {
    opts.track_name = opts.track_name.replace(parenth_brack_regex, "");
  } while (parenth_brack_regex.test(opts.track_name));

  opts.track_name = opts.track_name.trim();
  var src = await this.get_lyrics_video_src(opts.track_name, opts.artist);

  var thumbnail = opts.thumbnail;
  if (opts.thumbnail_to_be_changed) {
    thumbnail = await perform_gis(`${opts.track_name.trim()} ${opts.artist}`)
  }

  opts.artist = opts.artist.replace(/feat.*/, '').trim();

  var track = await track_service.add({
    thumbnail: thumbnail,
    track_name: opts.track_name.trim(),
    artist: opts.artist,
    tags: opts.tags,
    is_explicit: opts.is_explicit,
    duration: this.get_duration(src.src.src),
    yt_id: src.src.yt_id.id,
    clean_yt_id: src.clean.yt_id.id,
    src: src.src.src,
    clean: src.clean.src
  });

  this.download_to_cdn(track.yt_id, track._id).then(x => console.log(x));

  track.src = "";
  // track.clean_src = "";
  track.yt_id = "";

  return track;
}

exports.add_tracks_bulk = async function(tracks) {
  return await Promise.all(tracks.map(async _track => {
    var track = await this.add_track(_track);

    io.emit_status(_track.key);
    return track;
  }))
}

exports.download_to_cdn = async function(vid_id, track_id) {
  var video = youtubedl(`https://www.youtube.com/watch?v=${vid_id}`);
  var stream = fs.createWriteStream(`./server/storage/${vid_id}.mp4`);
  video.pipe(stream);

  stream.on('close', async err => {  
    ffmpeg(`./server/storage/${vid_id}.mp4`)
      .output(`./server/storage/${vid_id}.mp3`)
      .on('progress', function(progress) {
        console.log(`Processing ${vid_id}: ${progress.percent}% done`);
      })
      .on('error', function(err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message);
      })
      .on('end', () => {
        var form_data = {
          "file": fs.createReadStream(`./server/storage/${vid_id}.mp3`)
        }

        request.post({url: "http://musicsy-cdn.ml/app/upload-by-file.php", formData: form_data}, async (err, httpResponse, body) => {
          if (err) {console.error(err)}
          await track_service.replace_src(track_id, `http://musicsy-cdn.ml/storage/${body}`);
          console.log(`Done with ${vid_id}`, data)
        })
      })
      .run();

  });

}

exports.get_audio = async function(track_id, clean_str) {
  var clean = clean_str === "clean" ? true : false;
  return await track_service.get_audio(track_id, clean);
}

exports.get_all = async function() {
  return await track_service.get_all();
}

exports.update = async function(id) {
  var track = await track_service.get_by_ids([id]);
  var src = await this.url_to_src(track[0].yt_id);
  await track_service.replace_src(id, src.src);
}

// async function lyrics_process(server, track_name, artist) {
//   try {
//     var r = await four_lyrics[server].getURL(`${track_name} ${artist}`);
//     var lyrics = await four_lyrics[server].getLyrics(r);
//     return lyrics.replace(/(fuck|damn|bitch|shit)/gi, "<kbd>$1</kbd\>");
//   } catch (e) {
//     return false;
//   }
// }

async function get_lyrics_lyricsfreak(track_name, artist) {
  var urlencoded_track_name = encodeURIComponent(track_name.toLowerCase());
  var search_xhr = await axios.get(`https://www.lyricsfreak.com/search.php?q=${urlencoded_track_name}`);
  $_search = cheerio.load(search_xhr.data);
  var lyrics_resuts = $_search('a.song').map((i, el) => {
    return $_search(el).attr('href');
  }).get();

  var full_artist_regex_chunk = artist.replace(/\'/gi, '').replace(/ /gi, '\\\+');
  var split_aritst_regex_chunk = artist.split(/(\s|[^a-z]|[^A-Z])/gi).map(chunk => {
    return chunk.replace(/\'/gi, '').replace(/ /gi, '\\\+');
  }).filter(s => s.length > 0)

  var combined_artist_regex = split_aritst_regex_chunk.concat(full_artist_regex_chunk);
  var artist_regex = "(" + combined_artist_regex.join("|").slice(0, -1) + ")";

  var artist_regex = new RegExp(artist_regex, 'gi');
  var best_lyrics_results = lyrics_resuts.filter(result => {
    return artist_regex.test(result);
  })

  if (best_lyrics_results.length === 0) {
    return null;
  }

  var lyrics_page_xhr = await axios.get(`https://www.lyricsfreak.com${best_lyrics_results[0]}`);
  $_lyrics_page = cheerio.load(lyrics_page_xhr.data);
  var lyrics = $_lyrics_page('#content').text();
  return lyrics.trim();
}

exports.get_lyrics = async function(track_name, artist) {
  // var servers = ['musixmatch', 'lyricscom', 'lyricslive'];
  // for (var i = 0; i < servers.length; i++) {
  //   var res = await lyrics_process(servers[i], track_name, artist);
  //   if (res) {
  //     return res;
  //   }
  // }

  // return 'Sorry. Server Error';

  encoded_artist = encodeURIComponent(artist.toLowerCase());
  encoded_track_name = encodeURIComponent(track_name.toLowerCase());

  try {

    var xhr = await axios.get(`https://orion.apiseeds.com/api/music/lyric/${encoded_artist}/${encoded_track_name}?apikey=${keys.apiseeds.api_key}`);
    var data = xhr.data;

    if (data.result) {
      return data.result.track.text.replace(profanity, "<kbd>$1</kbd\>");
    }

    return data.error;
  } catch (e) {
    console.log('Lyricsfreaking', track_name, artist)
    var lyrics = await get_lyrics_lyricsfreak(track_name, artist);
    if (lyrics !== null) {
      return lyrics.replace(profanity, "<kbd>$1</kbd\>");
    } else {
      return 'Sorry Roshan. I can\'t find those lyrics.';
    }
  }

}
