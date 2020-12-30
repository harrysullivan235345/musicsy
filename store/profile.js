import axios from 'axios'

export const state = () => ({
  profile: false
})

export const mutations = {
  setProfile(state, payload) {
    state.profile = payload
  },

  set_avatar(state, payload) {
    state.profile.avatar = payload;
  }
}
