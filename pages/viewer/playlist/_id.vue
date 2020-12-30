<template>
  <span>
    <section class="mx-4">
      <div class="media mt-4">
        <img class="mr-4 d-md-block d-none playlist-media-img" :src="playlist.thumbnail" style="width: 16rem; height: auto;">
        <div class="media-body">
          <h1 class="mt-0 playlist-title d-flex flex-row">
            <span v-show="!editing_name">{{ playlist.name }}</span><input type="text" class="form-control form-control-lg" style="width: 14rem;" v-model="edited_playlist_name" v-show="editing_name" v-on:keyup.enter="save_name">
            <button class="btn btn-small btn-outline-primary ml-2" @click="edit_name" v-show="!editing_name">
              <i class="fa fa-edit"></i>
            </button>
            <button class="btn btn-small btn-outline-primary ml-2" @click="save_name" v-show="editing_name">
              <i class="fa fa-save"></i>
            </button>
          </h1>
          <p>
            Created by:
            <b>{{ playlist.creator }}</b>
            <i class="fa fa-circle dot align-middle mx-1"></i>
            {{ playlist.num_tracks }} songs - {{ to_mm_ss(playlist.duration) }}
            <br>
            {{ playlist.num_views + 1 }} Views
          </p>
          <div class="d-flex justify-content-between">
            <div class="d-flex flex-row">
              <no-ssr>
                <div class="d-flex flex-column mr-2">
                  <range-slider class="slider ml-2" min="1" max="3" v-model="clean_value"></range-slider>
                  <div>
                    <span class="col-2" title="Allow All Explicit Songs">
                      <i class="fas fa-cannabis" :class="{'text-success': clean_value === 1}"></i>
                    </span>
                    <span class="col-2 border-right border-left border-dark" title="Play Clean Versions of Explicit Songs">
                      <i class="fas fa-broom" :class="{'text-warning': clean_value === 2}"></i>
                    </span>
                    <span class="col-2" title="Don't Play Any Explicit Songs">
                      <i class="fas fa-ban" :class="{'text-danger': clean_value === 3}"></i>
                    </span>
                  </div>
                </div>
              </no-ssr>
              <button class="btn btn-outline-dark btn-sm mr-2 px-3" title="Download Playlist">
                <i class="fas fa-download"></i>
              </button>
              <button class="btn btn-outline-success btn-sm mr-2 px-3" title="Bulk Add Playlist" @click="add_bulk_track">
                <i class="fas fa-plus"></i>
              </button>
              <button class="btn btn-outline-danger btn-sm mr-2 px-3" title="Delete Playlist" @click="delete_playlist">
                <i class="fas fa-trash"></i>
              </button>
              <button class="btn btn-outline-info btn-sm mr-2 px-3" title="Like">
                <i class="fas fa-thumbs-up"></i>
              </button>
              <button class="btn btn-outline-info btn-sm mr-2 px-3" title="Dislike">
                <i class="fas fa-thumbs-down"></i>
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="delete_selected_rows" title="Delete Selected Rows" v-show="selected">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <no-ssr>
        <modal name="add_bulk_track" height="auto" :scrollable="true">
          <AddBulkTrack />
        </modal>
      </no-ssr>
      <!-- FINISH CLIENT FOR ADDING BULK THINGS -->
      <Playlist />
    </section>
  </span>
</template>
<script src="./viewer.playlist.script"></script>
<style>
.playlist-track-thumbnail {
  height: 2rem;
  width: 2rem;
}

.sortable-placeholder {
  height: 2rem;
  background-color: #d3d3d3;
  line-height: 2rem;
}

</style>
