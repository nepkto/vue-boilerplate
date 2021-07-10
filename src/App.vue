<template>
  <router-view />
</template>

<script>
import http from "@/helpers/Http.js";

export default {
  created: function () {
    http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('auth/logout');
        }
        throw err;
      });
    });
  },
};
</script>
