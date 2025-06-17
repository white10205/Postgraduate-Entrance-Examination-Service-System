<template>
  <div class="comment-detail-container">
    <img class="close" src="@/assets/close.svg" alt="" @click="closeMask" />
    <div class="header">
      <img class="avatar" :src="postDetail.User.avatar" alt="" />
      <div class="info-container">
        <div class="name">{{ postDetail.User.name }}</div>
        <div class="info">
          <div class="publish-date">{{ dayjs(post.createdAt).format("MM-DD HH:mm") }}</div>
          <div class="school">{{ postDetail.User.graduateSchool }}</div>
          <div class="profession">{{ postDetail.User.profession }}</div>
          <div class="target">{{ postDetail.User.specializedCourse }}</div>
        </div>
      </div>
      <el-button
        v-show="!isSelf"
        :icon="props.post.isFollow ? Close : Check"
        :type="props.post.isFollow ? 'danger' : 'primary'"
        class="follow-btn"
        @click="followClick"
        >{{ props.post.isFollow ? "取消关注" : "关注" }}</el-button
      >
    </div>
    <el-divider />
    <div class="title">{{ postDetail.title }}</div>
    <div class="content" v-html="postDetail.content"></div>

    <div class="comment-area" id="comment">
      <el-input
        v-model="commentContent"
        style="width: 100%"
        placeholder="畅所欲言吧~"
        maxlength="200"
        show-word-limit
        type="textarea"
        autosize
      />
      <div class="btn-list">
        <el-button class="comment-btn" type="primary" @click="publishComment">评论</el-button>
      </div>
    </div>
    <h4>全部评论({{ postDetail.commentCount }})</h4>

    <div class="comment-list">
      <CommentList ref="commentListRef" :postId="post.postId" :incrementCount="incrementCount"></CommentList>
    </div>

    <div class="post-footer">
      <div class="item">
        <img :src="look" alt="" />
        {{ postDetail.visitedCount }}
      </div>
      <div class="like item" @click.stop="likeClick" :class="post.isLike ? 'active' : ''">
        <img :src="post.isLike ? liked : like" alt="" />
        {{ post.likeCount }}
      </div>
      <div class="comment item">
        <img :src="comment" alt="" />
        {{ post.commentCount }}
      </div>
      <div class="collect item" @click.stop="collectClick" :class="post.isCollect ? 'active' : ''">
        <img :src="post.isCollect ? collected : collect" alt="" />
        {{ post.collectCount }}
      </div>
      <!-- <div class="share item">
        <img :src="share" alt="" />
        分享
      </div>
      <div class="more item">
        <img :src="more" alt="" />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import mask from "@/hooks/useMask";
import { Check, Close, User } from "@element-plus/icons-vue";
import { ref, toRef, computed } from "vue";
import liked from "@/assets/liked.svg";
import like from "@/assets/like.svg";
import look from "@/assets/look.svg";
import comment from "@/assets/comment.svg";
import collect from "@/assets/collect.svg";
import collected from "@/assets/collected.svg";
import CommentList from "@/components/Common/CommentList.vue";
import { PostType } from "@/types";
import dayjs from "dayjs"; // 使用命名导入
import { followUser } from "@/api/user";
import { isLogin } from "@/utils/isLogin";
import { userfInfo } from "@/hooks/userInfo";
import { filterRichText } from "@/utils/filterRichText";
import { commentPost } from "@/api/post";
import { likePost, collectPost, visitPost } from "@/api/post";
const props = defineProps<{ post: PostType; handleLike: Function; handleCollect: Function; handleFollow: Function }>();
const userInfo = toRef(userfInfo);
const postDetail = ref(props.post);
const commentContent = ref(""); // 评论内容
const commentListRef = ref<InstanceType<typeof CommentList>>(); // 评论列表组件实例
const isSelf = computed(() => userInfo.value?.id === postDetail.value.User.id); // 是否是自己
const closeMask = () => {
  mask.hideMask();
};

const likeClick = () => {
  if (!isLogin()) {
    return;
  }
  if (props.handleLike) {
    props.handleLike();
  } else {
    likePost(postDetail.value.postId, postDetail.value.User.id)
      .then(() => {
        postDetail.value.likeCount = postDetail.value.isLike
          ? postDetail.value.likeCount - 1
          : postDetail.value.likeCount + 1; // 更新点赞数
        postDetail.value.isLike = !postDetail.value.isLike; // 更新点赞状态
      })
      .catch(() => {
        ElMessage({
          type: "error",
          message: "点赞失败",
        });
      });
  }
};
const collectClick = () => {
  if (!isLogin()) {
    return;
  }
  if (props.handleCollect) {
    props.handleCollect();
  } else {
    collectPost(postDetail.value.postId)
      .then(() => {
        postDetail.value.collectCount = postDetail.value.isCollect
          ? postDetail.value.collectCount - 1
          : postDetail.value.collectCount + 1; // 更新点赞数
        postDetail.value.isCollect = !postDetail.value.isCollect;
      })
      .catch(() => {
        ElMessage({
          type: "error",
          message: "收藏失败",
        });
      });
  }
};

const followClick = async () => {
  if (!isLogin()) {
    return;
  }
  followUser(props.post.User.id)
    .then(() => {
      ElMessage.success("操作成功");
      props.handleFollow();
    })
    .catch(() => {
      ElMessage.error("操作失败");
    });
};

const publishComment = () => {
  if (!isLogin()) {
    return;
  }
  if (!commentContent.value || commentContent.value.trim() === "") {
    ElMessage.error("评论内容不能为空");
    return;
  }
  commentContent.value = filterRichText(commentContent.value);
  commentPost(commentContent.value, props.post.postId)
    .then(() => {
      ElMessage.success("评论成功");
      const newCommnet = {
        commentId: Math.random() * 1000, // 随机生成评论id
        content: commentContent.value, // 评论内容
        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"), // 评论时间
        postId: postDetail.value.postId, // 评论的帖子id
        User: userInfo.value, // 评论的用户信息
        likeCount: 0, // 点赞数
        isLike: false, // 是否点赞
        userId: userInfo.value?.id, // 评论的用户id
        childComments: [],
      };
      commentListRef.value?.addComment(newCommnet); // 添加评论到评论列表
      commentContent.value = ""; // 清空评论内容
    })
    .catch(() => {
      ElMessage.error("评论失败");
    });
};

const incrementCount = () => {
  postDetail.value.commentCount++; // 评论数加1
};
</script>

<style scoped lang="scss">
.comment-detail-container {
  background-color: #fff;
  border-radius: 1.2rem;
  width: 60%;
  height: 90%;
  padding: 1rem;
  padding-bottom: 0;
  overflow-y: scroll;
  overflow-x: visible;
  display: flex;
  flex-direction: column;
  .close {
    position: absolute;
    top: 1rem;
    right: 19rem;
    cursor: pointer;
    z-index: 1001;
  }
  .header {
    margin-bottom: 1rem;
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
      flex: 1;
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
    margin-top: 1rem;
    width: 100%;
    font-size: 1.2rem;
    font-weight: 800;
    color: black;
    margin-bottom: 1rem;
  }
  .content {
    font-size: 1rem;
    color: #333;
  }

  .comment-area {
    margin-top: 2rem;
    width: 100%;
    background-color: #f4f4f4;
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 0.2rem;
    .btn-list {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
  }
  .comment-list {
    flex: 1;
  }
  .post-footer {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 4rem;
    padding: 1rem 2rem;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    box-shadow: 0 -5px 5px -5px rgba(0, 0, 0, 0.5);
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
  margin: 0;
}
</style>
