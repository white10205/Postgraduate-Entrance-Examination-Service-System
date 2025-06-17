import LoginMask from "@/components/Login/LoginMask.vue";
import PublishMask from "@/components/Common/PublishMask.vue";
import PostDetail from "@/components/Common/PostDetail.vue";
const componentMap = {
  'login-mask': LoginMask,
  'publish-mask': PublishMask,
  'comment-mask': PostDetail,
}
import { createApp, App } from "vue";
let app: App | null;
let container: HTMLDivElement
const showMask = (component: string, options?: any) => {
  const conponentName = componentMap[component]
  //禁止页面滚动
  document.body.style.overflow = 'hidden';
  if (app) {
    return
  }
  container = document.createElement('div')
  container.className = `my-toast`;
  container.style = 'position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;background-color: rgba(0, 0, 0, 0.4);display:flex;justify-content: center;align-items: center;z-index:1000;'
  document.body.appendChild(container)
  app = createApp(conponentName, options)
  return app.mount(container)
}

const hideMask = () => {
  if (app) {
    app.unmount()
    document.body.removeChild(container)
    app = null;
  }
  document.body.style.overflow = 'auto';
}

export default {
  hideMask,
  showMask
}