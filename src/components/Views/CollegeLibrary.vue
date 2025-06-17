<template>
  <div class="college-library-container">
    <div class="header">
      <span class="large-text">院校库</span>
      <span class="small-text">查询全国研招院校信息数据</span>
      <el-input class="search-input" v-model="defaultParams.school_name" placeholder="请输入搜索内容" maxlength="10">
        <template #suffix>
          <el-icon class="el-input__icon search" @click="getList"><search color="#1296db" /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="options-container">
      <Options :changeParams="changeParams"></Options>
    </div>
    <div class="school-list">
      <SchoolItem
        class="school-item"
        v-for="school in schoolList"
        :key="school.school_id"
        :school="school"
        @click="toSchoolDetail(school.school_id)"
      />
    </div>
    <el-pagination layout="prev, pager, next" :total="total" size="large" @change="pageChange" :page-size="21" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import SchoolItem from "@/components/Common/SchoolItem.vue";
import Options from "../Common/Options.vue";
import { getSchoolList } from "@/api/x-crawl";
import { SchoolItemType } from "@/types";
import { useRouter } from "vue-router";
const router = useRouter();
const total = ref(0);
const defaultParams = ref({
  feature: "",
  limit: 21,
  page: 1,
  province_id: "",
  school_name: "",
  type: "",
});

const schoolList = ref<SchoolItemType[]>([]);

const getList = async () => {
  const res = await getSchoolList(defaultParams.value);
  schoolList.value = res.data.data;
  total.value = res.data.total;
};
const changeParams = (params: {
  feature: string;
  limit: number;
  page: number;
  province_id: string;
  school_name: string;
  type: string;
}) => {
  defaultParams.value = params;
  getList();
};

const pageChange = (page: number) => {
  defaultParams.value.page = page;
  getList();
};

const toSchoolDetail = (schoolId: number) => {
  router.push(`/school_detail?school_id=${schoolId}`);
};

onMounted(async () => {
  await getList();
});
</script>

<style lang="scss" scoped>
.college-library-container {
  width: 70%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  .header {
    width: 100%;
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    position: relative;
    .large-text {
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--theme-color);
    }
    .small-text {
      font-size: 1.5rem;
      color: #666;
    }
    .search-input {
      width: 30%;
      position: absolute;
      right: 0;
    }
  }

  .options-container {
    background-color: #fff;
    width: 100%;
    border-radius: 1.2rem;
    padding: 1rem;
    box-sizing: border-box;
  }

  .school-list {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
    width: 100%;
  }
}

::v-deep(.el-pagination) {
  // cursor: pointer;
  display: flex;
  justify-content: flex-end;
}

::v-deep(.el-input__suffix) {
  cursor: pointer;
}
</style>
