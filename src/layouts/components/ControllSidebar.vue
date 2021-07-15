<template>
    <aside class="control-sidebar control-sidebar-dark">
    <!-- Control sidebar content goes here -->
    <div class="p-3">
        <a @click="logout" href="#" class="btn btn-sm btn-primary"><i class="fas fa-sign-out-alt"></i> Logout</a>
    </div>
  </aside>
</template>

<script>
export default {
    methods: {
      async logout() {
        await this.$store.dispatch("auth/logout")
        this.$router.replace({ name: "Login" });
        
      }
    }
}
</script>