<template>
  <base-layout>
    <template v-slot:header>
      <PageHeader :title="title" :breadcrumbs="breadcrumbs"></PageHeader>
    </template>
    <template v-slot:default>
      <div class="card">
        <div class="card-body">
          <div v-if="vErrMsg" class="alert alert-danger" role="alert">
            <li v-for="(msg,index) in showValidationError" :key=index>
            {{ msg[0] }}
            </li>
          </div>
          <Form
            @submit="saveUser"
            :validation-schema="schema"
            v-slot="{ errors }"
          >
            <div class="form-group">
              <label for="name">Name</label>
              <Field
                type="text"
                name="name"
                placeholder="name"
                class="form-control"
              />
              <div class="invalid-feedback d-block">{{ errors.name }}</div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="email"
                class="form-control"
              />
              <div class="invalid-feedback d-block">{{ errors.email }}</div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <Field
                type="text"
                name="password"
                placeholder="password"
                class="form-control"
              />
              <div class="invalid-feedback d-block">{{ errors.password }}</div>
            </div>
            <div class="form-group">
              <button class="btn btn-sm btn-primary" :disabled="disableButton">
                Save
              </button>
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
      name: yup.string().required(),
      password: yup.string().required(),
    });

    return {
      schema,
      vErrMsg:"",
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
        email: "",
        name: "",
        password: "",
      },
    };
  },
  computed: {
    showValidationError() {
      const errMsg = Object.values(this.vErrMsg)
      return errMsg;
    }
  },
  methods: {
    async saveUser(data) {
      this.disableButton = true;
      try {
        const response = await User.store(data);
        console.log(response);
        toast.success("User Saved Successfully");
        this.$router.push({ name: "user.index" });
      } catch (ex) {
        this.disableButton = false;
        if (ex.response.status == 422) {
          this.vErrMsg = ex.response.data.errors;

          toast.error(ex.response.statusText);
        } else {
          toast.error(ex.response.statusText);
        }
      }
    },
  },
};
</script>