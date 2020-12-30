<template>
  <div>
    <nuxt/>

    <Audioplayer/>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
  </div>
</template>

<style>
html {
  font-family: "Cabin", "Lato", sans-serif;
}

body {
  background-color: #ebebeb;
  color: #5b5b5b;
  z-index: 1;
}

.dot {
  font-size: 0.4rem;
}

.form-control {
  border-radius: 0;
}

.btn {
  border-radius: 0;
}

.overlay {
  z-index: 2;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.5;
}
</style>

<script>
import Navbar from "~/components/navbar/Navbar.vue";
import Audioplayer from "~/components/audioplayer/Audioplayer.vue";
import "vue-js-modal/dist/styles.css";

export default {
  components: {
    Navbar,
    Audioplayer
  },
  middleware: ["profile"]
};
</script>
