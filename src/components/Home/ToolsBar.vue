<template>
  <div class="tools-container">
    <img class="tool" :src="backTop" alt="" @click="backTopClick"/>

    <el-dropdown placement="left-start">
      <img class="tool" :src="wechat" alt="" />
      <template #dropdown>
        <img :src="WeChatDetail" alt="" width="200" height="140" style="object-fit: cover" />
      </template>
    </el-dropdown>
    <el-dropdown placement="left-start">
      <img class="tool" :src="QQ" alt="" />
      <template #dropdown>
        <img :src="QQDetail" alt="" width="200" height="200" style="object-fit: cover" />
      </template>
    </el-dropdown>

  </div>
</template>

<script setup lang="ts">
import backTop from "@/assets/backTop.svg";
import wechat from "@/assets/wechat.svg";
import QQ from "@/assets/QQ.svg";
import WeChatDetail from "@/assets/wechat-marcode.png";
import QQDetail from "@/assets/qq-marcode.jpg";

const backTopClick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style lang="scss" scoped>
.tools-container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 0.3rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  gap: 2rem;
  position: fixed;
  top: 50%;
  right: 0.5rem;
  .tool {
    cursor: pointer;
  }
}
</style>
