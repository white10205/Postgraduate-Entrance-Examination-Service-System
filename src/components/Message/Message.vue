<template>
  <div class="message-container">
    <div class="left-bar">
      <div class="header">消息中心</div>
      <div class="nav-list">
        <div
          class="nav-container"
          v-for="(nav, index) in leftNavArr"
          :key="nav.id"
          :class="activeNav === index ? 'active' : ''"
          @click="activeNav = index"
        >
          <el-badge :value="nav.unread" :hidden="nav.unread === 0" class="nav" :offset="[20, 20]">
            <img :src="nav.icon" alt="" />
            {{ nav.name }}
          </el-badge>
        </div>
      </div>
    </div>
    <div class="right-content">
      <component :is="activeComponent" :notification-list="leftNavArr[activeNav].arr" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import liked from "@/assets/liked.svg";
import plus from "@/assets/plus.svg";
import friend from "@/assets/friend.svg";
import comment from "@/assets/comment.svg";
import notice from "@/assets/notice.svg";
import CollectMessage from "@/components/Message/CollectMessage.vue";
import AttentionMessage from "@/components/Message/AttentionMessage.vue";
import CommentMessage from "@/components/Message/CommentMessage.vue";
import FriendsMessage from "@/components/Message/FriendsMessage.vue";
import SystemNotification from "@/components/Message/SystemNotification.vue";
import { NotificationType } from "@/types";
import { useNotification } from "@/hooks/notification";
import { useRoute } from "vue-router";
const components = [CollectMessage, AttentionMessage, FriendsMessage, CommentMessage, SystemNotification];
const { like_collect_list, follow_list, comment_list, message_list } = useNotification();
const systemNotification = ref<NotificationType[]>([]);
const route = useRoute();
const leftNavArr = ref([
  {
    id: 1,
    name: "赞和收藏",
    icon: liked,
    arr: like_collect_list.value,
    unread: computed(() => {
      return like_collect_list.value.filter((item) => !item.isRead).length;
    }),
  },
  {
    id: 2,
    name: "新增关注",
    icon: plus,
    arr: follow_list.value,
    unread: computed(() => {
      return follow_list.value.filter((item) => !item.isRead).length;
    }),
  },
  {
    id: 3,
    name: "我的私信",
    icon: friend,
    arr: message_list.value,
    unread: computed(() => {
      return message_list.value.filter((item) => !item.isRead).length;
    }),
  },
  {
    id: 4,
    name: "评论消息",
    icon: comment,
    arr: comment_list.value,
    unread: computed(() => {
      return comment_list.value.filter((item) => !item.isRead).length;
    }),
  },
  {
    id: 5,
    name: "系统通知",
    icon: notice,
    arr: systemNotification.value,
    unread: computed(() => {
      return systemNotification.value.filter((item) => !item.isRead).length;
    }),
  },
]);
const activeNav = ref(0); // 初始选中第一个导航项
if (route.query.activeNav) {
  activeNav.value = Number(route.query.activeNav) - 1;
}
const activeComponent = computed(() => {
  return components[activeNav.value];
});
</script>

<style lang="scss" scoped>
.message-container {
  width: 72%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  gap: 0.8rem;
  .left-bar {
    border-radius: 1.2rem;
    padding: 1rem 0.5rem;
    width: 15%;
    height: 82vh;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 1));
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    .header {
      font-size: 1.5rem;
    }
    .nav-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
      .nav {
        height: 3rem;
        padding-left: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .nav-container:hover {
        background-color: #dee3e6fe;
        cursor: pointer;
        border-radius: 0.8rem;
      }
      .active {
        color: var(--theme-color);
      }
    }
  }
  .right-content {
    flex: 1;
    height: 86vh;
    overflow-y: auto;
  }
}
</style>
