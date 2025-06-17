<template>
  <el-carousel>
    <el-carousel-item v-for="(item, index) in arr" :key="index">
      <img :src="item.path" alt="" class="img" @click="handleClick(item.to)" />
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
import { ref } from "vue";
const arr = ref([
  {
    path: "https://t2.chei.com.cn/axvert/img/6549389003.jpg",
    to: "https://mp.weixin.qq.com/s/A3F0gYbHSvq9enbyRMWxDg",
  },
  {
    path: "https://t2.chei.com.cn/axvert/img/6635065467.jpg",
    to: "https://bsapply.ecust.edu.cn/user/login/ecust",
  },
  {
    path: "https://t2.chei.com.cn/axvert/img/6608190277.jpg",
    to: "https://zytx.org.cn/yjsj/",
  },
  {
    path: "https://t1.chei.com.cn/axvert/img/5530346138.jpg",
    to: "https://yz.chsi.com.cn/yzzt/kybk",
  },
]);

const handleClick = (url: string) => {
  window.open(url, "_blank");
};
</script>

<style lang="scss" scoped>
.img {
  width: 100%;
  object-fit: cover;
  cursor: pointer;
}
</style>
