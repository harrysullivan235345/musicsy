import axios from "axios";
import searchDropdown from "~/components/search_dropdown/searchDropdown";

export default {
  components: {
    searchDropdown
  },

  computed: {
    profile() {
      return this.$store.state.profile.profile;
    }
  },

  mounted() {
    this.$nextTick(function () {
      var payload = {};
      var coords = this.$refs.search.getBoundingClientRect();
      payload.x = coords.left;
      payload.y = coords.top + coords.height + 7;
      payload.focused = false;

      this.$store.commit("search_bar/updateData", payload);
      self = this;
      window.addEventListener("resize", function () {
        var coords = self.$refs.search.getBoundingClientRect();
        var payload = {};
        payload.x = coords.left;
        payload.y = coords.top + coords.height + 7;
        self.$store.commit("search_bar/set_coords", payload);
      });

      window.addEventListener("click", e => {
        var target = e.target;
        if (
          !this.has_parent_with_class(target, ".search_dropdown") &&
          !target.classList.contains("search_bar")
        ) {
          e.stopPropagation();
          this.$store.commit("search_bar/set_focus", false);
        }
      });
    });
  },

  data: function () {
    return {
      queue: [],
      timer: null
    };
  },
  methods: {
    async logout() {
      var xhr = await axios.get(`${process.env.baseUrl}/api/auth/logout`);
      window.location.href = `${process.env.baseUrl}/`;
    },

    set_focus() {
      this.$store.commit("search_bar/set_focus", true);
    },

    set_blur() {
      this.$store.commit("search_bar/set_focus", false);
    },

    has_parent_with_class(target, selector) {
      return [...document.querySelectorAll(selector)].some(
        el => el !== target && el.contains(target)
      );
    },

    handle_search_input(event) {
      this.$store.commit("search_bar/set_search_query", event.target.value);
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
      self = this;
      this.timer = window.setTimeout(function () {
        self.timer = null;
        self.execute_search();
      }, 400);
    },

    async execute_search() {
      var search_query = this.$store.state.search_bar.data.search_query;
      if (search_query.length > 0) {
        this.$nuxt.$loading.start();
        var xhr = await axios.post(
          `${process.env.baseUrl}/api/search/g_search`,
          {
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

    async add_playlist() {
      this.$nuxt.$loading.start();
      var xhr = await axios.post(`${process.env.baseUrl}/api/playlist/add`, {
        user_id: this.profile.id
      });
      var playlist_id = xhr.data.playlist_id;
      this.$nuxt.$loading.finish();
      this.$router.push(`/viewer/playlist/${playlist_id}`);
    }
  }
};