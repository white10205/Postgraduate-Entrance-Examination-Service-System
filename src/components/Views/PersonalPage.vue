<template>
  <div class="personal-container">
    <div class="personal-content" v-if="currentUserInfo">
      <div class="info">
        <img class="avatar" :src="currentUserInfo.avatar" alt="" />
        <div class="text-container">
          <div class="name">{{ currentUserInfo.name }}</div>
          <div class="desc">
            {{ currentUserInfo.introduce }}
          </div>
          <div class="description">
            <div v-if="currentUserInfo.gender" class="desc-item">
              <img :src="gender" alt="" />
              {{ currentUserInfo.gender }}
            </div>
            <div v-if="currentUserInfo.graduateSchool" class="desc-item">
              <img :src="school" alt="" />
              {{ currentUserInfo.graduateSchool }}
            </div>
            <div v-if="currentUserInfo.profession" class="desc-item">
              <img :src="profession" alt="" />
              {{ currentUserInfo.profession }}
            </div>
          </div>
        </div>
        <div class="data-list">
          <div class="data" v-for="(item, index) in dataArr" :key="item.name">
            <div class="name-container">
              <div class="data-name">{{ item.name }}</div>
              <div class="num">{{ item.num }}</div>
            </div>
            <el-divider v-if="index < dataArr.length - 1" direction="vertical" />
          </div>
        </div>
        <div v-if="currentUserInfo?.id === userfInfo?.id" class="edit-btn" @click="editInfoDrawer.showDrawer = true">
          <img src="@/assets/edit.svg" alt="" />
          <span>编辑个人信息</span>
        </div>
      </div>
      <div class="btn-list" v-if="currentUserInfo?.id !== userfInfo?.id">
        <el-button
          :icon="currentUserInfo.isFollow ? Close : Check"
          :type="currentUserInfo.isFollow ? 'danger' : 'primary'"
          @click="followClick"
          >关注</el-button
        >
        <el-button :icon="User" type="primary" class="follow-btn" @click="gotoChat">私信</el-button>
      </div>
    </div>
    <div class="tw-bar">
      <div class="left-bar">
        <PersonPageData :userInfo="currentUserInfo"></PersonPageData>
      </div>
      <div class="side-bar">
        <PostHotList></PostHotList>
        <RecommendFriends></RecommendFriends>
      </div>
    </div>
  </div>
  <EditInfoDrawer ref="editInfoDrawer" :userInfo="currentUserInfo"></EditInfoDrawer>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, toRef, watch } from "vue";
import PostHotList from "@/components/Common/PostHotList.vue";
import EditInfoDrawer from "@/components/Personal/EditInfoDrawer.vue";
import RecommendFriends from "@/components/Common/RecommendFriends.vue";
import PersonPageData from "@/components/Personal/PersonPageData.vue";
import gender from "@/assets/gender.svg";
import profession from "@/assets/profession.svg";
import school from "@/assets/school.svg";
import { userfInfo } from "@/hooks/userInfo";
import { useRoute, useRouter } from "vue-router";
import { findUserById, followUser } from "@/api/user";
import { User, Close, Check } from "@element-plus/icons-vue";
import { isLogin } from "@/utils/isLogin";
const route = useRoute();
const editInfoDrawer = ref();
const currentUserInfo = ref();
const router = useRouter();
const userId = computed(() => {
  return route.query.id as unknown as number;
});
const dataArr = computed(() => {
  return [
    {
      name: "获赞",
      num: currentUserInfo.value.thumbs,
    },
    {
      name: "粉丝",
      num: currentUserInfo.value.fansNum || 0,
    },
    {
      name: "关注",
      num: currentUserInfo.value.followNum || 0,
    },
    {
      name: "浏览",
      num: currentUserInfo.value.visitedCount,
    },
  ];
});
const followClick = async () => {
  if (!isLogin()) {
    return;
  }
  followUser(currentUserInfo.value.id)
    .then(() => {
      ElMessage.success("操作成功");
      currentUserInfo.value.isFollow = !currentUserInfo.value.isFollow;
    })
    .catch(() => {
      ElMessage.error("操作失败");
    });
};
watch(userfInfo, (newVal) => {
  currentUserInfo.value = newVal;
});
watch(
  userId,
  async () => {
    if (userId.value) {
      const res = await findUserById(userId.value);
      currentUserInfo.value = res.data;
    } else {
      currentUserInfo.value = userfInfo.value;
    }
  },
  { immediate: true }
);

const gotoChat = () => {
  if (!isLogin()) {
    return;
  }
  router.push({
    path: `/message_center`,
    query: {
      activeNav: 3,
    },
  });
  sessionStorage.setItem('tempChatUser', JSON.stringify(currentUserInfo.value));
};
</script>

<style lang="scss" scoped>
.personal-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  .personal-content {
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 1.2rem;
    display: flex;
    gap: 1rem;
    height: auto;
    background-color: #fff;
    padding: 2rem;
    width: 72%;
    position: relative;
    .info {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 2rem;
      .avatar {
        height: 6rem;
        width: 6rem;
        border-radius: 50%;
        border: 0.2rem solid var(--theme-color);
      }
      .text-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        .name {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .desc {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          font-size: 1rem;
          color: #333;
          max-width: 20rem;
        }
        .description {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          .desc-item {
            display: flex;
            align-items: center;
            gap: 0.2rem;
            color: #333;
            background-color: #e8e4e4;
            font-size: 0.8rem;
            border-radius: 1rem;
            padding: 0.2rem 0.5rem;
          }
        }
      }
      .data-list {
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 1rem;
        .data {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          user-select: none;
          .name-container {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            align-items: center;
            .data-name {
              font-size: 1rem;
            }
            .num {
              font-size: 1.2rem;
              font-weight: 600;
            }
          }
        }
      }

      .edit-btn {
        position: absolute;
        bottom: 0.5rem;
        right: 2rem;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        width: auto;
        border-radius: 1.2rem;
        font-size: 0.8rem;
        color: #333;
        border-radius: 1.2rem;
        padding: 0.5rem 1rem;
        border: 0.1rem solid #e8e4e4;
        cursor: pointer;
        user-select: none;
      }
      .edit-btn:active {
        transform: scale(0.95);
      }
    }
    .btn-list {
      position: absolute;
      right: 1rem;
      top: 0.5rem;
    }
  }

  .tw-bar {
    margin: 0 auto;
    width: 72%;
    display: flex;
    gap: 1rem;
    .left-bar {
      background-color: #fff;
      padding: 1rem;
      border-radius: 1.2rem;
      flex: 1;
    }
    .side-bar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex-shrink: 0;
      flex-basis: 20rem;
    }
  }
}

::v-deep(.el-divider--vertical) {
  height: 3rem;
}
</style>
