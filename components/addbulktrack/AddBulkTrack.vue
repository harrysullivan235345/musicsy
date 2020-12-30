<template>
  <div class="p-3">
    <ul class="list-group">
      <li
        class="list-group-item d-flex flex-row justify-content-between"
        v-for="searched_query in finished_queries"
        :class="{strikethrough: added.indexOf(searched_query.key) !== -1}"
        :key="searched_query.key"
      >
        <span>
          <img :src="searched_query.thumbnail" class="playlist-track-thumbnail mr-3">
          <i class="fas fa-poo pt-1 mr-1" v-if="searched_query.is_explicit"></i>
          {{ searched_query.track_name }}
          <span class="mx-2">---</span>
          {{ searched_query.artist }}
        </span>
        <span>
          <button
            class="btn btn-sm btn-outline-danger mr-auto"
            @click="delete_item(searched_query.key)"
          >
            <i class="fas fa-trash"></i>
          </button>
        </span>
      </li>
      <li
        class="list-group-item d-flex flex-row"
        v-for="searched_query in pending_queries"
        :key="searched_query.key"
      >
        <i class="fas fa-stroopwafel fa-spin"></i>
      </li>
      <li class="list-group-item d-flex flex-row">
        <input
          class="form-control ml-3"
          placeholder="Search"
          type="text"
          v-model="active_input"
          @keyup.enter="add"
        >
      </li>
    </ul>
    <button class="btn btn-block btn-default mt-3" @click="submit" :disabled="queries.length === 0">
      <i class="fas fa-circle-notch fa-spin mr-1" v-show="loading"></i>Add
    </button>
  </div>
</template>

<style scoped>
.strikethrough {
  text-decoration: line-through;
}
</style>

<script src="./addbulktrack.script">
</script>
