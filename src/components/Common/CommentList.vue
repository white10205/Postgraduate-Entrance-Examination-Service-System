<template>
  <template v-if="commentList?.length !== 0">
    <template v-for="(comment, index) in commentList" :key="comment.commentId">
      <div class="comment-message-item-container">
        <img class="avatar" :src="comment.User.avatar" alt="" />
        <div class="info">
          <div class="name">{{ comment.User.name }}</div>
          <div class="info">
            <div class="publish-date">{{ dayjs(comment.createdAt).format("MM-DD HH:mm") }}</div>
            <div class="school">{{ comment.User.graduateSchool }}</div>
            <div class="profession">{{ comment.User.profession }}</div>
          </div>
          <div class="comment" v-html="comment.content"></div>
          <div class="btn-list">
            <div class="btn" @click="handleCommentClick(index)">
              <img :src="comment.isLike ? liked : like" alt="" />
              {{ comment.likeCount }}
            </div>
            <!-- <div class="btn" @click="replyComment(index)">
              <img src="@/assets/comment.svg" alt="" />
              {{ replyIndex === index ? "取消回复" : "回复" }}
            </div> -->
          </div>
          <div class="child-comments-area"></div>
          <!-- <div class="reply" v-show="replyIndex === index">
            <el-input
              v-model="reply"
              style="width: 100%"
              placeholder="回复她/他啥呢~"
              maxlength="200"
              show-word-limit
              type="textarea"
              autosize
            />
            <el-button type="success">回复</el-button>
          </div> -->
        </div>
      </div>
      <el-divider />
    </template>
  </template>
  <Empty description="暂无评论" v-else />
</template>
<script lang="ts" setup>
import like from "@/assets/like.svg";
import liked from "@/assets/liked.svg";
import { onMounted, ref } from "vue";
import Empty from "@/components/Common/Empty.vue";
import { CommentType } from "@/types";
import dayjs from "dayjs";
import { getPostComment } from "@/api/post";
import { likeComment } from "@/api/user";
const props = defineProps<{
  postId: number;
  incrementCount: () => void;
}>();
const replyIndex = ref(-1);
const commentList = ref<CommentType[]>();
const reply = ref(""); // 回复内容
/* const replyComment = (index: number) => {
  replyIndex.value = replyIndex.value === index ? -1 : index;
}; */
const addComment = (newCommnet: CommentType) => {
  if (newCommnet.postId === props.postId) {
    commentList.value?.unshift(newCommnet);
    props.incrementCount(); // 调用父组件的方法增加评论数
  }
};
const handleCommentClick = (index: number) => {
  const comment = commentList.value[index];

  likeComment(comment.commentId, comment.User.id)
    .then(() => {
      comment.likeCount += comment.isLike ? -1 : 1;
      comment.isLike = !comment.isLike;
    })
    .catch(() => {
      ElMessage.error("操作失败");
    });
};
onMounted(async () => {
  commentList.value = (await getPostComment(props.postId)).data;
});
defineExpose({
  addComment,
});
</script>
<style lang="scss" scoped>
.comment-message-item-container {
  display: flex;
  background-color: #fff;
  padding: 1rem;
  border-radius: 1.2rem;
  gap: 0.6rem;
  .avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    flex: 1;
    .name {
      font-size: 1rem;
    }
    .info {
      display: flex;
      gap: 0.5rem;
      color: var(--font-color);
      flex-direction: row;
      font-size: 0.8rem;
    }
    .comment {
      font-size: 1rem;
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
    .reply {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background-color: #cfcfcf;
      border-radius: 0.5rem;
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
</style>
