import axios from "axios";
import vmodal from "vue-js-modal/dist/ssr.index";

export default {
  components: {
    vmodal
  },
  computed: {
    focused() {
      return this.$store.state.search_bar.data.focused;
    },
    loc() {
      var data = this.$store.state.search_bar.data;
      return {
        x: data.x,
        y: data.y
      };
    },
    standard_results() {
      return this.$store.state.search_bar.standard_results;
    },
    featured_result() {
      return this.$store.state.search_bar.featured_result;
    }
    // playlists() {
    //   return this.$store.state.playlists.
    // }
  },

  methods: {
    normalize(track_name, artist) {
      var sum = track_name.length + artist.length;
      var difference = sum - 30;
      if (difference > 0) {
        return (
          track_name.slice(0, track_name.length - difference).trim() + "..."
        );
      } else {
        return track_name;
      }
    },
    async search_harder() {
      var search_query = this.$store.state.search_bar.data.search_query;
      if (search_query.length > 0) {
        this.$nuxt.$loading.start();
        var xhr = await axios.post(
          `${process.env.baseUrl}/api/search/y_search`, {
            query: search_query
          }
        );
        var featured_result = xhr.data.results[0];
        var standard_results = xhr.data.results.slice(1);
        this.$store.commit("search_bar/set_results", {
          featured_result: featured_result,
          standard_results: standard_results
        });
        this.$nuxt.$loading.finish();
      }
    },
    async add_to_playlist(event) {
      var track_id =
        event.target.tagName === "I" ?
        event.target.parentElement.id :
        event.target.id;
      var playlist_id = this.$route.params.id;
      if (!playlist_id) {
        await this.add_to_indeterminate_playlist(track_id);
        return;
      }
      var featured_result = this.$store.state.search_bar.featured_result;
      var standard_results = this.$store.state.search_bar.standard_results;

      var info = {};
      if (featured_result.id === track_id) {
        info.track_name = featured_result.track_name;
        info.artist = featured_result.artist;
        info.tags = featured_result.tags;
        info.thumbnail = featured_result.thumbnail;
        info.is_explicit = featured_result.is_explicit;
        if (featured_result.thumbnail_to_be_changed) {
          info.thumbnail_to_be_changed = featured_result.thumbnail_to_be_changed;
        }
      } else {
        for (var i = 0; i < standard_results.length; i++) {
          var result = standard_results[i];
          if (result.id === track_id) {
            info.track_name = result.track_name;
            info.artist = result.artist;
            info.tags = result.tags;
            info.thumbnail = result.thumbnail;
            info.is_explicit = result.is_explicit;
            if (result.thumbnail_to_be_changed) {
              info.thumbnail_to_be_changed = result.thumbnail_to_be_changed;
            }
            break;
          }
        }
      }

      info.playlist_id = playlist_id;

      this.$nuxt.$loading.start();
      var xhr = await axios.post(
        `${process.env.baseUrl}/api/playlist/add_track`,
        info
      );
      this.$nuxt.$loading.finish();
      this.$store.commit("search_bar/set_focus", false);
      await this.$store.commit("playlist/add_track", xhr.data.track);
      await this.$store.dispatch("playlist/update_metadata");
      window.scrollTo(0, document.body.scrollHeight);
    },
    async add_to_indeterminate_playlist(track_id) {
      this.$modal.show("add_to_indeterminate_playlist_modal");
    },
    view_track(event) {
      var track_id =
        event.target.tagName === "I" ?
        event.target.parentElement.id :
        event.target.id;
      this.$router.push(`/viewer/track/${track_id}`);
    }
  },

  data() {
    return {
      profile: this.$store.state.profile.profile
    };
  }
};
