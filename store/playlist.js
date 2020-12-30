import axios from 'axios';

async function get_playlist(playlist_id) {
  let { data } = await axios.post(`${process.env.baseUrl}/api/playlist/get_playlist`, {
    playlist_id: playlist_id.playlist_id
  });
  return data.playlist;
}

export const state = () => ({
  active_track: '',
  playlist: {},
  src: '',
  playing: false,
  tracks: [],
  shuffle: false,
  selected: false,
  clean: 1
})

export const mutations = {
  update_playlist(state, payload) {
    state.playlist = payload
  },
  update_tracks(state, payload) {
    state.tracks = payload
  },
  add_track(state, payload) {
    state.tracks.push(payload);
  },
  set_active_track(state, payload) {
    state.active_track = payload;
  },
  set_playing(state, payload) {
    state.playing = payload;
  },
  change_name(state, payload) {
    state.playlist.name = payload;
  },
  delete_track(state, payload) {
    state.tracks.splice(payload, 1);
  },
  shuffle(state, payload) {
    state.shuffle = payload;
  },
  selected(state, payload) {
    state.selected = payload;
  },
  set_clean(state, payload) {
    state.clean = payload;
  },
  set_explicit(state, payload) {
    var i = state.tracks.map(t => t._id).indexOf(payload.track_id);
    state.tracks[i].is_explicit = payload.state;
  },
  set_duration(state, payload) {
    state.playlist.duration = payload;
  },
  set_num_tracks(state, payload) {
    state.playlist.num_tracks = payload;
  }
}

export const actions = {
  async init({ commit }, payload) {
    var playlist = await get_playlist(payload);
    if (playlist.tracks.length > 0) {
      commit('update_tracks', playlist.tracks);
      commit('set_active_track', playlist.tracks[0]._id);
      delete playlist.tracks;
      commit('update_playlist', playlist);
    } else {
      commit('update_tracks', []);
      commit('set_active_track', null);
      commit('update_playlist', playlist);
    }

  },
  delete_track({ commit, state }, payload) {
    var i = state.tracks.map(t => t._id).indexOf(payload);
    commit('delete_track', i);
  },

  handle_reorder({ commit, state, route }, payload) {
    var correctly_ordered_tracks = payload.tracks.map((track_id) => {
      var i = state.tracks.map(t => t._id).indexOf(track_id);
      return state.tracks[i];
    });
    var ordered_ids = correctly_ordered_tracks.map(t => t._id);
    axios.post(`${process.env.baseUrl}/api/playlist/change_track_order`, {
      playlist_id: payload.playlist_id,
      new_track_order: ordered_ids
    })
    commit('update_tracks', correctly_ordered_tracks);
  },

  toggle_clean({ commit, state }, payload) {
    commit('set_clean', payload);
  },

  update_metadata({ commit, state }) {
    var duration = state.tracks.map(track => track.duration).reduce((total, num) => total + num);
    commit('set_duration', duration);
    commit('set_num_tracks', state.tracks.length);
  }
}
