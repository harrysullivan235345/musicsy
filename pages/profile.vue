<template>
  <span>
    <div class="d-flex flex-md-row flex-column justify-content-left mt-4">
      <div class="ml-5 d-flex flex-column d-md-block text-center">
        <p class="font-weight-bold mb-0">Account Picture</p>
        <img
          class="rounded-circle display-profile-img my-3 mx-auto mx-md-0"
          ref="editor_image"
          :src="profile_image"
        >
        <img class="d-none" ref="editor_image" :src="upload_image">
        <div class="text-center d-block mt-1">
          <label class="btn btn-link pl-0" for="file-upload">
            Select
            <span v-show="cropper !== null">Another</span> Picture from Computer
          </label>
          <input
            type="file"
            class="d-none"
            @change="update_editor_photo"
            id="file-upload"
            name="upload_file"
            ref="file"
            accept="image/*"
          >
        </div>
        <button
          class="btn btn-secondary"
          @click="upload_to_server"
          v-show="cropper !== null"
        >Upload Photo</button>
      </div>
      <div class="ml-md-5 col-md-6">
        <!-- Change Email -->
        <div class="medium-border p-4 shadow-sm">
          <h3>Change Email</h3>
          <form @submit.prevent="submit_change_email" data-vv-scope="change_email">
            <div class="form-group">
              <input
                class="form-control"
                v-validate="'required|email'"
                name="new_email"
                type="text"
                placeholder="New Email"
                v-model="new_email"
              >
              <p class="text-danger text-left mt-1">{{ errors.first('change_email.new_email') }}</p>
            </div>
            <button type="submit" class="btn btn-primary">Change Email</button>
          </form>
        </div>
        <!-- Change Password -->
        <div class="mt-4 medium-border p-4 shadow-sm">
          <h4 class="mb-3">Change Password</h4>
          <form @submit.prevent="submit_change_password" data-vv-scope="change_password">
            <div class="form-group">
              <input
                class="form-control"
                v-validate="'required|password_correct'"
                data-vv-validate-on="change"
                name="current_password"
                type="password"
                placeholder="Current Password"
                v-model="current_password"
              >
              <p
                class="text-danger text-left mt-1"
              >{{ errors.first('change_password.current_password') }}</p>
            </div>
            <div class="form-group">
              <input
                class="form-control"
                v-validate="'required'"
                name="new_password"
                type="password"
                placeholder="New Password"
                v-model="new_password"
                ref="new_password"
              >
              <p
                class="text-danger text-left mt-1"
              >{{ errors.first('change_password.new_password') }}</p>
            </div>
            <div class="form-group">
              <input
                class="form-control"
                v-validate="'required|confirmed:new_password'"
                name="new_password_confirm"
                type="password"
                placeholder="Confirm New Password"
                v-model="new_password_confirm"
              >
              <p
                class="text-danger text-left mt-1"
              >{{ errors.first('change_password.new_password_confirm') }}</p>
            </div>
            <button type="submit" class="btn btn-primary">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
import "cropperjs/dist/cropper.css";
import axios from "axios";
import Cropper from "cropperjs";
import VeeValidate from "vee-validate";

VeeValidate.Validator.extend("password_correct", {
  getMessage: "Current Password is incorrect",
  validate: async value => {
    var xhr = await axios.post(
      `${process.env.baseUrl}/api/profile/password_correct`,
      {
        password: value
      }
    );
    return xhr.data.correct;
  }
});

export default {
  components: {
    VeeValidate
  },
  computed: {
    profile_image() {
      return this.$store.state.profile.profile.avatar;
    }
  },
  middleware: "authenticated",
  data: function() {
    return {
      focus: this.$route.query.focus,
      profile: this.$store.state.profile.profile,
      upload_image: "",
      cropper: null,

      new_email: "",
      current_password: "",
      new_password: "",
      new_password_confirm: ""
    };
  },
  methods: {
    update_editor_photo() {
      if (this.cropper !== null) {
        this.cropper.destroy();
      }
      this.upload_image = URL.createObjectURL(this.$refs.file.files[0]);
      var self = this;
      this.$refs.editor_image.onload = () => {
        const image = self.$refs.editor_image;
        var img_width = image.width;
        var img_height = image.height;
        var ratio = (window.innerWidth * 0.5) / img_width;
        image.width = img_width * ratio;
        image.height = img_height * ratio;

        self.cropper = new Cropper(image, { aspectRatio: 1 });
      };
    },
    async upload_to_server() {
      this.$nuxt.$loading.start();
      var crop_box = this.cropper.getData(true);
      var formdata = new FormData();
      formdata.append("file", this.$refs.file.files[0]);
      formdata.append("crop_box", JSON.stringify(crop_box));
      var xhr = await axios({
        method: "post",
        url: `${process.env.baseUrl}/api/profile/change_avatar`,
        data: formdata,
        header: {
          "Content-Type": "multipart/form-data"
        }
      });
      this.$nuxt.$loading.finish();
      this.$store.commit("profile/set_avatar", xhr.data.avatar);
    },

    async submit_change_email() {
      var valid = await this.$validator.validateAll("change_email");
      if (valid) {
        var xhr = await axios.post(
          `${process.env.baseUrl}/api/profile/change_email`,
          {
            email: this.new_email
          }
        );
        this.$toast.show("Email Changed");
      }
    },

    async submit_change_password() {
      var valid = await this.$validator.validateAll("change_password");
      if (valid) {
        var xhr = await axios.post(
          `${process.env.baseUrl}/api/profile/change_password`,
          {
            current_password: this.current_password,
            new_password: this.new_password,
            new_password_confirm: this.new_password_confirm
          }
        );
        window.location.href = `${process.env.baseUrl}/login`;
      }
    }
  }
};
</script>

<style>
.display-profile-img {
  width: 8rem;
  height: auto;
}

.medium-border {
  border: solid 0.05rem #b9b9b9;
}
</style>
