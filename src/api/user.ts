import AxiosInstance from "@/api/index";

export interface LoginRuleForm {
  account: string;
  password: string;
}
export interface RegiesterRuleForm {
  account: string;
  password: string;
  repassword: string;
  code: string;
}

export interface SaveRuleForm {
  avatar: string;
  name: string;
  gender: string;
  profession: string;
  graduateDate: string;
  graduateSchool: string;
  //考试科目
  specializedCourse: string;
  //目标院校
  targetUniversity: string;
  introduce: string;
}

/**
 * @description: 注册
 */

export function register(data: RegiesterRuleForm) {
  return AxiosInstance.post("/user/regiester", data);
}

/**
 * @description: 登录
 */
export function login(data: LoginRuleForm) {
  return AxiosInstance.post("/user/login", data);
}

/**
 * @description: 保存个人信息
 */
export function saveUserInfo(id: number, userInfo: SaveRuleForm) {
  return AxiosInstance.post("/user/saveUserInfo", { id, userInfo });
}

/**
 * @description: 退出登录
 */
export function logout() {
  return AxiosInstance.post("/user/logout");
}

/**
 * @description: 关注用户
 */
export function followUser(userId: number) {
  return AxiosInstance.post("/user/follow", { userId });
}

/**
 * @description: 点赞评论
 */
export function likeComment(commentId: number, userId: number) {
  return AxiosInstance.post("/user/likeComment", { commentId, userId });
}

/**
 * @description: 根据id查用户
 */
export function findUserById(userId: number) {
  return AxiosInstance.get("/user/findUserById", { params: { userId } });
}

/**
 * @description: 获取推荐UP主列表
 */
export function getRecommendUpList() {
  return AxiosInstance.get("/user/recommendedUsers");
}

/**
 * @description: 读消息
 */
export function readMessage(ids: number[]) {
  return AxiosInstance.post("/notifications/read", ids);
}
