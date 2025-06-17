import AxiosInstance, { instanceWithoutBase } from "@/api/index";

// 获取选项
export function getOptions() {
  return AxiosInstance.get("/x-crawl/options");
}

type QuerySchoolListParams = {
  feature?: string;
  limit: number;
  page: number;
  province_id: string;
  school_name: string;
  type: string;
};

// 获取学校列表
export function getSchoolList(params: QuerySchoolListParams) {
  return AxiosInstance.post("/x-crawl/schoolList", params);
}

// 获取热门院校
export function getHotSchoolList() {
  return AxiosInstance.get("/x-crawl/schoolHotList");
}

// 获取院校详情
export function getSchoolDetail(schoolId: number) {
  return AxiosInstance.get("/x-crawl/schoolDetail", { params: { schoolId } });
}

// 获取分数线
export function getScoreLine(data: { school_id: number; year: number; degree_type: number | string }) {
  return AxiosInstance.post("/x-crawl/schoolScore", data);
}

// 获取励志语
export function getMotivationalWords() {
  return instanceWithoutBase.get("https://api.xygeng.cn/one");
}
