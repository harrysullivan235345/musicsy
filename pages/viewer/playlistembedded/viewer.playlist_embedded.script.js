import Playlist from "~/components/playlist/Playlist.vue";
import AddBulkTrack from '~/components/addbulktrack/AddBulkTrack.vue';
import axios from "axios";
import moment from "moment";
import vmodal from "vue-js-modal/dist/ssr.index";
import RangeSlider from 'vue-range-slider';
import 'vue-range-slider/dist/vue-range-slider.css';

export default {
  components: {
    Playlist,
    vmodal,
    RangeSlider,
    AddBulkTrack
  },
  layout: 'embedded',
  computed: {
    playlist() {
      return this.$store.state.playlist.playlist;
    },
    selected() {
      return this.$store.state.playlist.selected;
    }
  },
  async fetch({ store, params }) {
    await store.dispatch("playlist/init", {
      playlist_id: params.id
    });
    axios
      .post(`${process.env.baseUrl}/api/playlist/add_view`, {
        playlist_id: params.id
      })
      .then(() => { });
  },
  methods: {
    to_mm_ss(t) {
      var m = moment()
        .hours(0)
        .minutes(0)
        .seconds(parseInt(t));
      if (m.hour() > 0) {
        return m.format("h [hours], mm [minutes], ss [seconds]");
      } else {
        return m.format("mm [minutes], ss [seconds]");
      }
    },
    edit_name() {
      this.edited_playlist_name = this.playlist.name;
      this.editing_name = !this.editing_name;
    },
    save_name() {
      this.$store.commit("playlist/change_name", this.edited_playlist_name);
      axios
        .post(`${process.env.baseUrl}/api/playlist/change_name`, {
          playlist_id: this.$route.params.id,
          desired_name: this.edited_playlist_name
        })
        .then(x => x);
      this.editing_name = false;
    },
    async delete_playlist() {
      this.$modal.hide("options");
      this.$modal.show("dialog", {
        title: "Delete Playlist",
        text: "Are you sure you want to delete this playlist?",
        buttons: [
          {
            title: "Yes",
            handler: async () => {
              var done = await axios.post(
                `${process.env.baseUrl}/api/playlist/delete_playlist`,
                {
                  playlist_id: this.$route.params.id
                }
              );
              this.$router.push("/");
            }
          },
          {
            title: "No"
          }
        ]
      });
    },
    play() {
      this.$store.commit("playlist/set_playing", true);
    },
    delete_selected_rows() {
      alert("deleying selected rows");
    },
    add_bulk_track() {
      this.$modal.show('add_bulk_track');
    }
  },
  data() {
    return {
      edited_playlist_name: "",
      editing_name: false,
      requesting_clean: [],
      clean_value: 1
    };
  },
  watch: {
    clean_value(new_state, old_state) {
      this.$store.dispatch("playlist/toggle_clean", this.clean_value);
    }
  }
};