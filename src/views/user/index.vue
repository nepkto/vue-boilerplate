<template>
  <base-layout>
    <template v-slot:header>
      <PageHeader :title="title" :breadcrumbs="breadcrumbs"></PageHeader>
    </template>
    <template v-slot:default>
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between">
            <div class="">
              <select
                @change="onPerPageChange"
                v-model="pagination.per_page"
                class="form-control"
              >
                <template
                  v-for="(value, index) in pagination_values"
                  :key="index"
                >
                  <option :value="value">{{ value }}</option>
                </template>
              </select>
            </div>
            <!-- <div></div> -->
            <div v-if="authorizations.moduleAccess('User', 'create')">
              <button class="btn btn-sm btn-default" @click="create">
                <i class="fa fa-plus"></i> Create
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th
                    v-if="
                      authorizations.moduleAccess('User', 'edit') ||
                      authorizations.moduleAccess('User', 'delete')
                    "
                    scope="col"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users" :key="user.id">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <!-- <router-link class="btn btn-sm btn-primary" :to="{ name:'user.edit',params:user }"
                      >Edit</router-link
                    > -->
                    <button
                      v-if="authorizations.moduleAccess('User', 'edit')"
                      class="btn btn-sm btn-primary"
                      @click="edit(user)"
                    >
                      Edit
                    </button>
                    <button
                      v-if="authorizations.moduleAccess('User', 'delete')"
                      class="btn btn-sm btn-danger"
                      @click="destroy(index, user.id)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer">
          <div class="row">
            <div class="col-md-6 col-12">
              <nexus-pagination
                :pagination="pagination"
                @click="getUsers(pagination.current_page)"
                @changePage="changePage"
                :offset="offset"
              >
              </nexus-pagination>
            </div>
            <div class="col-md-6 col-12">
              <nav aria-label="Pagination">
                <ul class="pagination justify-content-end">
                  <li>
                    Page <strong>{{ pagination.current_page }}</strong> out of
                    <strong>{{ pagination.last_page }}</strong>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script>
import PageHeader from "@/layouts/components/PageHeader";
import User from "@/endpoints/User";
import { useToast } from "vue-toastification";
import Authorizations from "@/helpers/Authorization";
import Pagination from "@/layouts/components/Pagination.vue";

const toast = useToast();
export default {
  components: {
    PageHeader,
    "nexus-pagination": Pagination,
  },
  data: () => ({
    title: "Users",
    breadcrumbs: [
      {
        title: "Dashboard",
        link: "/dashboard",
      },
      {
        title: "User",
        link: "",
      },
    ],
    users: [],
    authorizations: new Authorizations(),
    pagination: {
      total: 0,
      per_page: 50,
      from: 1,
      to: 0,
      current_page: 1,
      last_page: 0,
    },
    offset: 4,
    pagination_values: [50, 100, 500, 1000],
  }),
  mounted() {
    const permissions = this.$store.state.auth.permissions || [];
    const userGroup = this.$store.state.auth.user.group_name || "";
    this.authorizations.set(userGroup, permissions);
    if (!this.authorizations.moduleAccess("User", "read")) {
      toast.error("Access Denied");
      this.$router.push({ name: "dashboard" });
    } else {
      this.getUsers();
    }
  },
  methods: {
    async getUsers() {
      let paginationDetails = {
        page_size: this.pagination.per_page,
        page: this.pagination.current_page,
      };
      try {
        const response = await User.getAll(paginationDetails);
        const { data, meta } = response.data;
        this.users = data;
        this.pagination = meta;
      } catch (ex) {
        toast.error(ex.response.data.message);
      }
    },
    onPerPageChange() {
      this.getUsers();
    },
    edit: function (user) {
      this.$router.push({ name: "user.edit", params: user });
    },

    create() {
      this.$router.push({ name: "user.create" });
    },

    destroy(index, id) {
      let _this = this;
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        })
        .then(function (result) {
          if (result.isConfirmed) {
            User.delete(id)
              .then(function () {
                _this.users.splice(index, 1);
                _this.$swal.fire(
                  "Deleted!",
                  "User has been deleted.",
                  "success"
                );
              })
              .catch(function (err) {
                _this.$swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: err,
                });
              });
          }
        });
    },
    changePage(page) {
      this.pagination.current_page = page;
    },
  },
};
</script>