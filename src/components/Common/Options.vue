<template>
  <div class="options-container" v-if="provinceOptions">
    <div class="province-option option">
      院校地区
      <span class="all" :class="selectProvince === '' ? 'active' : ''" @click="handleClick(0, '')">全部</span>
      <div class="option-item-container">
        <template v-for="strKey in provinceKeyStr" :key="strKey">
          <div class="option-item">
            <span class="province-type">{{ strKey === "other" ? "其他" : strKey + "区" }}</span>
            <div
              class="item"
              v-for="province in provinceOptions[strKey]"
              :key="province.code"
              :class="selectProvince === province.code ? 'active' : ''"
              @click="handleClick(0, province.code)"
            >
              {{ province.name }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="province-option option">
      院校类型
      <span class="all" :class="selectType === '' ? 'active' : ''" @click="handleClick(1, '')">全部</span>
      <div class="option-item-container">
        <div class="option-item">
          <div
            class="item"
            :class="selectType === type.code ? 'active' : ''"
            v-for="type in typeOptions"
            :key="type.code"
            @click="handleClick(1, type.code)"
          >
            {{ type.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="province-option option">
      院校层次
      <span class="all" :class="selectFeature === '' ? 'active' : ''" @click="handleClick(2, '')">全部</span>
      <div class="option-item-container">
        <div class="option-item">
          <div
            class="item"
            :class="selectFeature === feature.code ? 'active' : ''"
            v-for="feature in featureOptions"
            :key="feature.code"
            @click="handleClick(2, feature.code)"
          >
            {{ feature.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getOptions } from "@/api/x-crawl";
import { computed, onMounted, ref } from "vue";
const props = defineProps<{
  changeParams: (params: {
    feature: string;
    limit: number;
    page: number;
    province_id: string;
    school_name: string;
    type: string;
  }) => void;
}>();
const provinceOptions = ref();
const provinceKeyStr = computed(() => {
  return Object.keys(provinceOptions.value);
});
const typeOptions = ref();
const featureOptions = ref();
const selectProvince = ref("");
const selectType = ref("");
const selectFeature = ref("");
const handleClick = (type: number, param: string) => {
  switch (type) {
    case 0:
      selectProvince.value = param;
      break;
    case 1:
      selectType.value = param;
      break;
    case 2:
      selectFeature.value = param;
      break;
    default:
      break;
  }
  props.changeParams({
    feature: selectFeature.value,
    limit: 21,
    page: 1,
    province_id: selectProvince.value,
    school_name: "",
    type: selectType.value,
  });
};
onMounted(async () => {
  const res = await getOptions();
  provinceOptions.value = res.data.province_id;
  typeOptions.value = res.data.type;
  featureOptions.value = res.data.feature;
});
defineExpose({
  selectProvince,
  selectType,
  selectFeature,
});
</script>

<style lang="scss" scoped>
.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .province-option {
    .option-item-container {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 1rem;

      .option-item {
        display: flex;
        gap: 0.5rem;
        .item {
          display: flex;
          gap: 1rem;
          color: #333;
          cursor: pointer;
        }
        .province-type {
          color: #666;
        }
      }
    }
  }
  .option {
    display: flex;
    gap: 1rem;
    color: #333;
  }
}

.active {
  color: var(--theme-color) !important;
}
.all {
  cursor: pointer;
}
</style>
