import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "@/assets/css/main.scss";
import "element-plus/dist/index.css";
import ru from "@/locales/ru.json";
import uz from "@/locales/uz.json";
import App from "./App.vue";
import { router } from "./router";
import { vCan } from "@/directives/can";
import { createI18n } from "vue-i18n";
type MessageSchema = typeof ru;

const i18n = createI18n<[MessageSchema], "ru" | "uz">({
	legacy: false,
	locale: "ru",
	fallbackLocale: "uz",
	availableLocales: ["ru", "uz"],
	messages: { ru, uz },
});
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(ElementPlus);

app.directive("can", vCan);

app.mount("#app");
