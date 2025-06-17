import { createWebHistory, createRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { userfInfo } from "@/hooks/userInfo";
import { toRef } from "vue";
const user = toRef(userfInfo);
export const navRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/components/Home/HomePage.vue"),
    name: "首页",
    meta: { title: "大学生一站式考研服务平台" },
  },
  {
    path: "/college_libray",
    component: () => import("@/components/Views/CollegeLibrary.vue"),
    name: "院校库",
    meta: { title: "全国院校可查" },
  },
  /* {
    path: "/professional_libray",
    component: () => import("@/components/Views/ProfessionalLibrary.vue"),
    name: "专业库",
  }, */
];

const privateRoutes = [
  {
    path: "/personal_page",
    component: () => import("@/components/Views/PersonalPage.vue"),
    name: "个人主页",
    meta: { title: "个人主页" },
  },
  {
    path: "/school_detail",
    component: () => import("@/components/Views/SchoolDetail.vue"),
    name: "学校详情",
    meta: { title: "学校详情" },
  },
  {
    path: "/message_center",
    component: () => import("@/components/Message/Message.vue"),
    name: "消息中心",
    meta: { title: "消息中心" },
    beforeEnter: (to, from, next) => {
      if (user) {
        next(); //放行
      } else {
        ElMessage.error("请先登录");
        next("/");
      }
    },
  },
];

const routes = [...navRoutes, ...privateRoutes];
export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `研友圈 | ${to.meta.title}`;
  next();
});
