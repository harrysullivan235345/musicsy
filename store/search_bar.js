export const state = () => ({
  data: {
    x: 0,
    y: 0,
    focused: false,
    result_clicked: false,
    search_query: ''
  },
  featured_result: {
    id: 'fds903ijwasz0pioawef',
    thumbnail: "http://static.rhap.com/img/170x170/3/7/9/4/12464973_170x170.jpg",
    track_name: 'Big Plans',
    artist: "Why don't we"
  },
  standard_results: [
    {
      id: 'osf89wiaofesuieaos',
      thumbnail: "http://static.rhap.com/img/170x170/3/7/9/4/12464973_170x170.jpg",
      track_name: 'Without Me',
      artist: "Halsey"
    },
    {
      id: 'sdfwfesdsf',
      thumbnail: "http://static.rhap.com/img/170x170/3/7/9/4/12464973_170x170.jpg",
      track_name: 'Without Me',
      artist: "Halsey"
    }
  ]
})

export const mutations = {
  updateData(state, payload) {
    state.data = payload
  },
  set_focus(state, payload) {
  	state.data.focused = payload
  },
  set_coords(state, payload) {
    state.data.x = payload.x
    state.data.y = payload.y
  },
  result_clicked(state, payload) {
    state.data.result_clicked = payload;
  },
  set_results(state, payload) {
    state.featured_result = payload.featured_result;
    state.standard_results = payload.standard_results;
  },
  set_search_query(state, payload) {
    state.data.search_query = payload
  }
}
