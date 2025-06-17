<template>
  <div class="school-item">
    <img
      class="school-icon"
      :src="'http://adgraduation.oss-cn-beijing.aliyuncs.com/school/' + school.school_name + '.png'"
      alt=""
    />
    <div class="school-info">
      <span class="header">
        <span class="school-name"> {{ props.school.school_name }} </span>
      </span>
      <div class="center">
        <span >
          <img :src="location" alt="" />
          {{ props.school.province_name }}
        </span>
        <span class="desc">{{props.school.type_name}} </span>
        <span v-if="props.school.is_985 === 1" class="desc">985 </span>
        <span v-if="props.school.is_211 === 1" class="desc">211</span>
        <span v-if="props.school.is_ordinary === 1" class="desc">普通院校</span>
        <span v-if="props.school.is_zihuaxian === 1" class="desc">自划线</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import location from "@/assets/location.svg";
import { SchoolItemType } from "@/types";

const props = defineProps<{
  school: SchoolItemType;
}>();
</script>

<style lang="scss" scoped>
.school-item {
  padding: 1.2rem;
  border-radius: 0.5rem;
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: calc((100% - 1.4rem) / 3);
  box-sizing: border-box;
  cursor: pointer;
  .school-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
  }
  .school-info {
    .header {
      .school-name {
        font-size: 1.1rem;
      }
      .type {
        color: var(--theme-color);
        font-size: 0.8rem;
        background-color: #b0d5f2;
        padding: 0.1rem;
      }
    }
    .center {
      margin-top: 0.5rem;
      display: flex;
      gap: 0.5rem;
      .desc {
        color: #c5c5c5;
      }
    }
  }
}
</style>
