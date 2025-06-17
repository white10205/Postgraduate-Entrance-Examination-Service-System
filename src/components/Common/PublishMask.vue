<template>
  <div class="publish-container">
    <div class="title">
      <input v-model="title" class="input" type="text" placeholder="好的标题会带来更多的曝光度哦 ~" maxlength="50" />
      <span>{{ title.length }}/50</span>
    </div>
    <el-divider />
    <div class="edit-area">
      <EditorArea ref="editorRef"></EditorArea>
    </div>
    <div class="btn-list">
      <el-button type="primary" @click="publishClick">发布</el-button>
      <el-button @click="close">关闭</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRef } from "vue";
import EditorArea from "@/components/Common/EditorArea.vue";
import publishMask from "@/hooks/useMask";
import { publishNewPost } from "@/api/post";
const title = ref("");
const editorRef = ref<InstanceType<typeof EditorArea>>();
import { userfInfo } from "@/hooks/userInfo";
import { bus } from "@/utils/EventBus";
const userInfo = toRef(userfInfo);
const publishClick = () => {
  if (!title.value) {
    ElMessage.warning("请输入标题");
    return;
  }
  if (editorRef.value?.valueHtml === "<p><br></p>") {
    ElMessage.warning("请输入内容");
    return;
  }
  publishNewPost({ title: title.value, content: editorRef.value?.valueHtml, userId: userInfo.value.id })
    .then(() => {
      ElMessage.success("发布成功");
      bus.emit("updateUserInfo");
      publishMask.hideMask();
    })
    .catch((err) => {
      ElMessage.error("发布失败", err.message);
    });
};
const close = () => {
  publishMask.hideMask();
};
</script>

<style lang="scss" scoped>
.publish-container {
  width: 80%;
  height: 90%;
  background-color: #fff;
  border-radius: 1.2rem;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;

  .title {
    height: 3rem;
    display: flex;
    align-items: center;
    .input {
      flex: 1;
      border: none;
      height: 100%;
      outline: none;
      font-size: 1.2rem;
      color: #333;
    }
    .input:focus {
      outline: none;
    }
    span {
      font-size: 1.2rem;
      color: #999;
      margin-left: 1rem;
    }
  }
  .edit-area {
    flex: 1;
  }
  .btn-list {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
::v-deep(.el-divider--horizontal) {
  margin-top: 0;
}
::v-deep(.ql-container) {
  height: 30rem;
}
</style>
