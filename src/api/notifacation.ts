import AxiosInstance from "@/api/index";

export const getNotificationList = async () => {
  return AxiosInstance.get("/notifications/message-list");
};
