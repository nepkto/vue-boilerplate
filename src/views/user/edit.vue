<template>
  <base-layout>
    <template v-slot:header>
      <PageHeader :title="title" :breadcrumbs="breadcrumbs"></PageHeader>
    </template>
    <template v-slot:default>
      <div class="card">
        <div class="card-body">
          <Form
            @submit="updateUser"
            :validation-schema="schema"
            v-slot="{ errors }"
          >
            <div class="form-group row">
              <label for="name" class="col-sm-2 col-form-label">Name</label>
              <div class="col-sm-10">
                <Field
                  type="text"
                  name="name"
                  placeholder="name"
                  class="form-control"
                  v-model="formData.name"
                />
                <div class="invalid-feedback d-block">{{ errors.name }}</div>
              </div>
            </div>
            <div class="form-group row">
              <label for="group" class="col-sm-2 col-form-label"
                >User Group</label
              >
              <div class="col-sm-10">
                <Field name="group" v-model="formData.group_id"  as="select" class="form-control">
                  <template v-for="(group, index) in userGroups" :key="index">
                    <option :value="group.id">{{ group.group_title }}</option>
                  </template>
                </Field>
                <div class="invalid-feedback d-block">{{ errors.group }}</div>
              </div>
            </div>
            <div class="form-group row">
              <label for="group" class="col-sm-2 col-form-label"
                >Type</label
              >
              <div class="col-sm-10">
                <Field name="type" v-model="formData.type" as="select" class="form-control">
                  <template v-for="(type, index) in userTypes" :key="index">
                    <option :value="type.id">{{ type.name }}</option>
                  </template>
                </Field>
                <div class="invalid-feedback d-block">{{ errors.type }}</div>
              </div>
            </div>
            <div class="form-group row">
              <label for="email" class="col-sm-2 col-form-label">Email</label>
              <div class="col-sm-10">
                <Field
                  type="email"
                  name="email"
                  v-model="formData.email"
                  placeholder="email"
                  class="form-control"
                />
                <div class="invalid-feedback d-block">{{ errors.email }}</div>
              </div>
            </div>

            <div class="form-group row">
              <label for="password" class="col-sm-2 col-form-label"
                >Password</label
              >
              <div class="col-sm-10">
                <Field
                  type="text"
                  name="password"
                  v-model="formData.password"
                  placeholder="password"
                  class="form-control"
                />
                <div class="invalid-feedback d-block">
                  {{ errors.password }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="password_confirmation" class="col-sm-2 col-form-label"
                >Password Confirmation</label
              >
              <div class="col-sm-10">
                <Field
                  type="text"
                  name="password_confirmation"
                  v-model="formData.password_confirmation"
                  placeholder="password_confirmation"
                  class="form-control"
                />
                <div class="invalid-feedback d-block">
                  {{ errors.password_confirmation }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label"></label>
              <div class="col-sm-10">
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="disableButton"
                >
                  Update
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script>
import PageHeader from "@/layouts/components/PageHeader";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toastification";
const toast = useToast();

import User from "@/endpoints/User";
import Authorizations from "@/helpers/Authorization";

export default {
  components: {
    PageHeader,
    Form,
    Field,
  },
  data: () => {
    const schema = yup.object({
      email: yup.string().required().email(),
      name: yup.string().required().min(5),
      group: yup.string().required(),
      type: yup.string().required(),
      password: yup.string().min(8),
      password_confirmation: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    });

    return {
      schema,
      vErrMsg: "",
      errorMsg: "",
      disableButton: false,
      title: "Edit user",
      formData: {
        group:{
          id:'',
          name:''
        }
      },
      userGroups: [],
      userTypes: [
        {
          id: 0,
          name: "Head",
        },
        {
          id: 1,
          name: "Province 1",
        },
        {
          id: 2,
          name: "Province 2",
        },
        {
          id: 3,
          name: "Province 3",
        },
        {
          id: 4,
          name: "Province 4",
        },
        {
          id: 5,
          name: "Province 5",
        },
        {
          id: 6,
          name: "Province 6",
        },
        {
          id: 7,
          name: "Province 7",
        },
      ],
      breadcrumbs: [
        {
          title: "Dashboard",
          link: "/dashboard",
        },
        {
          title: "User",
          link: "/users",
        },
        {
          title: "Edit",
          link: "",
        },
      ],
      authorizations: new Authorizations(),
    };
  },
  mounted() {
    this.formData = this.$route.params;
    const permissions = this.$store.state.auth.permissions || [];
    const userGroup = this.$store.state.auth.user.group_name || "";
    this.authorizations.set(userGroup, permissions);
    if (!this.authorizations.moduleAccess("User", "edit")) {
      toast.error("Access Denied");
      this.$router.push({ name: "dashboard" });
    } else {
      this.getUserById()
    }
  },
  methods: {
    async getUserById(){
       try {
        const response = await User.getById(this.$route.params.id);
        const {user, groups} = response.data.data;
        this.formData = user;
        this.userGroups = groups;
      } catch (ex) {
        this.disableButton = false;
      }
    },
    async updateUser(data) {
      this.disableButton = true;
      try {
        const response = await User.update(this.formData.id, data);
        toast.success(response.data.message);
        this.$router.push({ name: "user.index" });
      } catch (ex) {
        this.disableButton = false;
        toast.error(ex.message);
      }
    },
  },
};
</script>