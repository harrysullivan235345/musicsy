<template>
  <span>
    <section class>
      <div class="my-5 ml-4">
        <span v-for="category in categories" :key="category.id">
          <p class="font-weight-bold">{{ category.name }}</p>
          <div class="d-flex justify-content-left explore-content-row">
            <nuxt-link
              class="p-1 cursor-pointer explore-item btn-link"
              v-for="item in category.items"
              :to="'/viewer/playlist/' + item._id"
              :key="item._id"
            >
              <img class="thumbnail" :src="item.thumbnail" style="width: 16rem; height: auto">
              <br>
              <b>
                <p class="mt-2 mb-0">{{ item.name }}</p>
              </b>
              <p class="mb-0">{{ item.creator }}</p>
              <p>
                {{ format_views(item.num_views) }}
                <i class="fa fa-circle px-2 dot align-middle"></i>
                {{ format_date_added(item.date_added) }}
              </p>
            </nuxt-link>
          </div>
        </span>
      </div>
    </section>
  </span>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  computed: {
    categories() {
      return this.$store.state.home.top_playlists;
    }
  },
  async fetch({ store, params }) {
    await store.dispatch("home/init");
  },
  methods: {
    format_views(n) {
      return n + " Views";
    },
    format_date_added(d) {
      return moment(parseInt(d)).fromNow();
    }
  }
};
</script>

<style>
.explore-content-row {
  width: 95%;
  overflow-x: auto;
}

.explore-item {
  text-decoration: none;
  color: #5b5b5b;
  font-size: 1rem;
}

.explore-item:hover,
.explore-item:visited,
.explore-item:active {
  color: #787878;
  text-decoration: none;
}
</style>
