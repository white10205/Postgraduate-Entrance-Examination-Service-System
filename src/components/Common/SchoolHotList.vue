<template>
  <div class="hot-list-container">
    <div class="header"><img src="@/assets/recommend.svg" alt="" />热门院校推荐</div>
    <div class="friend-list">
      <div class="friend" v-for="(school, index) in schoolHotList" :key="school.school_id" @click="toSchoolDetail(school.school_id)">
        <img
          class="avatar"
          :src="'http://adgraduation.oss-cn-beijing.aliyuncs.com/school/' + school.school_name + '.png'"
          alt=""
        />
        <div class="info-container">
          <div class="name">{{ school.school_name }}</div>
          <div class="info">
            <div>{{ school.region }}</div>
            <div>{{ school.province }}</div>
            <div>{{ school.search_area_name }}</div>
            <div v-show="school.is_985 === 1">985</div>
            <div v-show="school.is_211 === 1">211</div>
            <div v-show="school.is_zihuaxian === 1">自划线</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getHotSchoolList } from "@/api/x-crawl";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()
interface SchoolType {
  school_id: number;
  school_name: string;
  syl: number;
  is_211: number;
  is_985: number;
  is_zihuaxian: number;
  search_area_name: string;
  province: string;
  region: string;
  is_ads: number;
}
const schoolHotList = ref<SchoolType[]>([]);

const toSchoolDetail = (schoolId: number) => {
  router.push(`/school_detail?school_id=${schoolId}`);
};
onMounted(async () => {
  const res = await getHotSchoolList();
  schoolHotList.value = res.data;
});
</script>

<style lang="scss" scoped>
.hot-list-container {
  background-color: #fff;
  border-radius: 1.2rem;
  overflow: hidden;
  top: 6rem;
  .header {
    height: 3rem;
    line-height: 3rem;
    font-size: 1rem;
    font-weight: 800;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background-image: linear-gradient(to right, rgb(182, 223, 243), rgb(164, 208, 244));
  }
  .friend-list {
    display: flex;
    flex-direction: column;
    .friend {
      display: flex;
      align-items: center;
      padding: 0.8rem 1rem;
      gap: 0.5rem;
      cursor: pointer;
      .avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
      }
      .info-container {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;

        .name {
          font-size: 0.9rem;
          font-weight: 600;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .info {
          display: flex;
          font-size: 1rem;
          gap: 0.5rem;
          color: #9d9a9a;
        }
      }
    }
    .friend:hover {
      background-color: rgb(235, 231, 231);
    }
  }
}
</style>
