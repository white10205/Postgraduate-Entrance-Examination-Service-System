import AxiosInstance from "@/api/index";

export interface NewPostList {
  userId: number;
  title: string;
  content: string;
}

/**
 * @description: 发布新帖子
 */
export function publishNewPost(data: NewPostList) {
  return AxiosInstance.post("/post/create", data);
}

/**
 * @description: 获取所有帖子列表
 */
export function getAllPostList(
  page: number = 1,
  pageSize: number = 20,
  userId?: number,
  sortType: number = 0,
  searchText: string = ""
) {
  return AxiosInstance.get("/post/list", { params: { userId, sortType, page, pageSize, searchText } });
}

/**
 * @description: 点赞
 */
export function likePost(postId: number, userId: number) {
  return AxiosInstance.post("/post/like", { postId, userId });
}

/**
 * @description: 收藏
 */
export function collectPost(postId: number) {
  return AxiosInstance.post("/post/collect", { postId });
}

/**
 * @description: 查看
 */
export function visitPost(postId: number, userId: number) {
  return AxiosInstance.post("/post/visit", { postId, userId });
}

/**
 * @description: 发布评论
 */
export function commentPost(content: string, postId: number) {
  return AxiosInstance.post("/post/comment", { content, postId });
}

/**
 * @description: 获取帖子评论
 */
export function getPostComment(postId: number) {
  return AxiosInstance.get("/post/commentList", { params: { postId } });
}

/**
 * @description: 根据用户id查找帖子
 */
export function getPostByUserId(userId: number, type: string) {
  return AxiosInstance.get("/post/postById", { params: { userId, type } });
}

/**
 * @description: 获取热榜帖子
 */
export function getHotPost() {
  return AxiosInstance.get("/post/recommendPostList");
}

/**
 * @description: 删除帖子
 */
export function deletePost(postId: number) {
  return AxiosInstance.post("/post/delete", { postId });
}
