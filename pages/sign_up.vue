<!--<template>
  <span>
    <section class>
      <div
        class="jumbotron mb-4 col-lg-6 col-md-9 col-sm-11 user-form-wrapper text-center pt-4 bg-light mt-3 mx-auto"
      >
        <span class="form-loader d-none">
          <img src="https://ubisafe.org/images/transparent-background-loading-1.gif">
        </span>

        <h1 class="display-3 text-center mb-4">Sign Up</h1>
        <form
          class="col"
          :style="{ opacity: loading ? '0.4' : '1' }"
          @submit.prevent="perform_submit"
        >
          <div
            class="input-wrapper"
            v-for="(field, index) in ['username', 'email', 'password', 'confirm_password']"
            :key="index"
          >
            <input
              :class="[errs[field].length > 0 ? 'is-invalid' : '', 'form-control']"
              :type="/password/.test(field) ? 'password' : 'text'"
              :placeholder="format(field)"
              v-model="form[field]"
              :disabled="loading"
            >
            <div class="invalid-feedback text-left d-block">{{ errs[field] }}</div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            Sign Up
            <i class="fa fa-spinner fa-spin ml-1" v-show="loading"></i>
          </button>

          <div class="text-danger" id="form-invalid-feedback">{{ errs.form }}</div>
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

        <nuxt-link class="btn btn-link text-primary mx-auto mt-2" to="/login">Have Account? Login.</nuxt-link>
      </div>
    </section>
  </span>
</template>-->

<!--<script>
// import { Form } from "~/classes/Form";
// import axios from "axios";

// export default {
//   middleware: "not_authenticated",
//   data: function() {
//     return {
//       form: new Form(),
//       loading: false,
//       errs: {
//         username: "",
//         email: "",
//         password: "",
//         confirm_password: "",
//         form: ""
//       }
//     };
//   },
//   computed: {
//     sign_up_data() {
//       return this.$store.state.sign_up.data;
//     }
//   },
//   mounted() {
//     this.form = new Form(this.sign_up_data);
//   },
//   methods: {
//     format(str) {
//       return str.replace("_", " ").replace(/\w\S*/g, function(txt) {
//         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//       });
//     },

//     async validate() {
//       this.form = new Form(this.sign_up_data);
//       var valid = await this.form.validate({
//         username: { required: true, validate: "/api/auth/username_unique" },
//         email: { required: true, type: "email" },
//         password: { required: true, matches: "confirm_password" },
//         confirm_password: { required: true, matches: "password" }
//       });

//       var errs = {};
//       for (let field_key in valid) {
//         if (valid[field_key] != "") {
//           errs[field_key] = valid[field_key];
//         }
//       }

//       for (let field_key in valid) {
//         this.$set(this.$data.errs, field_key, valid[field_key]);
//       }

//       return Object.values(errs).length == 0;
//     },

//     async perform_submit() {
//       this.$store.commit("sign_up/updateData", this.form);

//       var valid = await this.validate();
//       if (valid === true) {
//         this.sign_up();
//       }
//     },

//     async sign_up() {
//       this.loading = true;

//       body = this.$store.state.sign_up.data;

//       var xhr = await axios.post(
//         `${process.env.baseUrl}/api/auth/sign_up`,
//         body
//       );
//       this.loading = false;

//       var logged_in = xhr.data.logged_in;
//       if (logged_in) {
//         this.errs.form = "";
//         this.$router.push("/");
//       } else {
//         this.errs.form = xhr.data.err;
//       }
//     }
//   }
// };
//
</script>-->

<!--<style scoped>
/* .input-wrapper:not(:last-child) {
   margin-bottom: 1rem;
    }*/
</style>-->

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
              v-validate="'required|username_unique'"
              name="username"
              type="text"
              placeholder="Username"
              v-model="username"
              data-vv-validate-on="change"
              autofocus
            >
            <p class="text-danger text-left mt-1">{{ errors.first('username') }}</p>
          </div>
          <div class="form-group">
            <input
              class="form-control"
              v-validate="'required|email'"
              name="email"
              type="text"
              placeholder="Email"
              v-model="email"
            >
            <p class="text-danger text-left mt-1">{{ errors.first('email') }}</p>
          </div>
          <div class="form-group">
            <input
              class="form-control"
              v-validate="'required'"
              name="password"
              type="password"
              placeholder="Password"
              ref="password"
              v-model="password"
            >
            <p class="text-danger text-left mt-1">{{ errors.first('password') }}</p>
          </div>
          <div class="form-group">
            <input
              class="form-control"
              v-validate="'required|confirmed:password'"
              name="confirm_password"
              type="password"
              placeholder="Confirm password"
              v-model="confirm_password"
            >
            <p class="text-danger text-left mt-1">{{ errors.first('confirm_password') }}</p>
          </div>
          <button class="btn btn-block btn-primary">Sign Up</button>
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

VeeValidate.Validator.extend("username_unique", {
  getMessage: "Username must be unique",
  validate: async value => {
    var xhr = await axios.post(
      `${process.env.baseUrl}/api/auth/username_unique`,
      {
        username: value
      }
    );
    return xhr.data.res;
  }
});

export default {
  components: {
    VeeValidate
  },
  middleware: "not_authenticated",
  data: function() {
    return {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      form_err: "",
      loading: false
    };
  },

  methods: {
    async submit() {
      var valid = await this.$validator.validate();
      if (valid) {
        this.loading = true;
        var sign_up_data = {
          username: this.username,
          email: this.email,
          password: this.password,
          confirm_password: this.confirm_password
        };
        var xhr = await axios.post(
          `${process.env.baseUrl}/api/auth/sign_up`,
          sign_up_data
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

