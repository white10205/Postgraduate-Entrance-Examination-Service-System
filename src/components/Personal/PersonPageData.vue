<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="发布的" name="1" class="list">
      <CommentItem
        v-for="post in publishPost"
        :key="post.postId"
        :post="post"
        :index="'1'"
        @likeClick="handleLikeClick"
        @collectClick="handleCollectClick"
        @followClick="handleFollowClick"
        @deletePost="handleDeletePost"
      ></CommentItem>
      <Empty v-if="!publishPost || publishPost.length === 0" description="还没有发布作品哦~"></Empty>
    </el-tab-pane>
    <el-tab-pane label="赞过的" name="2" class="list"
      ><CommentItem
        v-for="post in likePost"
        :key="post.postId"
        :post="post"
        :index="'2'"
        @likeClick="handleLikeClick"
        @collectClick="handleCollectClick"
        @followClick="handleFollowClick"
      ></CommentItem>
      <Empty v-if="!likePost || likePost.length === 0" description="还没有点赞过作品哦~"></Empty>
    </el-tab-pane>
    <el-tab-pane label="收藏的" name="3" class="list">
      <CommentItem
        v-for="post in collectPost"
        :key="post.postId"
        :post="post"
        :index="'3'"
        @likeClick="handleLikeClick"
        @collectClick="handleCollectClick"
        @followClick="handleFollowClick"
      ></CommentItem>
      <Empty v-if="!collectPost || collectPost.length === 0" description="还没有收藏过作品哦~"></Empty>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import type { TabsPaneContext } from "element-plus";
import CommentItem from "@/components/Common/CommentItem.vue";
import { PostType, UserInfoType } from "@/types";
import { getPostByUserId } from "@/api/post";
import Empty from "../Common/Empty.vue";
const props = defineProps<{
  userInfo: UserInfoType;
}>();
const activeName = ref("1");
const publishPost = ref<PostType[]>();
const likePost = ref<PostType[]>();
const collectPost = ref<PostType[]>();
const userInfo = computed(() => {
  return props.userInfo;
});
const arrMap = {
  1: publishPost,
  2: likePost,
  3: collectPost,
};
const handleClick = (tab: TabsPaneContext) => {
  const arr = arrMap[tab.paneName];

  if (!arr.value) {
    getPostByUserId(userInfo.value.id, tab.paneName as string).then((res) => {
      arr.value = res.data;
    });
  }
};
const handleLikeClick = (postId: number, num: number, index: string) => {
  const post = arrMap[index].value?.find((item) => item.postId === postId);
  if (post) {
    post.likeCount += num;
    post.isLike = !post.isLike;
  }
};
const handleCollectClick = (postId: number, num: number, index: string) => {
  const post = arrMap[index].value?.find((item) => item.postId === postId);
  if (post) {
    post.collectCount += num;
    post.isCollect = !post.isCollect;
  }
};

const handleFollowClick = (postId: number, index: string) => {
  const post = arrMap[index].value?.find((item) => item.postId === postId);
  if (post) {
    post.isFollow = !post.isFollow;
  }
};

const handleDeletePost = (postId: number) => {
  publishPost.value = publishPost.value?.filter((item) => item.postId !== postId);
};

watch(
  userInfo,
  () => {
    getPostByUserId(userInfo.value.id, "1").then((res) => {
      publishPost.value = res.data;
    });
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 1.2rem;
}
::v-deep(.el-tabs__item) {
  color: var(--font-color);
  font-size: 1rem;
  font-weight: 600;
}
::v-deep(.is-active) {
  color: var(--theme-color);
}
::v-deep(.el-tab-pane) {
  padding: 0;
}
</style>
