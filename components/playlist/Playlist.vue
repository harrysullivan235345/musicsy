<template>
  <span>
    <table class="table playlist-table table-sm large-dynamic-pb" :class="embedded ? 'mt-0' : 'mt-4'">
      <thead>
        <tr class="d-md-table-row d-none text-capitalize">
          <th>
            <input type="checkbox" :checked="selected_rows.length === tracks.length" @change="select_all_rows">
          </th>
          <th></th>
          <th>song</th>
          <th>artist</th>
          <th>
            <i class="far fa-calendar"></i>
          </th>
          <th>
            <i class="fas fa-stopwatch"></i>
          </th>
        </tr>
      </thead>
      <tbody id="playlist-table" ref="playlist_table">
        <tr class="table-row" :id="track._id" v-for="track in tracks" :key="track._id" @contextmenu.prevent="$refs.menu.open($event, track._id)" :class="{ tentative_track: track._id === active_track && !playing, active_track: track._id === active_track && playing, selected_row: selected_rows.indexOf(track._id) !== -1, context_menued: track._id === active_context_menued }" :style="{ textDecoration: requested_clean === 3 && track.is_explicit ? 'line-through' : 'none' }">
          <td class="checkbox pt-2">
            <input type="checkbox" :value="track._id" v-model="selected_rows">
          </td>
          <td class="handle cursor-grab">
            <img class="playlist-track-thumbnail" :src="track.thumbnail" v-touch:swipe.left="() => left_swiped(track._id)" v-touch:swipe.right="() => right_swiped(track._id)">
          </td>
          <td class="text-capitalize no-select-mobile" scope="row">
            <i class="fa fa-question explict_question" v-if="track.is_explicit === null" @click="show_explicit_modal(track._id)"></i>
            <i class="fa fa-broom" v-if="track.is_explicit || track.is_explicit === null" v-show="requested_clean === 2"></i>
            <i class="fa fa-poo" v-if="track.is_explicit" v-show="requested_clean === 1 || requested_clean === 3"></i>
            {{ track.track_name }}
          </td>
          <td class="text-capitalize no-select-mobile">{{ track.artist }}</td>
          <td class="no-select-mobile">{{ from_now(track.date_added) }}</td>
          <td class="no-select-mobile">{{ to_mm_ss(track.duration) }}</td>
        </tr>
      </tbody>
    </table>
    <no-ssr>
      <modal name="lyrics-viewer" :height="'auto'" :scrollable="true">
        <div class="text-center my-4 px-3">
          <h1>Song Lyrics</h1>
          <span v-html="lyrics" v-show="!lyrics_loading" style="white-space: pre;"></span>
          <i class="fas fa-spinner fa-spin fa-4x" v-show="lyrics_loading"></i>
          <br>
          <button class="btn btn-secondary mt-4" @click="$modal.hide('lyrics-viewer')">Close</button>
        </div>
      </modal>
      <v-dialog />
      <vue-context ref="menu" @open="on_contextmenu_open" @close="on_contextmenu_close">
        <ul slot-scope="child">
          <li @click="set_active($event.target, child.data)">
            <i class="fas fa-angle-double-down mr-2"></i>
            Set as Active Track
          </li>
          <li @click="update_track($event.target, child.data)">
            <i class="fas fa-wrench mr-2"></i>
            Fix Track
          </li>
          <li @click="show_lyrics($event.target, child.data)">
            <i class="fas fa-info mr-2"></i>
            Track Lyrics
          </li>
          <li @click="delete_track($event.target, child.data)">
            <i class="fas fa-eraser mr-2"></i>
            Delete Track
          </li>
        </ul>
      </vue-context>
    </no-ssr>
  </span>
</template>
<style scoped>
#audioplayer {
  position: fixed;
  bottom: 0;
  background-color: #f6f6f6;
}

.tentative_track {
  box-shadow: inset 0px 0px 0px 0.2rem lightblue;
}

.active_track {
  background-color: lightblue;
}

.selected_row {
  background-color: lightgray;
}

.playlist-track-thumbnail {
  cursor: move;
}

.explict_question {
  cursor: pointer;
}

.explict_question:hover {
  color: rgb(68, 68, 68);
}

input[type="checkbox"] {
  width: 0.8rem;
  height: 0.8rem;
}

.context_menued {
  background-color: lightgray;
  box-shadow: inset 0px 0px 0px 0.2rem darkgrey;
}

.large-dynamic-pb {
  margin-bottom: 5.3rem;
}

@media (-moz-touch-enabled: 1),
(pointer:coarse) {
  .no-select-mobile {
    user-select: none;
  }

  .large-dynamic-pb {
    margin-bottom: 8.8rem;
  }
}

</style>
<script src="./playlist.script">
</script>
