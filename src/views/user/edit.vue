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
            <div class="form-group">
              <label for="name">Name</label>
              <Field
                type="text"
                name="name"
                placeholder="name"
                class="form-control"
                v-model="formData.name"
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
                v-model="formData.email"
              />
              <div class="invalid-feedback d-block">{{ errors.email }}</div>
            </div>

            <div class="form-group">
              <button class="btn btn-sm btn-primary" :disabled="disableButton">
                Update
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
    });

    return {
      schema,
      vErrMsg: "",
      errorMsg: "",
      disableButton: false,
      title: "Edit user",
      formData: {},
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
    };
  },
  mounted() {
    this.formData =this.$route.params;
  },
  methods: {
    async updateUser(data) {
      this.disableButton = true;
      try {
        const response = await User.update(this.formData.id,data);
        if (response.status === 201) {
          this.$router.push({ name: "user.index" });
        }
      } catch (ex) {
        this.disableButton = false;

        console.log(ex.message);
      }
    },
  },
};
</script>