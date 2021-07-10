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
              <input type="search" class="form-control" placeholder="Search" />
            </div>
            <!-- <div></div> -->
            <div class="">
              <button class="btn btn-sm btn-default" @click="create">
                <i class="fa fa-plus"></i> Create
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Action</th>
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
                    <button class="btn btn-sm btn-primary" @click="edit(user)">
                      Edit
                    </button>
                    <button
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
          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-end">
              <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1">Previous</a>
              </li>
              <li class="page-item"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script>
import PageHeader from "@/layouts/components/PageHeader";
import User from "@/endpoints/User";
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  components: {
    PageHeader,
  },
  created() {
    this.getUsers();
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
  }),

  methods: {
    async getUsers() {
      try {
        const response = await User.getAll();
        this.users = response.data;
      } catch (ex) {
        toast.error(ex.message);
      }
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
  },
};
</script>