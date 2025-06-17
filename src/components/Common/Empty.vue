<template>
  <el-empty :description="description" :image="Empty" />
</template>

<script setup lang="ts">
import Empty from "@/assets/empty.svg";
defineProps<{
  description: string;
}>();
</script>

<style lang="scss" scoped></style>
