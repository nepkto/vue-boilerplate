<template>
  <base-layout>
    <template v-slot:header>
      <PageHeader :title="title" :breadcrumbs="breadcrumbs"></PageHeader>
    </template>
    <template v-slot:default>
      <div class="card">
        <div class="card-body">
          <Form
            @submit="saveUser"
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
                />
                <div class="invalid-feedback d-block">
                  {{ errors.name || vErrs.get("name") }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="group" class="col-sm-2 col-form-label"
                >User Group</label
              >
              <div class="col-sm-10">
                <Field name="group" as="select" class="form-control">
                  <option value="" disabled>Select User Group</option>
                  <option
                    v-for="(group, index) in userGroups"
                    :key="index"
                    :value="group.id"
                  >
                    {{ group.group_title }}
                  </option>
                </Field>
                <div class="invalid-feedback d-block">
                  {{ errors.group || vErrs.get("group") }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="type" class="col-sm-2 col-form-label">Type</label>
              <div class="col-sm-10">
                <Field name="type" as="select" class="form-control">
                  <option value="" disabled>Select User Type</option>

                  <template v-for="(type, index) in userTypes" :key="index">

                    <option :value="type.id">{{ type.name }}</option>
                  </template>
                </Field>
                <div class="invalid-feedback d-block">
                  {{ errors.type || vErrs.get("type") }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="email" class="col-sm-2 col-form-label">Email</label>
              <div class="col-sm-10">
                <Field
                  type="email"
                  name="email"
                  placeholder="email"
                  class="form-control"
                />

                <div class="invalid-feedback d-block">
                  {{ errors.email || vErrs.get("email") }}
                </div>
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
                  placeholder="password"
                  class="form-control"
                />
                <div class="invalid-feedback d-block">
                  {{ errors.password || vErrs.get("password") }}
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
                  placeholder="Password Confirmation"
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
                  Save
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
import User from "@/endpoints/User";
import Authorizations from "@/helpers/Authorization";
import Errors from "@/helpers/ValidationError";

import { useToast } from "vue-toastification";
const toast = useToast();

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
      password: yup.string().required().min(8),
      password_confirmation: yup
        .string()
        .required()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    });

    return {
      schema,
      disableButton: false,
      title: "Create new user",
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
          title: "Create",
          link: "",
        },
      ],
      form: {
       
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
      authorizations: new Authorizations(),
      vErrs: new Errors(),
    };
  },
  mounted() {
    const permissions = this.$store.state.auth.permissions || [];
    const userGroup = this.$store.state.auth.user.group_name || "";
    this.authorizations.set(userGroup, permissions);
    if (!this.authorizations.moduleAccess("User", "create")) {
      toast.error("Access Denied");
      this.$router.push({ name: "dashboard" });
    } else {
      this.listUserGroups();
    }
  },
  methods: {
    async saveUser(data) {
      this.disableButton = true;
      try {
        await User.store(data);
        toast.success("User Saved Successfully");
        this.$router.push({ name: "user.index" });
      } catch (ex) {
        this.disableButton = false;
        if (ex.response.status == 422) {
          this.vErrs.record(ex.response.data.errors);
          toast.error(ex.response.statusText);
        } else {
          toast.error(ex.response.statusText);
        }
      }
    },
    async listUserGroups() {
      try {
        const response = await User.getUserGroups();
        this.userGroups = response.data.data;
      } catch (ex) {
        toast.error(ex.response);
      }
    },
  },
};
</script>