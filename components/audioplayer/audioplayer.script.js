import axios from "axios";
import moment from "moment";
import { EventBus } from '../event_bus.js';

export default {
  computed: {
    active_track_src() {
      var clean_state = this.$store.state.playlist.clean;
      var clean_str = clean_state === 1 ? 'allow' : 'clean';

      var track_id = this.$store.state.playlist.active_track ?
        this.$store.state.playlist.active_track :
        "pageload";

      return `${process.env.baseUrl}/api/track/audio/${track_id}/${clean_str}`;
    },
    active_track_pos() {
      return this.$store.state.playlist.tracks
        .map(t => t._id)
        .indexOf(this.$store.state.playlist.active_track);
    },
    tracks_length() {
      return this.$store.state.playlist.tracks.length;
    }
  },
  created() {
    this.should_autoplay = this.$route.query.autoplay === "true"
    this.embedded = this.$route.query.embedded === "true"
    this.is_looping = this.$route.query.looping === "true"
  },
  methods: {
    init_audio(force = false) {
      if (!this.is_playing || force === true) {
        this.$refs.audio_source.src = this.active_track_src;
        this.canplay = false;
        this.is_playing = false;
        this.current_time_pct = "0%";
        this.current_time_str = "00:00";
        // this.$refs.audio.autoplay = this.should_autoplay;
        this.$refs.audio.load();
        this.$refs.audio.oncanplay = this.oncanplay;
        this.$refs.audio.ontimeupdate = this.ontimeupdate;
        this.$refs.audio.onended = this.onended;

        var self = this;

        // var watcher = setInterval(() => {
        //   var newtork_state = self.$refs.audio.networkState;
        //   console.log('Looking for network state in audioplayer.script.js line 43');
        //   if (newtork_state === 1) {
        //     clearInterval(watcher);
        //   } else if (newtork_state === 3) {
        //     self.onerror();
        //     clearInterval(watcher);
        //   }
        // }, 200);
      }
    },
    oncanplay() {
      this.canplay = true;
      this.end_time_str = moment()
        .minutes(0)
        .seconds(Math.round(this.$refs.audio.duration))
        .format("mm:ss");

      if (this.auto_next) {
        this.$refs.audio.play();
        this.is_playing = true;
        this.auto_next = false;
      }

      if (this.should_autoplay) {
        var worked = this.$refs.audio.play();
        if (worked !== undefined) {
          worked.then(_ => {
            // Autoplay started!
            this.is_playing = true;
            this.should_autoplay = false;
          }).catch(error => {
            this.error = "Must enable autoplay";
          });
        }
      }
    },
    skip(direction, index = null) {
      this.$refs.audio.pause();
      this.is_playing = false;
      var new_i = 0;
      var tracks = this.$store.state.playlist.tracks;
      if (this.$store.state.playlist.clean !== 3) {
        if (index === null) {
          new_i = this.active_track_pos + direction;
        } else {
          new_i = index;
        }
      } else {
        var found = false;
        var tmp_i = this.active_track_pos;
        while (!found) {
          tmp_i = tmp_i + direction;
          if (!this.$store.state.playlist.tracks[tmp_i].is_explicit) {
            found = true;
          }
        }
        new_i = tmp_i;
      }
      var new_id = this.$store.state.playlist.tracks[new_i]._id;
      this.current_time_pct = "0%";
      this.current_time_str = "00:00";
      this.end_time_str = "00:00";
      this.$store.commit("playlist/set_active_track", new_id);
    },
    play_pause() {
      if (!this.$refs.audio.paused) {
        this.$refs.audio.pause();
        this.is_playing = false;
      } else {
        this.$refs.audio.play();
        this.is_playing = true;
      }

      this.error = ''
    },
    ontimeupdate() {
      var current_time = this.$refs.audio.currentTime;
      this.current_time_pct =
        String(((current_time / this.$refs.audio.duration) * 100).toFixed(2)) +
        "%";
      this.current_time_str = moment()
        .minutes(0)
        .seconds(Math.round(current_time))
        .format("mm:ss");
    },
    onended() {
      this.should_autoplay = false
      if (
        this.active_track_pos + 1 ===
        this.$store.state.playlist.tracks.length
      ) {
        if (this.is_looping) {
          this.auto_next = true;
        }
        this.skip(null, 0);
      } else {
        this.auto_next = true;
        this.skip(1);
      }
    },
    update_volume(amnt = null) {
      if (amnt === null) {
        this.$refs.audio.volume = this.$refs.volume.value / 100;
      } else {
        var new_volume = parseFloat(this.$refs.volume.value / 100) + amnt;
        if (new_volume > -0.01 && new_volume < 1.01) {
          this.$refs.audio.volume = new_volume;
          this.$refs.volume.value =
            parseInt(this.$refs.volume.value) + amnt * 100;
        }
      }
    },
    handle_volume_scroll(e) {
      e.preventDefault();
      var delta;
      if (event.wheelDelta) {
        delta = event.wheelDelta;
      } else {
        delta = -1 * event.deltaY;
      }
      if (delta < 0) {
        this.update_volume(-0.05);
      } else if (delta > 0) {
        this.update_volume(0.05);
      }
    },
    shuffle() {
      this.$store.commit("playlist/shuffle", true);
    },
    handle_loop_click() {
      this.is_looping = !this.is_looping;
    },
    reload() {
      this.init_audio(true);
    },
    get_id_from_src(src) {
      return src.split('/')[6];
    },
    async onerror() {
      // this.loading = true;
      // try {
      // await axios.get(`${process.env.baseUrl}/api/track/update/${this.$store.state.playlist.active_track}`)
      // } catch(e) {
      //   this.loading = false;
      // }
      // this.init_audio(true);
      // this.loading = false;
    }
  },
  mounted() {
    if (!this.is_playing) {
      this.init_audio();
    }

    var self = this;
    EventBus.$on('UPDATE_TRACK', async track_id => {
      // await self.onerror();
    });

    this.mounted = true;

  },
  watch: {
    active_track_src(new_src, old_src) {
      // Fix changing clean level while track is playing
      var new_src_id = this.get_id_from_src(new_src);
      var old_src_id = this.get_id_from_src(old_src);
      if (
        (this.prevoius_clean !== this.$store.state.playlist.clean && parseFloat(this.$refs.audio.currentTime) === 0) || new_src_id !== old_src_id) {
        this.prevoius_clean = this.$store.state.playlist.clean;
        this.init_audio(true);
      }
    },
    is_playing(new_state, old_state) {
      this.$store.commit("playlist/set_playing", new_state);
    },
    $route(to, from) {
      this.is_showing = /viewer\/playlist/.test(to.fullPath);
    }
  },
  data: function() {
    return {
      is_showing: /viewer\/playlist/.test(this.$route.fullPath),
      auto_next: false,
      canplay: false,
      is_playing: false,
      current_time_pct: "0%",
      current_time_str: "00:00",
      end_time_str: "00:00",
      is_looping: false,
      prevoius_clean: 1,
      loading: false,
      should_autoplay: false,
      embedded: false,
      mounted: false,
      error: ''
    };
  }
};
