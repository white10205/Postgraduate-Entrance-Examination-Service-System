<template>
  <div class="comment-container" @click="openCommentDetailMask">
    <img
      v-if="isSelf"
      :src="deleteIcon"
      alt=""
      style="cursor: pointer; position: absolute; right: 0; top: 0"
      width="16px"
      height="16px"
      @click.stop="handleDelete"
    />
    <div class="header">
      <img class="avatar" :src="post.User.avatar" alt="" @click.stop="toPersonalPage" />
      <div class="info-container">
        <div class="name">{{ post.User.name }}</div>
        <div class="info">
          <div class="publish-date">{{ dayjs(post.createdAt).format("MM-DD HH:mm") }}</div>
          <div class="school">{{ post.User.graduateSchool }}</div>
          <div class="profession">{{ post.User.profession }}</div>
          <div>{{ post.User.specializedCourse }}</div>
        </div>
      </div>
    </div>
    <div class="title">{{ post.title }}</div>
    <div class="content" v-html="post.content"></div>
    <div class="footer">
      <div class="item">
        <img :src="look" alt="" />
        {{ post.visitedCount }}
      </div>
      <div class="like item" @click.stop="handleLike" :class="post.isLike ? 'active' : ''">
        <img :src="post.isLike ? liked : like" alt="" />
        {{ post.likeCount }}
      </div>
      <div class="comment item">
        <img :src="comment" alt="" />
        {{ post.commentCount }}
      </div>
      <div class="collect item" @click.stop="handleCollect" :class="post.isCollect ? 'active' : ''">
        <img :src="post.isCollect ? collected : collect" alt="" />
        {{ post.collectCount }}
      </div>
      <!-- <div class="share item" @click.stop>
        <img :src="share" alt="" />
        分享
      </div>
      <div class="more item" @click.stop>
        <img :src="more" alt="" />
      </div> -->
    </div>
    <el-divider border-style="dotted" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import mask from "@/hooks/useMask";
import liked from "@/assets/liked.svg";
import like from "@/assets/like.svg";
import comment from "@/assets/comment.svg";
import collect from "@/assets/collect.svg";
import collected from "@/assets/collected.svg";
import look from "@/assets/look.svg";
import deleteIcon from "@/assets/delete.svg";
import { PostType } from "@/types";
import dayjs from "dayjs"; // 使用命名导入
import { likePost, collectPost, visitPost, deletePost } from "@/api/post";
import { isLogin } from "@/utils/isLogin";
import { useRouter } from "vue-router";
import { userfInfo } from "@/hooks/userInfo";
const router = useRouter();
const props = defineProps<{ post: PostType; index?: string }>();
const emits = defineEmits(["likeClick", "collectClick", "followClick", "deletePost"]);
const isSelf = computed(() => userfInfo.value?.id === post.value.User.id); // 是否是自己
const post = computed(() => props.post);
const openCommentDetailMask = () => {
  visitPost(post.value.postId, post.value.User.id);
  mask.showMask("comment-mask", { post: post.value, handleLike, handleCollect, handleFollow });
};
const toPersonalPage = () => {
  router.push(`/personal_page?id=${post.value.User.id}`);
};

/**
 * 点赞
 */
const handleLike = async () => {
  if (isLogin()) {
    likePost(post.value.postId, post.value.User.id)
      .then(() => {
        emits("likeClick", post.value.postId, post.value.isLike ? -1 : 1, props.index);
      })
      .catch(() => {
        ElMessage({
          type: "error",
          message: "点赞失败",
        });
      });
  }
};

/**
 * 收藏
 */
const handleCollect = () => {
  if (isLogin()) {
    collectPost(post.value.postId)
      .then(() => {
        emits("collectClick", post.value.postId, post.value.isCollect ? -1 : 1, props.index);
      })
      .catch(() => {
        ElMessage({
          type: "error",
          message: "收藏失败",
        });
      });
  }
};

/**
 * 关注
 */
const handleFollow = () => {
  emits("followClick", post.value.postId, props.index);
};

/**
 * 删除
 */
const handleDelete = () => {
  ElMessageBox.confirm("确定删除该帖子吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deletePost(post.value.postId);
      emits("deletePost", post.value.postId);
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};
</script>
<style scoped lang="scss">
.comment-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  cursor: pointer;
  position: relative;
  .header {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
    .avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    .info-container {
      .name {
        font-size: 1rem;
        margin-bottom: 0.2rem;
      }
      .info {
        display: flex;
        gap: 0.5rem;
        color: var(--font-color);
        font-size: 0.8rem;
      }
    }
  }
  .title {
    width: 100%;
    font-size: 1.1rem;
    font-weight: 600;
    color: black;
  }
  .content {
    font-size: 1rem;
    color: #333;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    // line-height: 0.5rem;
    width: 100%;
  }
  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 4rem;

    .item {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.2rem;
      user-select: none;
      color: gray;
      fill: gray;
      font-size: 1rem;
      &:active {
        transform: scale(0.95);
      }
      &:hover {
        color: var(--theme-color);
        fill: var(--theme-color);
      }
    }
    .active {
      color: var(--theme-color);
      fill: var(--theme-color);
    }
  }
}

::v-deep(.el-divider--horizontal) {
  margin: -12px;
  margin-top: 12px;
}
</style>
