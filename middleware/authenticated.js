export default function ({ store, redirect }) {
  if (!store.state.profile.profile) {
    return redirect('/login')
  }
}