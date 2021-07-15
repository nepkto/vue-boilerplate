import { createStore } from "vuex";
import { auth } from "./auth";
import { loader } from './loader';

const store = createStore({
    modules: {
        auth,
        loader
    },
});

export default store;