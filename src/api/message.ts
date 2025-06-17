import AxiosInstance from "@/api/index";

export const getConversation = async () => {
  return AxiosInstance.get("/message/conversation");
};

export const getMessageListByUserId = async (targetUserId: number) => {
  return AxiosInstance.get(`/message/history`, { params: { targetUserId } });
};
