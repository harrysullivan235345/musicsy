import axios from 'axios';
import unique_string from 'unique-string';
import io from 'socket.io-client';

export default {
  computed: {
    finished_queries() {
      return this.queries.filter(q => {
        return !q.pending;
      })
    },
    pending_queries() {
      return this.queries.filter(q => q.pending);
    },
    queries_keys() {
      return this.queries.map(q => q.key);
    }
  },
  created() {
    var socket = io.connect(process.env.baseUrl);
    var self = this;
    socket.on('status', function (status) {
      self.added.push(status);
    })
  },
  methods: {
    add() {
      var key = unique_string();
      this.queries.push({ query: this.active_input, key: key, pending: true });
      axios.post(
        `${process.env.baseUrl}/api/search/g_search`,
        {
          query: this.active_input
        }
      ).then(xhr => {
        var featured_result = xhr.data.results[0];
        var query = this.queries[this.queries_keys.indexOf(key)];

        query.pending = false;
        query.track_name = featured_result.track_name;
        query.artist = featured_result.artist;
        query.is_explicit = featured_result.is_explicit;
        query.tags = featured_result.tags;
        query.thumbnail = featured_result.thumbnail;
      })
      this.active_input = ''
    },
    delete_item(key) {
      this.queries.splice(this.queries_keys.indexOf(key), 1);
    },
    async submit() {
      this.loading = true;
      var xhr = await axios.post(`${process.env.baseUrl}/api/playlist/add_tracks_bulk`, {
        tracks: this.queries,
        playlist_id: this.$route.params.id
      });
      var add_to_screen = xhr.data.tracks.map(async t => {
        return await this.$store.commit("playlist/add_track", t);
      });
      await Promise.all(add_to_screen);
      await this.$store.dispatch("playlist/update_metadata");
      this.$modal.hide('add_bulk_track');
      this.loading = false;
    }
  },
  data() {
    return {
      active_input: '',
      queries: [],
      added: [],
      loading: false
    }
  }
}