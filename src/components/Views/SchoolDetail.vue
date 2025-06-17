<template>
  <div class="school-detail-container" v-if="schoolDetail">
    <div class="school-detail-header">
      <div class="header">
        <img
          class="logo"
          :src="'http://adgraduation.oss-cn-beijing.aliyuncs.com/school/' + schoolDetail.school_name + '.png'"
          alt=""
        />
        <div class="info">
          <span class="school-name">{{ schoolDetail.school_name }}</span>
          <span class="type-list">
            <p v-if="schoolDetail.is_985 === 1" class="type">985</p>
            <p v-if="schoolDetail.is_211 === 1" class="type">211</p>
            <p v-if="schoolDetail.is_syl === 1" class="type">双一流</p>
            <p v-if="schoolDetail.is_ordinary === 1" class="type">普通院校</p>
          </span>
          <span class="desc">
            <p>{{ schoolDetail.province }}</p>
            <p>{{ schoolDetail.region }}</p>
            <p>{{ schoolDetail.search_area_name }}</p>
          </span>
        </div>

        <div class="rank-container">
          <div class="recuiret-num">
            <span class="num">
              <span class="big">{{ schoolDetail.major_number }} </span> 专业招生数</span
            >
            <span class="num"
              ><span class="big">{{ schoolDetail.recruit_number }} </span> 招生人数</span
            >
          </div>
          <div class="rank">
            <div class="rank-item" v-for="rank in schoolDetail.rank">
              <span class="rank-name">{{ rank.sorttype }}</span>
              <span class="rank-num">{{ rank.rank }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="school-desc">
        <span class="desc-header">学校介绍</span>
        <div>{{ schoolDetail.intro }}</div>
        <div v-if="schoolDetail.site" class="link-list">
          <div class="link">
            <img :src="global" alt="" />
            <span>学校官网:</span>
            <a :href="schoolDetail.site.school_site">{{ schoolDetail.site.school_site }}</a>
          </div>
          <div v-if="schoolDetail.site" class="link">
            <img :src="user" alt="" />
            <span>招生官网:</span>
            <a :href="schoolDetail.site.zhaoban_site">{{ schoolDetail.site.zhaoban_site }}</a>
          </div>
          <div v-if="schoolDetail.phone" class="link">
            <img :src="phone" alt="" />
            <span>联系电话:</span>
            <a>{{ schoolDetail.phone.zhaoban_phone }}</a>
          </div>
          <div v-if="schoolDetail.email" class="link">
            <img :src="email" alt="" />
            <span>电子邮箱:</span>
            <a>{{ schoolDetail.email.zhaoban_email }}</a>
          </div>
        </div>
        <div class="desc-list">
          <div class="item item-1">
            <div class="text">{{ schoolDetail.school_space }}</div>
            占地面积(亩)
          </div>
          <div class="item item-2">
            <div class="text">{{ schoolDetail.create_date }}年</div>
            建校时间
          </div>
          <div class="item item-3">
            <div class="text">{{ schoolDetail.num_subject }}</div>
            重点学科
          </div>
          <div class="item item-4">
            <div class="text">{{ schoolDetail.num_lab }}</div>
            重点实验室
          </div>
          <div class="item item-5">
            <div class="text">{{ schoolDetail.num_doctor }}/{{ schoolDetail.num_doctor_2nd }}</div>
            博士点(1级/2级)
          </div>
          <div class="item item-6">
            <div class="text">{{ schoolDetail.num_master }}/{{ schoolDetail.num_master_2nd }}</div>
            硕士点(1级/2级)
          </div>
        </div>
      </div>
      <div class="school-score-list">
        <div class="score-header">专业分数线</div>
        <div class="options">
          <div class="option-container">
            <div class="option">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：</div>
            <div
              class="year"
              v-for="year in yearOption"
              :class="selectedYear === year.value ? 'active' : ''"
              @click="changeSelectYear(year.value)"
            >
              {{ year.label }}
            </div>
          </div>
          <div class="option-container">
            <div class="option">学位类别：</div>
            <div
              class="year"
              v-for="degree in degreeTypeOption"
              :class="selectedDegreeType === degree.value ? 'active' : ''"
              @click="changeSelectDegreeType(degree.value)"
            >
              {{ degree.label }}
            </div>
          </div>
        </div>
        <span style="color: red">注意：红色数字表示院复试线与国家线的差值</span>
        <el-table :data="scoreList" style="width: 100%" stripe highlight-current-row>
          <el-table-column prop="name" label="专业名称" width="180" />
          <el-table-column prop="code" label="专业代码" width="100" />
          <el-table-column prop="depart_name" label="招生院系" width="200" />
          <el-table-column label="总分" width="100">
            <template #default="scope">
              <span>{{ scope.row.total }}</span>
              <span v-if="scope.row.diff_total > 0" style="color: red; margin-left: 0.5rem; font-size: 0.8rem"
                ><img :src="upArrow" alt="" />{{ scope.row.diff_total }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="政治" width="100">
            <template #default="scope">
              <span>{{ scope.row.politics }}</span>
              <span v-if="scope.row.diff_politics > 0" style="color: red; margin-left: 0.5rem; font-size: 0.8rem"
                ><img :src="upArrow" alt="" />{{ scope.row.diff_politics }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="英语" width="100">
            <template #default="scope">
              <span>{{ scope.row.english }}</span>
              <span v-if="scope.row.diff_english > 0" style="color: red; margin-left: 0.5rem; font-size: 0.8rem"
                ><img :src="upArrow" alt="" />{{ scope.row.diff_english }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="专业课一" width="100">
            <template #default="scope">
              <span>{{ scope.row.special_one }}</span>
              <span v-if="scope.row.diff_special_one > 0" style="color: red; margin-left: 0.5rem; font-size: 0.8rem"
                ><img :src="upArrow" alt="" />{{ scope.row.diff_special_one }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="专业课二" width="100">
            <template #default="scope">
              <span>{{ scope.row.special_two }}</span>
              <span v-if="scope.row.diff_special_two > 0" style="color: red; margin-left: 0.5rem; font-size: 0.8rem"
                ><img :src="upArrow" alt="" />{{ scope.row.diff_special_two }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="备注" width="150">
            <template #default="scope">
              <span>{{ scope.row.note === "" ? "——" : scope.row.note }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getSchoolDetail, getScoreLine } from "@/api/x-crawl";
import { SchoolDetailType, SchoolScoreType } from "@/types";
import global from "@/assets/global.svg";
import user from "@/assets/user.svg";
import phone from "@/assets/phone.svg";
import email from "@/assets/email.svg";
import upArrow from "@/assets/upArrow.svg";
const route = useRoute();
const schoolDetail = ref<SchoolDetailType>();
const scoreList = ref<SchoolScoreType[]>();
const selectedYear = ref<number>(2025);
const selectedDegreeType = ref<string | number>("");
const yearOption = ref([
  { label: "2025", value: 2025 },
  { label: "2024", value: 2024 },
  { label: "2023", value: 2023 },
  { label: "2022", value: 2022 },
]);
const degreeTypeOption = ref([
  { label: "全部", value: "" },
  { label: "专业型硕士", value: "1" },
  { label: "学术型硕士", value: "2" },
]);
const getScoreList = async () => {
  scoreList.value = (
    await getScoreLine({
      school_id: schoolDetail.value.school_id,
      year: selectedYear.value,
      degree_type: selectedDegreeType.value,
    })
  ).data as unknown as SchoolScoreType[];
};
const changeSelectYear = (year: number) => {
  selectedYear.value = year;
  getScoreList();
};
const changeSelectDegreeType = (degreeType: string | number) => {
  selectedDegreeType.value = degreeType;
  getScoreList();
};

onMounted(async () => {
  const school_id = route.query.school_id as unknown as number;
  schoolDetail.value = (await getSchoolDetail(school_id)).data as unknown as SchoolDetailType;
  await getScoreList();
});
</script>

<style lang="scss" scoped>
.school-detail-container {
  position: relative;
  width: 100%;
  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-image: linear-gradient(to right, #6eaef3, #b9d2ec);
    padding: 1rem 13rem;
    color: white;
    .logo {
      height: 8rem;
      width: 8rem;
      border-radius: 0.5rem;
    }
    .info {
      flex: 1;
      .school-name {
        font-size: 2rem;
        font-weight: 800;
      }
      .type-list {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        height: 40px;
        .type {
          border-radius: 0.2rem;
          border: 1px solid white;
          padding: 0.1rem;
        }
      }
      .desc {
        display: flex;
        gap: 0.5rem;
        height: 40px;
      }
    }
    .rank-container {
      .recuiret-num {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-bottom: 1rem;
        .num {
          font-size: 1.2rem;

          .big {
            font-size: 3rem;
            color: yellow;
          }
        }
      }
      .rank {
        display: flex;
        align-items: center;
        gap: 1rem;
        .rank-item {
          border: 1px solid #fff;
          border-radius: 0.2rem;
          .rank-name {
            color: var(--theme-color);
            margin-right: 0.5rem;
            background-color: #fff;
          }
          .rank-num {
            padding-right: 0.5rem;
          }
        }
      }
    }
  }

  .school-desc {
    width: 76%;
    background-color: #fff;
    border-radius: 0.5rem;
    margin: 0 auto;
    margin-top: 1rem;
    padding: 1rem;
    color: #8b8a8a;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    .desc-header {
      font-size: 1.5rem;
      color: black;
    }
    .link-list {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      .link {
        width: calc((100% - 2rem) / 2);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        a {
          text-decoration: none;
          color: #8b8a8a;
        }
      }
    }
    .desc-list {
      display: flex;
      flex-wrap: nowrap;
      gap: 1rem;
      .item {
        width: calc((100% - 5 * 1rem) / 6);
        border-radius: 0.5rem;
        padding: 1rem;
        box-sizing: border-box;
        .text {
          color: black;
          font-size: 1.2rem;
        }
      }
      .item-1 {
        background-image: linear-gradient(to right, #6eaef3, #b9d2ec);
      }
      .item-2 {
        background-image: linear-gradient(to right, #2ecb23, #b9d2ec);
      }
      .item-3 {
        background-image: linear-gradient(to right, #31f3c9, #9ce8ec);
      }
      .item-4 {
        background-image: linear-gradient(to right, #ee7dd0, #e6abe6);
      }
      .item-5 {
        background-image: linear-gradient(to right, #ef7b98, #dabbca);
      }
      .item-6 {
        background-image: linear-gradient(to right, #ed986e, #e8cdb9);
      }
    }
  }

  .school-score-list {
    width: 76%;
    background-color: #fff;
    border-radius: 0.5rem;
    margin: 0 auto;
    margin-top: 1rem;
    padding: 1rem;
    color: #8b8a8a;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    .score-header {
      font-size: 1.5rem;
      color: black;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .option-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        .year {
          color: black;
        }
        .year:hover {
          cursor: pointer;
          color: var(--theme-color);
        }
        .active {
          color: var(--theme-color);
        }
      }
    }
    .table {
      width: 100%;
      height: 800px;
    }
  }
}
</style>
