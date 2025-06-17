import { UserInfoType } from "@/types/index";
import { bus } from "@/utils/EventBus";
import { ref } from "vue";

export let userfInfo = ref<UserInfoType>();

const getUserInfo = () => {
  if (sessionStorage.getItem("userInfo")) {
    userfInfo.value = JSON.parse(sessionStorage.getItem("userInfo"));
  } else {
    userfInfo.value = JSON.parse(localStorage.getItem("userInfo"));
  }
};

bus.on("updateUserInfo", () => {
  getUserInfo();
});

export const logoutHandler = () => {
  sessionStorage.removeItem("userInfo");
  localStorage.removeItem("userInfo");
  bus.emit("updateUserInfo");
};

getUserInfo();