<template>
  <div class="NavContainer">
    <div class="logoContainer" @click="backToIndex">
      <img src="/logo.svg" alt="" class="logo" />
      <img src="@/assets/font.svg" alt="" class="logo" />
    </div>
    <div class="btnList">
      <RouterLink v-for="nav in routesArr" :key="nav.path" :to="nav.path" class="nav">{{ nav.name }}</RouterLink>
    </div>
    <div class="right-side">
      <div class="login-container">
        <div v-if="!userInfo" class="loginBtn" @click="login">登录</div>
        <el-dropdown v-else @command="handleCommand">
          <img class="avatar" :src="userInfo.avatar" alt="" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="1">个人主页</el-dropdown-item>
              <el-dropdown-item command="2">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="btn" @click="openPublishMask">
        <img src="@/assets/publish.svg" alt="" />
        发布
      </div>
      <el-badge :value="unReadCount" :hidden="unReadCount === 0" class="btn" @click="gotoMessageCenter">
        <img src="@/assets/message.svg" alt="" />
        消息
      </el-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navRoutes } from "@/router";
import { computed, onMounted, ref, toRef } from "vue";
import loginMask from "@/hooks/useMask";
import mask from "@/hooks/useMask";
import { useRouter, useRoute } from "vue-router";
import { logout } from "@/api/user";
import { userfInfo, logoutHandler } from "@/hooks/userInfo";
import { sseClient } from "@/utils/Sse";
import { bus } from "@/utils/EventBus";
import { isLogin } from "@/utils/isLogin";
import { useNotification } from "@/hooks/notification";
import { useSocket } from "@/hooks/useSocket";
const socket = useSocket();
const { unReadCount } = useNotification();
const word = ref();
const route = useRoute();
const router = useRouter();
//搜索框内容
const searchValue = ref();
//导航列表
const routesArr = ref(navRoutes);
const userInfo = toRef(userfInfo);

/**
 * 跳转个人主页
 */
const gotoPersonalPage = () => {
  router.push("/personal_page");
};

/**
 * 退出登录
 */
const logoutClick = async () => {
  await logout();
  logoutHandler();
  bus.emit("logut");
  router.push("/");
  ElMessage.success("退出登录成功");
  socket?.disconnect();
};

const handlerMap = {
  1: gotoPersonalPage,
  2: logoutClick,
};
/**
 * 回到首页
 */
const backToIndex = () => {
  router.push("/");
};

/**
 * 点击登录
 */
const login = () => {
  loginMask.showMask("login-mask");
};

/**
 * 头像下拉框点击
 */
const handleCommand = (command: string) => {
  handlerMap[command]();
};

/**
 * 跳转消息中心
 */
const gotoMessageCenter = () => {
  if (!isLogin()) {
    return;
  }
  router.push("/message_center");
};

/**
 * 打开发布遮罩
 */
const openPublishMask = () => {
  if (!userInfo.value) {
    ElMessage.error("请先登录");
    login();
    return;
  }
  mask.showMask("publish-mask");
};

onMounted(async () => {
  sseClient.connect();
});
</script>

<style lang="scss" scoped>
.NavContainer {
  position: fixed;
  top: 0;
  z-index: 999;
  box-sizing: border-box;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 0 13rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  .logoContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    user-select: none;
    cursor: pointer;
    .logo {
      transform: scale(0.85);
    }
  }

  .btnList {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: 2rem;
    .nav {
      box-sizing: border-box;
      display: block;
      height: 3rem;
      text-decoration: none;
      color: var(--font-color);
      line-height: 3rem;
      font-size: 1.1rem;
      user-select: none;
      flex-shrink: 0;
      outline: none;
    }
    .nav:active {
      transform: scale(0.95);
    }
    .nav:hover {
      border-bottom: 0.1rem solid var(--theme-color);
    }
    .router-link-active {
      color: var(--theme-color);
    }
  }
  @keyframes typing {
    from {
      width: 0;
    }
  }

  @keyframes cursor-blink {
    50% {
      border-color: transparent;
    }
  }
  .right-side {
    display: flex;
    flex-direction: row;
    align-items: center;
    .search {
      cursor: pointer;
    }
    .login-container {
      flex-shrink: 0;
      margin-left: 1rem;
      .avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        object-fit: cover;
        outline: none;
        cursor: pointer;
      }
      .loginBtn {
        width: 2.5rem;
        height: 2.5rem;
        flex-shrink: 0;
        line-height: 2.5rem;
        text-align: center;
        background-color: #e8e8ed;
        border-radius: 50%;
        cursor: pointer;
        user-select: none;
        color: var(--font-color);
      }
    }

    .btn {
      width: 4rem;
      color: var(--font-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.8rem;
      cursor: pointer;
      user-select: none;
      img {
        transform: scale(0.7);
        margin-bottom: -0.2rem;
      }
    }
    .btn:active {
      transform: scale(0.95);
    }
    .btn:hover {
      color: var(--theme-color);
    }
  }
}
</style>
