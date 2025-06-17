<template>
  <div class="home-content">
    <div class="main-content">
      <div class="carousel">
        <Carousel />
      </div>
      <Comment />
    </div>
    <div class="side-bar">
      <KeepAlive include="PostHotList">
        <PostHotList></PostHotList>
      </KeepAlive>
      <KeepAlive>
        <SchoolHotList></SchoolHotList>
      </KeepAlive>
      <RecommendFriends></RecommendFriends>
    </div>
  </div>
</template>

<script setup lang="ts">
import Carousel from "@/components/Home/Carousel.vue";
import PostHotList from "@/components/Common/PostHotList.vue";
import RecommendFriends from "@/components/Common/RecommendFriends.vue";
import Comment from "@/components/Common/Comment.vue";
import SchoolHotList from "../Common/SchoolHotList.vue";
</script>

<style lang="scss" scoped>
.home-content {
  // position: relative;
  margin: 0 auto;
  width: 78vw;
  border-radius: 2rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: auto;
  .main-content {
    overflow: hidden;
    border-radius: 2rem;
    padding: 0 1rem;
    width: 70%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .carousel {
      background-color: #fff;
      border-radius: 1.2rem;
      overflow: hidden;
    }
  }
  .side-bar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    position: relative;
  }
}
</style>
