<template>
  <span>
    <nav class="navbar navbar-inverse navbar-light">
      <nuxt-link class="navbar-brand pl-sm-5 pl-2 mr-3" to="/">
        <img class="mb-2 mr-1 logo" src="/favicon.png">
        Musicsy
      </nuxt-link>
      <div class="d-flex flex-fill flex-row justify-content-end">
        <form class="form-inline flex-fill my-2 ml-4 my-2-lg-0 d-flex justify-content-center">
          <input
            class="form-control mr-sm-2 w-75 search_bar"
            type="text"
            placeholder="Search"
            ref="search"
            @focus="set_focus"
            @keyup.esc="set_blur"
            @input="handle_search_input"
          >
          <button
            class="btn btn-outline-secondary my-2 my-sm-0"
            type="submit"
            @click="execute_search"
          >
            <i class="fas fa-search"></i>
          </button>
        </form>

        <button
          class="btn btn-outline-secondary mr-5"
          title="Add a New Playlist"
          v-if="profile"
          @click="add_playlist"
        >+</button>

        <ul class="mb-0 d-none d-md-flex flex-row ml-auto" v-if="!profile">
          <nuxt-link class="nav-link mr-3" to="/login">Login</nuxt-link>
          <nuxt-link class="nav-link mr-3" to="/sign_up">Sign Up</nuxt-link>
        </ul>

        <div class="dropdown mr-md-5 mr-0" :class="profile ? '' : 'd-md-none d-lg-none d-xl-none'">
          <button
            class="btn btn-secondary"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <li class="nav-item pr-2">
              <img
                class="avatar rounded-circle align-middle"
                :src="profile ? `${profile.avatar}` : 'https://www.w3schools.com/howto/img_avatar.png'"
              >
              <i class="fa profile-arrow ml-3 ml-md-2 fa-chevron-down d-inline align-middle"></i>
            </li>
          </button>

          <div
            class="dropdown-menu dropdown-menu-right position-absolute"
            aria-labelledby="dropdownMenuButton"
          >
            <span v-if="!profile">
              <nuxt-link class="dropdown-item" to="/login">Login</nuxt-link>
              <nuxt-link class="dropdown-item" to="/sign_up">Sign Up</nuxt-link>
            </span>
            
            <span v-else>
              <div class="d-flex flex-row pb-2 px-4 pt-4">
                <span>
                  <nuxt-link to="/profile?focus=change_avatar">
                    <img
                      class="avatar-change-img rounded-circle align-middle"
                      :src="`${profile.avatar}`"
                      title="Change Avatar"
                      ref="change_avatar_img"
                    >
                  </nuxt-link>
                </span>
                <div class="ml-3">
                  <p class="font-weight-bold mb-0">{{ profile.username }}</p>
                  <p>{{ profile.email }}</p>
                  <nuxt-link class="btn btn-info text-white" to="/profile">Account</nuxt-link>
                </div>
              </div>
              <a class="dropdown-item" href="#" @click="logout">Logout</a>
            </span>
          </div>
        </div>
      </div>
    </nav>

    <searchDropdown/>
  </span>
</template>

<style scoped>
.navbar {
  background-color: #f6f6f6;
  color: #5b5b5b !important;
}
.navbar .form-inline {
  width: 80%;
}
.navbar .form-control[type="search"] {
  width: 75%;
  background-color: #f6f6f6;
}
.navbar img.avatar {
  height: 2.8rem;
  width: 2.8rem;
}
.navbar img.avatar-change-img {
  height: 4.5rem;
  width: 4.5rem;
  opacity: 1;
}
.navbar img.avatar-change-img:hover {
  opacity: 0.8;
  cursor: pointer;
}

.nav-link {
  color: #5b5b5b !important;
  font-size: 1.7rem;
}

.navbar-brand {
  color: #5b5b5b !important;
  font-size: 2rem;
  color: #5b5b5b !important;
}

.nav-link {
  font-size: 1.5rem;
  transition: 0.2s;
  white-space: nowrap;
}
.nav-link:hover {
  color: #7d7d7d !important;
}

.navbar-toggler,
.navbar-toggler-icon {
  color: #5b5b5b !important;
  outline: none;
}

li {
  list-style-type: none;
}
</style>

<script src="./navbar.script">
</script>
