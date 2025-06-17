<template>
  <el-drawer v-model="showDrawer" direction="rtl" :with-header="false">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="我的关注" name="first">User</el-tab-pane>
      <el-tab-pane label="我的粉丝" name="second">Config</el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script lang="ts" setup>
import { ref, defineExpose } from "vue";
import type { TabsPaneContext } from "element-plus";
const activeName = ref("first");
const showDrawer = ref(false);

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

defineExpose({
  showDrawer,
});
</script>
<style lang="scss" scoped></style>
