<template>
  <div class="login-box">
    <div class="login-logo">
      <a href="/"><b>Login</b></a>
    </div>
    <!-- /.login-logo -->
    <div class="card">
      <div class="card-body login-card-body">
        <p class="login-box-msg">Sign in to start your session</p>

        <Form
          @submit="submitLogin"
          :validation-schema="schema"
          v-slot="{ errors }"
        >
          <div class="input-group mb-3">
            <Field
              type="email"
              name="email"
              placeholder="email"
              class="form-control"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-envelope"></span>
              </div>
            </div>
            <div class="invalid-feedback d-block">{{ errors.email }}</div>
          </div>

          <div class="input-group"></div>
          <div class="input-group mb-3">
            <Field
              name="password"
              type="password"
              placeholder="password"
              class="form-control"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
            <div class="invalid-feedback d-block">{{ errors.password }}</div>
          </div>
          <div class="row">
            <div class="col-12">
              <div v-if="errorMsg" class="alert alert-danger" role="alert">
                {{ errorMsg }}
              </div>
            </div>
            <div class="col-8">
              <div class="icheck-primary">
                <input type="checkbox" id="remember" />
                <label for="remember"> Remember Me </label>
              </div>
            </div>
            <!-- /.col -->
            <div class="col-4">
              <button type="submit" class="btn btn-primary btn-block">
                {{ btnStatus }}
              </button>
            </div>
            <!-- /.col -->
          </div>
        </Form>
      </div>
      <!-- /.login-card-body -->
    </div>
  </div>
</template>
<script>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
// import Auth from "@/endpoints/Auth.js";

export default {
  components: {
    Form,
    Field,
    // ErrorMessage,
  },
  data: () => {
    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required(),
    });

    return {
      schema,
      errorMsg: "",
    };
  },

  mounted: () => {
    document.body.classList.add("login-page");
  },
  computed: {
    btnStatus() {
      return this.$store.state.auth.btnStatus;
    },
  },
  methods: {
    async submitLogin(data) {
      try {
        const response = await this.$store.dispatch("auth/login", data);

        const token = response.data.body.access_token;

        localStorage.setItem("token", token);
        // this.$axios.defaults.headers.common['Authorization'] = token
        this.$store.commit("auth/auth_success", token);
        this.$router.replace({ name: "Dashboard" });
      } catch (e) {
        this.$store.commit("auth/auth_error");
        if (e.response.status === 422 || e.response.status === 401) {
          this.errorMsg = "Invalid Credentials";
        } else {
          this.errorMsg = "Woops. Something Went Wrong";
        }
      }
    },
  },
  unmounted: () => {
    document.body.classList.remove("login-page");
  },
};
</script>
