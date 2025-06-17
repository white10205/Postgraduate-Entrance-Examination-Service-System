<template>
  <div class="friend-message-container" v-if="friendList">
    <div class="left">
      <div class="header">全部消息</div>
      <el-divider style="width: 100%" />
      <div class="friend-list">
        <el-badge
          :value="friend.unread"
          :hidden="friend.unread === 0"
          class="friend-item"
          :offset="[-25, 15]"
          v-for="(friend, index) in friendList"
          :key="friend.name"
          :class="{ active: activeIndex === index }"
          @click="changeUser(index)"
        >
          <img class="avatar" :src="friend?.avatar" alt="" />
          <div class="info">
            <div class="name">{{ friend?.name }}</div>
          </div>
        </el-badge>
      </div>
      <!-- <Empty description="暂无消息"></Empty> -->
    </div>
    <el-divider direction="vertical" style="height: 100%" />
    <div class="right">
      <div class="friend-name">{{ activeFriend?.name }}</div>
      <el-divider style="width: 100%" />
      <div class="chat-area">
        <div
          class="message"
          v-for="message in friendList[activeIndex]?.messageList"
          :style="{ justifyContent: message.triggerUserId === userfInfo.id ? 'flex-end' : '' }"
        >
          <template v-if="message.triggerUserId === userfInfo.id">
            <span class="content">{{ message.content }}</span>
            <img class="avatar" :src="userfInfo.avatar" alt="" />
          </template>
          <template v-else>
            <img class="avatar" :src="friendList[activeIndex].avatar" alt="" />
            <span class="content">{{ message.content }}</span>
          </template>
        </div>
      </div>
      <hr color="#dcdfe6" width="100%" />
      <el-input
        v-model="inputMessage"
        type="textarea"
        placeholder="输入聊天内容,按Enter换行,点击发送"
        class="input-area"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
      <el-button type="success" class="btn" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { NotificationType } from "@/types";
import { useSocket } from "@/hooks/useSocket";
import { userfInfo } from "@/hooks/userInfo";
import { useNotification } from "@/hooks/notification";
const { markAsRead } = useNotification();
import { getConversation, getMessageListByUserId } from "@/api/message";
import { useRoute } from "vue-router";
const route = useRoute();
const activeIndex = ref(0);
const inputMessage = ref("");
const socket = useSocket();
const currentUser = computed(() => friendList.value[activeIndex.value]);
const activeFriend = computed(() => friendList.value[activeIndex.value]);
const friendList = ref();
const props = defineProps<{
  notificationList: NotificationType[];
}>();

const changeUser = (index: number) => {
  activeIndex.value = index;
  getMessageList();
};

const sendMessage = () => {
  if (!inputMessage.value.trim()) {
    ElMessage({ type: "error", message: "消息不能为空" });
    return;
  }
  if (inputMessage.value) {
    friendList.value[activeIndex.value].messageList.push({
      to: currentUser.value.id,
      triggerUserId: userfInfo.value.id,
      content: inputMessage.value,
    });
    socket.send(
      JSON.stringify({ event: "privateMessage", data: { to: currentUser.value.id, content: inputMessage.value } })
    );
    inputMessage.value = "";
  }
};

const getMessageList = () => {
  const userId = friendList.value[activeIndex.value].id;
  getMessageListByUserId(userId).then((res) => {
    friendList.value[activeIndex.value].messageList = res.data;
  });
};
onMounted(async () => {
  const res = await getConversation();
  friendList.value = res.data.map((item) => {
    return { ...item, messageList: [], unread: 0 };
  });
  if (route.query.activeNav === "3") {
    const tempChatUser = JSON.parse(sessionStorage.getItem("tempChatUser") || "{}");
    const index = friendList.value.findIndex((item) => item.id === tempChatUser.id);
    if (index !== -1) {
      activeIndex.value = index;
    } else {
      friendList.value.push({ ...tempChatUser, messageList: [], unread: 0 });
      activeIndex.value = friendList.value.length - 1;
    }
    sessionStorage.removeItem("tempChatUser");
  }
  getMessageList();
  if (props.notificationList.length !== 0) {
    await markAsRead(props.notificationList.map((item) => item.id));
  }
  /* socket.onopen = () => {
    socket.send(JSON.stringify({ event: "initMessage", data: { userId: userfInfo.value.id } }));
    console.log("WebSocket 连接已建立");
  }; */
  socket.send(JSON.stringify({ event: "initMessage", data: { userId: userfInfo.value.id } }));
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const friend = friendList.value.find((item) => item.id === data.fromUserId);
    friend.messageList.push({ userId: friend.id, triggerUserId: data.fromUserId, content: data.content });
  };
});
</script>

<style lang="scss" scoped>
.friend-message-container {
  display: flex;
  width: 100%;
  background-color: #fff;
  border-radius: 1.2rem;
  height: 100%;

  .left {
    width: 25%;
    .header {
      margin-top: 1rem;
      text-align: center;
      font-size: 1rem;
      color: var(--font-color);
    }
    .friend-list {
      display: flex;
      flex-direction: column;
      height: 87%;
      overflow-y: scroll;
      .friend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.8rem;
        box-sizing: border-box;
        border-radius: 0.8rem;
        .avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
        }
        .info {
          flex: 1;
          .name {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 1rem;
            color: black;
            margin-bottom: 0.3rem;
          }

          .info-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .last-message {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 0.8rem;
              color: var(--font-color);
            }
            .time {
              flex-basis: 10%;
              font-size: 0.8rem;
              color: var(--font-color);
            }
          }
        }
      }
      .active {
        background-color: #f5f5f5;
      }
      .friend-item:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }
    }
  }
  .right {
    position: relative;
    box-sizing: border-box;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    .friend-name {
      margin-top: 1rem;
      text-align: center;
      font-size: 1rem;
    }
    .chat-area {
      height: 70%;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .message {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        border-radius: 0.8rem;
        .avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
        }
        .content {
          background-color: var(--theme-color);
          padding: 0.5rem;
          border-radius: 0.6rem;
        }
      }
    }
    .el-textarea {
      flex: 1;
      width: 100%;
    }
    .btn {
      width: 5rem;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
::v-deep(.el-divider--horizontal) {
  margin: 1rem 0;
}
::v-deep(.el-divider--vertical) {
  margin: 0;
}
::v-deep(.el-textarea__inner) {
  border: none;
  box-shadow: none;
}
</style>
