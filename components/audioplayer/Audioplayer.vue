<template>
  <div class="controls w-100" id="audioplayer" :class="embedded ? 'p-2' : 'p-3'" v-show="is_showing || is_playing">
    <span class="text-danger">{{error}}</span>
    <div class="d-flex flex-row flex-wrap justify-content-center">
      <audio ref="audio">
        <source ref="audio_source" type="audio/mpeg">
      </audio>
      <div class="mx-5" id="cmd_btns">
        <!-- Back Skip -->
        <button class="btn btn-outline-info rounded-circle" :class="embedded ? 'btn-sm' : ''" @click="skip(-1)" :disabled="active_track_pos === 0">
          <i class="fas fa-step-backward"></i>
        </button>
        <!-- Play -->
        <button class="btn btn-outline-info rounded-circle" :class="embedded ? 'btn-sm' : ''" @click="play_pause" :disabled="!canplay">
          <i class="fas fa-play" v-show="!is_playing && !loading"></i>
          <i class="fas fa-pause" v-show="is_playing && !loading"></i>
          <i class="fas fa-spinner fa-spin" v-show="loading"></i>
        </button>
        <!-- Forward Skip -->
        <button class="btn btn-outline-info rounded-circle" :class="embedded ? 'btn-sm' : ''" @click="skip(1)" :disabled="active_track_pos === tracks_length - 1">
          <i class="fas fa-step-forward"></i>
        </button>
      </div>
      <div class="flex-grow-1 d-flex flex-row align-items-center">
        <p class="d-inline mb-0 text-right" id="current_time">{{ current_time_str }}</p>
        <div class="progress align-middle mx-3 w-100" id="timeline" style="height: 0.3rem">
          <div class="progress-bar" :style="{width: current_time_pct}"></div>
        </div>
        <p class="d-inline mb-0" id="end_time">{{ end_time_str }}</p>
      </div>
      <div class="ml-3 mr-sm-5 mr-md-0 d-flex flex-row">
        <button class="btn btn-outline-info rounded-circle mr-2" :class="embedded ? 'btn-sm' : ''" @click="reload">
          <i class="fas fa-undo"></i>
        </button>
        <button class="btn btn-outline-info rounded-circle" :class="embedded ? 'btn-sm' : ''" @click="shuffle">
          <i class="fas fa-random"></i>
        </button>
        <div class="btn-group-toggle mx-2" data-toggle="buttons">
          <label class="btn btn-outline-info rounded-circle" :class="{'btn-sm': embedded, 'active': is_looping}" @click="handle_loop_click">
            <i class="fas fa-retweet"></i>
            <input type="checkbox">
          </label>
        </div>
      </div>
      <div class="pt-1">
        <i class="fas fa-volume-up"></i>
        <input class="range blue d-inline align-middle mx-3" type="range" min="0" max="100" value="100" ref="volume" @wheel="handle_volume_scroll($event)" @input="update_volume(null)">
      </div>
    </div>
  </div>
</template>
<style scoped>
#audioplayer {
  position: fixed;
  bottom: 0;
  background-color: #f6f6f6;
}

</style>
<script src="./audioplayer.script">
</script>
