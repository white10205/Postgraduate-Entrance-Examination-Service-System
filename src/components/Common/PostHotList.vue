<template>
  <div class="hot-list-container">
    <div class="header"><img src="@/assets/hot1.svg" alt="" />全站热榜</div>
    <div class="post-list">
      <div class="post" v-for="(post, index) in postList" :key="post.postId" @click="openPostDetail(post)">
        <div class="rank" :class="index < 3 ? 'rank-color' : ''">
          {{ index + 1 }}
        </div>
        <div class="content">{{ post.title }}</div>
        <div class="num">{{ post.visitedCount }}</div>
        <img src="@/assets/hot.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getHotPost } from "@/api/post";
import { PostType } from "@/types";
import { visitPost } from "@/api/post";
import { onMounted, ref } from "vue";
import mask from "@/hooks/useMask";
const postList = ref<PostType[]>();

const openPostDetail = (post: PostType) => {
  visitPost(post.postId, post.User.id);
  mask.showMask("comment-mask", { post });
};

onMounted(async () => {
  const res = await getHotPost();
  postList.value = res.data;
});
</script>

<style scoped>
.hot-list-container {
  background-color: #fff;
  border-radius: 1.2rem;
  overflow: hidden;
  .header {
    height: 3rem;
    line-height: 3rem;
    font-size: 1rem;
    font-weight: 800;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background-image: linear-gradient(to right, rgb(236, 202, 230), rgb(239, 238, 239));
  }
  .post-list {
    display: flex;
    flex-direction: column;
    .post {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      height: 3rem;
      padding: 0 1rem;
      cursor: pointer;
      border-radius: 0.5rem;
      .rank {
        font-weight: 600;
        color: #9d9a9a;
        font-size: 0.8rem;
      }
      .content {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        font-size: 0.9rem;
        flex: 1;
      }
      .num {
        font-size: 0.7rem;
        color: #9d9a9a;
      }
      .rank-color {
        color: rgb(235, 94, 94);
        font-size: 1.2rem;
      }
    }
    .post:hover {
      background-color: rgb(235, 231, 231);
    }
  }
}
</style>
