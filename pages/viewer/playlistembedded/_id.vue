<template>
  <span>
    <section class="mx-4">
      <div class="media mt-4">
        <div class="media-body">
          <h4 class="mt-0 playlist-title d-flex flex-row">
            <span v-show="!editing_name">{{ playlist.name }}</span>
          </h4>
          <p>
            Created by:
            <b>{{ playlist.creator }}</b>
          </p>
        </div>
      </div>
      <Playlist />
    </section>
  </span>
</template>
<script src="./viewer.playlist_embedded.script"></script>
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
