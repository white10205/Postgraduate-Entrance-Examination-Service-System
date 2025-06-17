import { createApp } from "vue";
import App from "@/App.vue";
import "@/style.css";
import { router } from "@/router/index";
const app = createApp(App);

window.addEventListener(
  "error",
  (event:any) => {
    if (event.target.tagName === "IMG") {
      event.target.src = "/logo.svg";
      event.preventDefault(); // 阻止默认控制台报错
    }
   
  },
  true
); // 使用捕获模式

app.use(router).mount("#app");
