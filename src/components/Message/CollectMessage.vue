<template>
  <div class="collect-list">
    <div class="collect-message-item-container" v-for="notification in props.notificationList">
      <img
        class="avatar"
        :src="notification.TriggerUser.avatar"
        alt=""
        @click="toPersonalPage(notification.TriggerUser.id)"
      />
      <div class="info">
        <div class="name">{{ notification.TriggerUser.name }}</div>
        <div class="time">
          {{ dayjs(notification.createdAt).format("MM-DD HH:mm") }} {{ typeString[notification.type] }}
        </div>
        <div class="title">关联帖子标题:"{{ notification.TargetPost.title }}"</div>
      </div>

      <img class="img" :src="BigZan" alt="" />
    </div>
    <el-empty v-show="props.notificationList.length === 0" description="没有消息" />
  </div>
</template>

<script lang="ts" setup>
import { NotificationType } from "@/types";
import dayjs from "dayjs";
import { useNotification } from "@/hooks/notification";
import BigZan from "@/assets/bigZan.png";
import { onMounted } from "vue";
const { markAsRead } = useNotification();
import { useRouter } from "vue-router";
const router = useRouter();
const typeString = {
  post_like: "赞了你的帖子",
  post_collect: "收藏了你的帖子",
  like_comment: "赞了你的评论",
};
const props = defineProps<{
  notificationList: NotificationType[];
}>();
const toPersonalPage = (id: number) => {
  router.push("/personal_page?id=" + id);
};
onMounted(async () => {
  if (props.notificationList.length !== 0) {
    await markAsRead(props.notificationList.map((item) => item.id));
  }
});
</script>

<style lang="scss" scoped>
.collect-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .collect-message-item-container {
    cursor: pointer;
    display: flex;
    background-color: #fff;
    padding: 1rem;
    border-radius: 1.2rem;
    gap: 0.6rem;
    .avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      flex: 1;
      .name {
        font-size: 1.1rem;
      }
      .time {
        font-size: 0.8rem;
        color: #a19f9f;
      }
      .comment {
        font-size: 0.8rem;
        color: #a19f9f;
      }
    }
    .img {
      margin-left: 5rem;
      flex-basis: 15%;
      height: 5rem;
      object-fit: contain;
      border-radius: 1rem;
    }
  }
}
</style>
