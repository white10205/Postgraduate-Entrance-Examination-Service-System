<template>
  <div class="container">
    <NavTop />
    <div class="main-content">
      <RouterView></RouterView>
    </div>
    <CopyRight />
    <ToolsBar />
  </div>
</template>

<script setup lang="ts">
// import { onMounted } from "vue";
import NavTop from "@/components/Home/NavgationTop.vue";
import ToolsBar from "./components/Home/ToolsBar.vue";
import CopyRight from "@/components/Common/CopyRight.vue";
</script>

<style scoped>
.container {
  margin: 0;
  padding: 0;
  position: relative;
  background-image: linear-gradient(to bottom, #d6e3ef, #f2f3f5);
  padding-top: 6rem;
  .main-content {
    min-height: 87vh;
  }
}
</style>
