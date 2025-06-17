<template>
  <div class="attention-list">
    <div class="attention-message-item-container" v-for="item in props.notificationList" :key="item.id">
      <img class="avatar" :src="item.TriggerUser.avatar" alt="" />
      <div class="info">
        <div class="name">{{ item.TriggerUser.name }}关注了您</div>
        <div class="desc">
          <div class="time">{{ dayjs(item.createdAt).format("MM-DD HH:mm") }}</div>
          <div class="desc-item">{{ item.TriggerUser.graduateSchool }}</div>
          <div class="desc-item">{{ item.TriggerUser.gender }}</div>
          <div class="desc-item">{{ item.TriggerUser.profession }}</div>
        </div>
      </div>
      <div class="btn" @click="toPersonalPage(item.TriggerUser.id)">回关</div>
    </div>
    <el-empty v-show="props.notificationList.length === 0" description="没有消息" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { NotificationType } from "@/types";
import dayjs from "dayjs";
import { useNotification } from "@/hooks/notification";
import { useRouter } from "vue-router";
const { markAsRead } = useNotification();
const router = useRouter();
const props = defineProps<{
  notificationList: NotificationType[];
}>();
const toPersonalPage = (id: number) => {
  router.push("/personal_page?id="  + id);
};
onMounted(async () => {
  if (props.notificationList.length !== 0) {
    await markAsRead(props.notificationList.map((item) => item.id));
  }
});
</script>

<style lang="scss" scoped>
.attention-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .attention-message-item-container {
    cursor: pointer;
    display: flex;
    background-color: #fff;
    padding: 1rem;
    border-radius: 1.2rem;
    gap: 0.6rem;
    align-items: center;
    .avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
      .name {
        font-size: 1.1rem;
      }
      .desc {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        color: var(--font-color);
        font-size: 0.8rem;
      }
    }
    .btn {
      // padding:1rem;
      height: 1.5rem;
      line-height: 1.5rem;
      width: 4rem;
      text-align: center;
      background-color: var(--theme-color);
      color: #fff;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.8rem;
    }
  }
}
</style>
