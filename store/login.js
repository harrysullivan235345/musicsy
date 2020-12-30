export const state = () => ({
  data: {
    username: '',
    password: ''
  }
})

export const mutations = {
  updateData(state, payload) {
    state.data = payload
  }
}
