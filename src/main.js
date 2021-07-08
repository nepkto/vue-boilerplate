import { createApp } from "vue";
import App from "./App.vue";
// import axios from "axios";
import router from "./router";
import store from "./store";
import "./assets/css/adminlte.min.css";
window.$ = window.jQuery = require("jquery");
// global.jQuery = ('jquery');
import "bootstrap";
import "./assets/js/adminlte.min.js";

import BaseLayout from "./layouts/wrappers/Main.vue";


const app = createApp(App);

app.component("base-layout", BaseLayout);

app.use(store).use(router)
app.mount("#app");
