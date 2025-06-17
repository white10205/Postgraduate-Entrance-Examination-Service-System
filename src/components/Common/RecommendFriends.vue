<template>
  <div class="hot-list-container">
    <div class="header"><img src="@/assets/recommend.svg" alt="" />UP主推荐</div>
    <div class="friend-list">
      <div class="friend" v-for="(user, index) in userList" :key="index" @click="toPersonalPage(user.id)">
        <img class="avatar" :src="user.avatar" alt="" />
        <div class="info-container">
          <div class="name">{{ user.name }}</div>
          <div class="info">
            <div>{{ user.graduateSchool }}</div>
            <div>{{ user.profession }}</div>
            <!-- <div>{{ user.specializedCourse }}</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRecommendUpList } from "@/api/user";
import { UserInfoType } from "@/types";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const userList = ref<UserInfoType[]>();
const router = useRouter();

const toPersonalPage = (userId: number) => {
  // 跳转到个人主页
  router.push(`/personal_page?id=${userId}`);
};
onMounted(async () => {
  const res = await getRecommendUpList();
  userList.value = res.data;
});
</script>

<style scoped lang="scss">
.hot-list-container {
  background-color: #fff;
  border-radius: 1.2rem;
  overflow: hidden;
  position: sticky;
  top: 6rem;
  .header {
    height: 3rem;
    line-height: 3rem;
    font-size: 1rem;
    font-weight: 800;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background-image: linear-gradient(to right, rgb(182, 223, 243), rgb(164, 208, 244));
  }
  .friend-list {
    display: flex;
    flex-direction: column;
    .friend {
      display: flex;
      align-items: center;
      padding: 0.8rem 1rem;
      gap: 0.5rem;
      cursor: pointer;
      .avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
      }
      .info-container {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;

        .name {
          font-size: 0.9rem;
          font-weight: 600;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .info {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #9d9a9a;
        }
      }
    }
    .friend:hover {
      background-color: rgb(235, 231, 231);
    }
  }
}
</style>
