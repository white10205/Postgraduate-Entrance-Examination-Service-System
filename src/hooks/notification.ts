import { getNotificationList } from "@/api/notifacation";
import { readMessage } from "@/api/user";
import { NotificationType } from "@/types";
import { readonly, reactive, computed } from "vue";
import { bus } from "@/utils/EventBus";
// 模块级响应式状态（单例）
const state = reactive({
  notifications: [] as NotificationType[],
  _unreadCount: 0,
});
const init = async () => {
  state.notifications = (await getNotificationList()).data;
  console.log("已读的消息", state.notifications);
};
// 计算属性保证派生状态一致性
const unReadCount = computed(() => state._unreadCount);
const like_collect_list = computed(() =>
  state.notifications.filter(
    (item) => item.type === "post_like" || item.type === "post_collect" || item.type === "like_comment"
  )
);
const follow_list = computed(() => state.notifications.filter((item) => item.type === "user_follow"));
const comment_list = computed(() => state.notifications.filter((item) => item.type === "post_comment"));
const message_list = computed(() => state.notifications.filter((item) => item.type === "message"));
const reset = () => {
  state.notifications = [];
  state._unreadCount = 0;
};
bus.on("logout", reset);
bus.on("connect", init);
export function useNotification() {
  // 添加通知（自动更新未读数）
  const addNotification = (newNotification: NotificationType) => {
    state.notifications.unshift(newNotification);
    if (!newNotification.isRead) state._unreadCount++;
  };

  // 标记已读（批量更新）
  const markAsRead = async (ids: number[]) => {
    await readMessage(ids);
    state.notifications = state.notifications.map((item) => (ids.includes(item.id) ? { ...item, isRead: true } : item));
    state._unreadCount = state.notifications.filter((n) => !n.isRead).length;
  };

  // 初始化通知（服务端数据加载）
  const initNotifications = (item: NotificationType) => {
    console.log(item);

    state.notifications.push(item);
    state._unreadCount++;
  };

  return {
    notifications: readonly(state.notifications), // 返回只读引用
    unReadCount,
    like_collect_list,
    follow_list,
    comment_list,
    addNotification,
    markAsRead,
    initNotifications,
    message_list,
  };
}
