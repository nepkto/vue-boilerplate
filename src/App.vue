<template>
  <router-view />
  <loader v-if="loading" />
</template>

<script>
import http from "@/helpers/Http.js";
import { mapState } from "vuex";
import Loader from "@/components/Loader";
export default {
    name: "app",
  components: {
    Loader
  },
  computed: {
    ...mapState("loader", ["loading"])
  },
  created: function () {
    http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('auth/logout');
        }
        throw err;
      });
    });

    http.interceptors.request.use(
        config => {
            if (config.showLoader) {
                this.$store.dispatch('loader/pending');
            }
            return config;
        },
        error => {
            if (error.config.showLoader) {
                this.$store.dispatch('loader/done');
            }
            return Promise.reject(error);
        }
    );
    http.interceptors.response.use(
        response => {
            if (response.config.showLoader) {
                this.$store.dispatch('loader/done');
            }

            return response;
        },
        error => {
            let response = error.response;

            if (response.config.showLoader) {
                this.$store.dispatch('loader/done');
            }

            return Promise.reject(error);
        }
    )
  },
};
</script>
