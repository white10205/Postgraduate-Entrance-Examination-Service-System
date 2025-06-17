<template>
  <div class="comment-list">
    <div class="comment-message-item-container" v-for="item in props.notificationList" :key="item.id">
      <img class="avatar" :src="item.TriggerUser.avatar" alt="" />
      <div class="info">
        <div class="name">{{ item.TriggerUser.name }}</div>
        <div class="time">{{ dayjs(item.createdAt).format("MM-DD HH:mm") }} 评论了我的发布的帖子</div>
        <div class="message">关联帖子标题:"{{ item.TargetPost.title }}"</div>
        <!--         <div class="comment">| 评论:{{ item.TargetComment?.content }}</div> -->
      </div>
      <img class="img" :src="commentBg" alt="" />
    </div>
    <el-empty v-show="props.notificationList.length === 0" description="没有消息" />
  </div>
</template>

<script lang="ts" setup>
import { NotificationType } from "@/types";
import dayjs from "dayjs";
import { useNotification } from "@/hooks/notification";
import commentBg from '@/assets/commentBg.jpg';
import { onMounted } from "vue";
const { markAsRead } = useNotification();
const props = defineProps<{
  notificationList: NotificationType[];
}>();
onMounted(async () => {
  console.log("@@", props.notificationList);
  if (props.notificationList.length !== 0) {
    await markAsRead(props.notificationList.map((item) => item.id));
  }
});
</script>

<style lang="scss" scoped>
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .comment-message-item-container {
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
      .message {
      }
      .comment {
        font-size: 0.8rem;
        color: #a19f9f;
      }
      .btn-list {
        display: flex;
        gap: 2rem;
        align-items: center;
        img {
          transform: scale(0.8);
        }
        .btn {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .btn:hover {
          color: var(--theme-color);
        }
      }
    }
    .img {
      margin-left: 5rem;
      flex-basis: 15%;
      height: 5rem;
      object-fit: cover;
      border-radius: 1rem;
    }
  }
}
</style>
