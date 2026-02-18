import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "@/assets/css/main.scss";
import "element-plus/dist/index.css";

import App from "./App.vue";
import { router } from "./router";
import { vCan } from "@/directives/can";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.directive("can", vCan);

app.mount("#app");
