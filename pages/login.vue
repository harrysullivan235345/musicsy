<template>
  <span>
    <section class>
      <div
        class="jumbotron mb-4 col-lg-6 col-md-9 col-sm-11 user-form-wrapper text-center pt-4 bg-light mt-3 mx-auto"
      >
        <h1 class="display-3 text-center mb-4">Login</h1>

        <form @submit.prevent="submit">
          <div class="form-group">
            <input
              class="form-control"
              v-validate="'required'"
              name="username"
              type="text"
              placeholder="Username"
              v-model="username"
              autofocus
            >
            <p class="text-danger text-left mt-1">{{ errors.first('username') }}</p>
          </div>
          <div class="form-group">
            <input
              class="form-control"
              v-validate="'required'"
              name="password"
              type="password"
              placeholder="Password"
              v-model="password"
            >
            <p class="text-danger text-left mt-1">{{ errors.first('password') }}</p>
          </div>
          <button class="btn btn-block btn-primary">Login</button>
          <p class="text-danger text-center mt-1">{{ form_err }}</p>
        </form>
        <div class="mt-4"></div>

        <a class="btn btn-outline-secondary mr-2" href="/api/auth/google" data-hard-req="true">
          <i class="fab fa-google"></i>
        </a>
        <a class="btn btn-outline-secondary mr-2" href="/api/auth/twitter" data-hard-req="true">
          <i class="fab fa-twitter"></i>
        </a>
        <a class="btn btn-outline-secondary mr-2" href="/api/auth/facebook" data-hard-req="true">
          <i class="fab fa-facebook"></i>
        </a>

        <br>

        <nuxt-link
          class="btn btn-link text-primary mx-auto mt-2"
          to="/sign_up"
        >No Account? Create One</nuxt-link>
      </div>
    </section>
  </span>
</template>

<script>
import axios from "axios";
import VeeValidate from "vee-validate";

// VeeValidate.Validator.extend("test", {
//   getMessage: "Test",
//   validate: value => false
// });

export default {
  components: {
    VeeValidate
  },
  middleware: "not_authenticated",
  data: function() {
    return {
      username: "",
      password: "",
      form_err: "",
      loading: false
    };
  },

  methods: {
    async submit() {
      var valid = await this.$validator.validate();
      if (valid) {
        this.loading = true;
        var login_data = {
          username: this.username,
          password: this.password
        };
        var xhr = await axios.post(
          `${process.env.baseUrl}/api/auth/login`,
          login_data
        );
        this.loading = false;

        var logged_in = xhr.data.logged_in;
        if (logged_in) {
          this.form_err = "";
          window.location.href = `${process.env.baseUrl}/`;
        } else {
          this.form_err = "Username or Password are incorrect";
        }
      }
    }
  }
};
</script>

<style scoped>
.input-wrapper:not(:last-child) {
  margin-bottom: 1rem;
}
</style>