<template>
  <div>
    <no-ssr>
      <modal name="add_to_indeterminate_playlist_modal">hey there</modal>
    </no-ssr>
    <div class="position-absolute shadow-lg search_dropdown" v-show="focused" :style="{ top: loc.y + 'px', left: loc.x + 'px' }" style="z-index: 234;">
      <div class="d-flex flex-column flex-md-row">
        <span id="standard">
          <div class="list-group p-4 mb-4" v-if="standard_results.length > 0">
            <span href="#" class="list-group-item list-group-item-action" v-for="result in standard_results" :title="result.track_name +  '*** ' + result.artist" :key="result.id">
              <img class="standard-thumbnail mr-2" :src="result.thumbnail">
              <span class="text-capitalize">{{ normalize(result.track_name,result.artist) }}</span>
              <span class="mx-1 font-weight-bold">|</span>
              <span class="text-capitalize">{{ result.artist }}</span>
              <button class="btn btn-outline-success btn-sm ml-2" @click="view_track" :id="result.id">
                <i class="fa fa-eye"></i>
              </button>
              <button class="btn btn-outline-warning btn-sm" @click="add_to_playlist" :id="result.id">
                <i class="fa fa-plus"></i>
              </button>
            </span>
          </div>
          <div v-else-if="featured_result && standard_results.length === 0">
            <i class="fas fa-arrow-right fa-5x m-3"></i>
          </div>
          <div class="mx-3 pt-4 mb-5" v-else>
            <h4 class="align-middle">Nothing found</h4>
          </div>
          <button class="btn btn-sm btn-primary position-absolute" @click="search_harder" style="bottom: 0">Ruminate Bigly</button>
        </span>
        <div class="p-4 px-5" id="featured">
          <span class="d-flex flex-column" v-if="featured_result">
            <img class="featured-thumbnail mx-auto" :src="featured_result.thumbnail">
            <h4 class="text-center text-capitalize" :title="featured_result.track_name + ' *** ' + featured_result.artist">
              <b>{{ normalize(featured_result.track_name, featured_result.artist) }}</b>
            </h4>
            <h4 class="text-center text-capitalize">{{ featured_result.artist }}</h4>
            <div class="d-flex flex-row justify-content-center">
              <button class="btn btn-outline-success btn-sm" @click="view_track" :id="featured_result.id">
                <i class="fa fa-eye"></i>
              </button>
              <button class="btn btn-outline-warning btn-sm ml-2" @click="add_to_playlist" :id="featured_result.id">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </span>
          <span v-else>
            <h4>Nothing found</h4>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./search_dropdown.script">
</script>
<style scoped>
#standard {
  background-color: #f0f0f0;
}

#standard .list-group-item {
  background-color: #f3f3f3;
  cursor: pointer;
}

#standard .list-group-item:hover {
  background-color: #f0f0f0;
}

#featured {
  background-color: #e5e5e5;
  cursor: pointer;
}

#featured:hover {
  background-color: #d9d9d9;
}

#featured-track {
  background-color: #e5e5e5;
  border: none;
}

.featured-thumbnail {
  height: 9rem;
  width: auto;
}

.standard-thumbnail {
  height: 1.7rem;
  width: auto;
}

</style>
