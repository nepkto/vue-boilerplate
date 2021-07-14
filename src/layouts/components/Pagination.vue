<template>
  <nav aria-label="Pagination" class="float-left">
    <ul class="pagination justify-content-end">
      <li class="page-item" :class="{ disabled: prevBtn }">
        <a
          @click="changePage(pagination.current_page - 1)"
          class="page-link"
          href="#"
          tabindex="-1"
          >Previous</a
        >
      </li>
      <li
        class="page-item"
        v-for="(page, index) in pagesNumber"
        :key="index"
        @click.prevent="changePage(page)"
      >
        <a class="page-link" href="#">{{ page }}</a>
      </li>
      <li v-if="pagination.current_page < pagination.last_page">
        <a
          href="#"
          aria-label="Next"
          v-on:click.prevent="changePage(pagination.current_page + 1)"
        >
        </a>
      </li>
      <li class="page-item" :class="{ disabled: nextBtn }">
        <a
          href="#"
          aria-label="Next"
          class="page-link"
          @click="changePage(pagination.current_page + 1)"
        >
          Next
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true,
    },
    offset: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      isDisabled: true,
    };
  },
  computed: {
    pagesNumber: function () {
      if (!this.pagination.to) {
        return [];
      }
      var from = this.pagination.current_page - this.offset;
      if (from < 1) {
        from = 1;
      }
      var to = from + this.offset * 2;
      if (to >= this.pagination.last_page) {
        to = this.pagination.last_page;
      }
      var pagesArray = [];
      for (from = 1; from <= to; from++) {
        pagesArray.push(from);
      }
      return pagesArray;
    },
    prevBtn: function () {
      if (this.pagination.current_page > 1) {
        return false;
      }
      return true;
    },
    nextBtn: function () {
      if (this.pagination.current_page < this.pagination.last_page) {
        return false;
      }
      return true;
    },
  },
  methods: {
    changePage: function (page) {
      this.$emit("changePage", page);
    },
  },
};
</script>