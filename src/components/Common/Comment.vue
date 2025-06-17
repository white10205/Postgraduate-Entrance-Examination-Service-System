<template>
  <div class="comment-container">
    <div class="comment-header">
      <div class="header-container">
        <div
          class="header-item"
          v-for="(item, index) in headerItemArr"
          :class="activeIndex === index ? 'active' : ''"
          @click="changeSortType(index)"
        >
          {{ item.title }}
        </div>
        <span
          class="slide-bar"
          :style="{
            transform: 'translateX(' + activeIndex * (headerItemGap + 4) + 'rem)',
          }"
        ></span>
      </div>
      <el-input class="search-input" v-model="serachText" placeholder="请输入搜索内容" maxlength="10">
        <template #suffix>
          <el-icon class="el-input__icon search" @click="getAllPost(activeIndex)"><search color="#1296db" /></el-icon>
        </template>
      </el-input>
    </div>
    <el-divider />
    <div v-if="postList.length > 0" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loadMoreDisable">
      <CommentItem
        v-for="post in postList"
        :key="post.postId"
        :post="post"
        @likeClick="handleLikeClick"
        @collectClick="handleCollectClick"
        @followClick="handleFollowClick"
      ></CommentItem>
    </div>
    <Empty v-if="!postList || postList.length === 0" description="没有数据" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, toRef } from "vue";
import CommentItem from "@/components/Common/CommentItem.vue";
import { getAllPostList } from "@/api/post";
import { PostType } from "@/types/index";
import Empty from "@/components/Common/Empty.vue";
import { userfInfo } from "@/hooks/userInfo";
import { isLogin } from "@/utils/isLogin";
import { bus } from "@/utils/EventBus";
import { Search } from "@element-plus/icons-vue";
const headerItemArr = ref([
  { title: "最新发布", active: true, sortType: 0 },
  { title: "浏览最多", active: false, sortType: 1 },
  { title: "点赞最多", active: false, sortType: 2 },
]);
const activeIndex = ref(0);
const headerItemGap = ref(3);
const headerItemGapString = ref(headerItemGap.value + "rem");
const postList = ref<PostType[]>([]);
const userInfo = toRef(userfInfo);
const serachText = ref("");
const page = ref(1);
const pageSize = ref(20);
const loadMoreDisable = ref(false);

const handleLikeClick = (postId: number, num: number) => {
  if (!isLogin()) {
    return;
  }
  const post = postList.value?.find((item) => item.postId === postId);
  if (post) {
    post.likeCount += num;
    post.isLike = !post.isLike;
  }
};

const handleCollectClick = (postId: number, num: number) => {
  if (!isLogin()) {
    return;
  }
  const post = postList.value?.find((item) => item.postId === postId);
  if (post) {
    post.collectCount += num;
    post.isCollect = !post.isCollect;
  }
};

const handleFollowClick = (postId: number) => {
  if (!isLogin()) {
    return;
  }
  const post = postList.value?.find((item) => item.postId === postId);
  if (post) {
    post.isFollow = !post.isFollow;
  }
};



const getAllPost = async (sortType?: number) => {
  const res = await getAllPostList(page.value, pageSize.value, userInfo.value?.id, sortType, serachText.value);
  if (page.value === 1) {
    postList.value = res.data;
  } else {
    postList.value = [...res.data, ...postList.value];
  }
  if (res.data.length < pageSize.value) {
    loadMoreDisable.value = true;
  }
};

const loadMore = () => {
  page.value++;
  getAllPost();
};

const changeSortType = async (index: number) => {
  activeIndex.value = index;
  page.value = 1;
  await getAllPost(index);
};

onMounted(async () => {
  await getAllPost();
  bus.on("updateUserInfo", getAllPost);
});
</script>

<style lang="scss" scoped>
.comment-container {
  position: relative;
  background-color: #fff;
  border-radius: 1.2rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem 1.2rem;
  .comment-header {
    position: relative;
    background-color: #fff;
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    gap: 2rem;
    align-items: center;
    .search-input {
      width: 30%;
      flex: 1;
    }
    .header-container {
      display: flex;
      gap: v-bind(headerItemGapString);
    }
    .header-item {
      font-size: 1rem;
      color: var(--font-color);
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      &:hover {
        color: var(--theme-color);
      }
      &:active {
        transform: scale(0.95);
      }
    }
    .active {
      color: var(--theme-color);
    }
    .slide-bar {
      position: absolute;
      top: 2rem;
      width: 54px;
      height: 0.2rem;
      background-color: var(--theme-color);
      transition: all 0.3s ease;
      user-select: none;
      border-radius: 0.2rem;
    }
  }
}

::v-deep(.el-input__suffix) {
  cursor: pointer;
}
</style>
