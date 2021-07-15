<template>
  <base-layout>
    <template v-slot:header>
      <PageHeader :title="title" :breadcrumbs="breadcrumbs"></PageHeader>
    </template>
    <template v-slot:default>
      <div class="card">
        <div class="card-header">
          <div class="d-flex">
            <div class="mt-2">Page</div>
            <div class="p-1">
              <select
                @change="onPerPageChange"
                v-model="pagination.per_page"
                class="form-control"
              >
                <option
                  v-for="(value, index) in pagination_values"
                  :key="index"
                  :value="value"
                >
                  {{ value }}
                </option>
              </select>
            </div>
            <div class="p-1 ml-auto">
              <div v-if="authorizations.moduleAccess('User', 'create')">
                <button class="btn btn-sm btn-default" @click="create">
                  <i class="fa fa-plus"></i> Create
                </button>
              </div>
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
                  <th scope="col">Group</th>
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
                <tr>
                  <th></th>
                  <th>
                    <input
                      v-model="filter.name"
                      class="form-control"
                      type="text"
                      placeholder="Name"
                    />
                  </th>
                  <th>
                    <input
                      v-model="filter.email"
                      class="form-control"
                      type="text"
                      placeholder="Email"
                    />
                  </th>
                  <th>
                    <select v-model="filter.group" class="form-control">
                      <option value="">-- User Group --</option>

                      <option
                        v-for="(group, index) in userGroups"
                        :value="group.id"
                        :key="index"
                      >
                        {{ group.group_title }}
                      </option>
                    </select>
                  </th>
                  <th>
                    <button class="btn btn-sm btn-primary" @click="filterData">
                      <i class="fa fa-filter"></i> Filter
                    </button>
                  </th>
                </tr>
                <template v-if="users.length > 0">
                  <tr v-for="(user, index) in users" :key="user.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.group_name }}</td>
                    <td>
                      <div class="btn-group" role="group" aria-label="Button">
                        <router-link
                          v-if="editAccess"
                          :to="{ name: 'user.edit', params: { id: user.id } }"
                          class="btn btn-sm btn-primary"
                          ><i class="fa fa-edit"></i
                        ></router-link>
                        <button
                          v-if="deleteAccess"
                          class="btn btn-sm btn-danger"
                          @click="destroy(index, user.id)"
                        >
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <h5 class="text-center">No Record Found</h5>
                </template>
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
import Pagination from "@/components/Pagination.vue";

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
    filter: {
      name: "",
      email: "",
      group: "",
    },
    users: [],
    userGroups: [],
    authorizations: new Authorizations(),
    pagination: {
      total: 0,
      per_page: 25,
      from: 1,
      to: 0,
      current_page: 1,
      last_page: 0,
    },
    offset: 4,
    pagination_values: [5, 10, 25, 50],
    editAccess: false,
    deleteAccess: false,
  }),
  created() {
    const permissions = this.$store.state.auth.permissions || [];
    const userGroup = this.$store.state.auth.user.group_name || "";
    this.authorizations.set(userGroup, permissions);
    if (!this.authorizations.moduleAccess("User", "read")) {
      toast.error("Access Denied");
      this.$router.push({ name: "dashboard" });
    } else {
      if (this.authorizations.moduleAccess("User", "delete")) {
        this.deleteAccess = true;
      } else {
        this.deleteAccess = false;
      }

      if (this.authorizations.moduleAccess("User", "edit")) {
        this.editAccess = true;
      } else {
        this.editAccess = false;
      }
      this.getUsers().then(() => {
        return this.getUserGroups();
      });
    }
  },
  methods: {
    async getUsers() {
      let paginationDetails = {
        page_size: this.pagination.per_page,
        page: this.pagination.current_page,
        filter_name: this.filter.name,
        filter_email: this.filter.email,
        filter_group: this.filter.group,
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
    async getUserGroups() {
      try {
        const response = await User.getUserGroups();
        this.userGroups = response.data.data;
      } catch (ex) {
        toast.error(ex.response.data.message);
      }
    },
    onPerPageChange() {
      this.getUsers();
    },
    filterData() {
      this.getUsers();
    },
    edit: function (id) {
      this.$router.push({ name: "user.edit", params: id });
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
              .then(function (response) {
                _this.users.splice(index, 1);
                _this.$swal.fire(
                  "Deleted!!!",
                  response.data.message,
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