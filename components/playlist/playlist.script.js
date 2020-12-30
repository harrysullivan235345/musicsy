import axios from "axios";
import moment from "moment";
import { VueContext } from "vue-context";
import vmodal from "vue-js-modal/dist/ssr.index";
import { EventBus } from '../event_bus.js';

export default {
  components: {
    VueContext,
    vmodal
  },
  computed: {
    tracks() {
      return this.$store.state.playlist.tracks;
    },
    active_track() {
      return this.$store.state.playlist.active_track;
    },
    playing() {
      return this.$store.state.playlist.playing;
    },
    shuffle() {
      return this.$store.state.playlist.shuffle;
    },
    requested_clean() {
      return this.$store.state.playlist.clean;
    }
  },
  created() {
    this.embedded = this.$route.query.embedded === "true"
  },
  methods: {
    from_now(d) {
      return moment(parseInt(d)).fromNow();
    },
    to_mm_ss(t) {
      return moment()
        .minutes(0)
        .seconds(parseInt(t))
        .format("mm:ss");
    },
    find_up_class(el, class_name) {
      if (el.classList.contains(class_name)) {
        return el;
      }
      while (el.parentNode) {
        el = el.parentNode;
        if (el.classList.contains(class_name) === class_name) {
          return el;
        }
      }
      return null;
    },
    delete_track(el, track_id) {
      this.$store.dispatch("playlist/delete_track", track_id);
      axios.post(`${process.env.baseUrl}/api/playlist/delete_track`, {
        playlist_id: this.$route.params.id,
        track_id: track_id
      });
      this.on_contextmenu_close();
    },
    async show_lyrics(el, track_id) {
      var i = this.tracks.map(t => t._id).indexOf(track_id);
      var { track_name, artist } = this.tracks[i];
      this.lyrics_loading = true;
      this.$modal.show('lyrics-viewer');
      var xhr = await axios.post(`${process.env.baseUrl}/api/track/lyrics`, {
        track_name: track_name,
        artist: artist
      });
      this.lyrics = xhr.data.lyrics;
      this.lyrics_loading = false;
    },
    select_all_rows() {
      if (this.selected_rows.length !== this.tracks.length) {
        this.selected_rows = this.tracks.map(t => t._id);
      } else {
        this.selected_rows = [];
      }
    },
    set_active(el, track_id) {
      this.$store.commit("playlist/set_active_track", track_id);
      this.on_contextmenu_close();
    },
    update_track(el, track_id) {
      EventBus.$emit('UPDATE_TRACK', track_id);
      this.on_contextmenu_close();
    },
    show_explicit_modal(track_id) {
      self = this;
      this.$modal.show("dialog", {
        title: "Choose Explicit Rating",
        text: "Is this song explicit?",
        buttons: [{
            title: "Yes 💩",
            handler: () => {
              self.$store.commit("playlist/set_explicit", {
                track_id: track_id,
                state: true
              });
              this.$modal.hide("dialog");
            }
          },
          {
            title: "No ✨",
            handler: () => {
              self.$store.commit("playlist/set_explicit", {
                track_id: track_id,
                state: false
              });
              this.$modal.hide("dialog");
            }
          },
          {
            title: "Close"
          }
        ]
      });
    },
    on_contextmenu_open(event, track_id) {
      this.active_context_menued = track_id;
    },
    on_contextmenu_close() {
      this.active_context_menued = '';
    },
    is_mobile() {
      return /Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent);
    },
    left_swiped(id) {
      if (this.is_mobile()) {
        this.show_lyrics(null, id).then(x => x);
      }
    },
    right_swiped(id) {
      if (this.is_mobile()) {
        this.set_active(null, id);
      }
    }
  },
  mounted() {
    var self = this;
    $("#playlist-table").sortable({
      placeholder: "sortable-placeholder",
      handle: ".handle",
      update: function(event, ui) {
        var ordererd_ids = [].slice
          .call(self.$refs.playlist_table.querySelectorAll("tr"))
          .map(track => track.id);
        var payload = {
          tracks: ordererd_ids,
          playlist_id: self.$route.params.id
        }
        self.$store.dispatch("playlist/handle_reorder", payload);
      }
    });

  },
  data: function() {
    return {
      selected_rows: [],
      active_context_menued: '',
      lyrics: "",
      lyrics_loading: false,
      embedded: false
    };
  },
  watch: {
    shuffle(new_state, old_state) {
      if (new_state === true) {
        var table = this.$refs.playlist_table;
        for (var i = table.children.length; i >= 0; i--) {
          table.appendChild(table.children[(Math.random() * i) | 0]);
        }

        var ordererd_ids = [].slice
          .call(this.$refs.playlist_table.querySelectorAll("tr"))
          .map(track => track.id);

        var payload = {
          tracks: ordererd_ids,
          playlist_id: this.$route.params.id
        }
        this.$store.dispatch("playlist/handle_reorder", payload);
        this.$store.commit("playlist/shuffle", false);
      }
    },
    selected_rows(new_state, old_state) {
      if (new_state.length > 0) {
        this.$store.commit("playlist/selected", true);
      } else {
        this.$store.commit("playlist/selected", false);
      }
    }
  }
};
