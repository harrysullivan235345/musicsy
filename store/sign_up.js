export const state = () => ({
  data: {
    username: '',
  	email: '',
  	password: '',
  	confirm_password: '',
  }
})

export const mutations = {
  updateData(state, payload) {
    state.data = payload
  }
}
