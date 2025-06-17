export type UserInfoType = {
  id: number;
  account: string;
  name: string;
  avatar: string;
  gender: string;
  profession: string;
  graduateDate: string;
  graduateSchool: string;
  introduce: string;
  targetUniversity: string;
  specializedCourse: string;
  thumbs: number;
  fansNum: number;
  followNum: number;
  visitedCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PostType = {
  postId: number;
  userId: number;
  title: string;
  content: string;
  likeCount: number;
  collectCount: number;
  visitedCount: number;
  commentCount: number;
  User: UserInfoType;
  createdAt: string;
  updatedAt: string;
  isLike: boolean;
  isFollow: boolean;
  isCollect: boolean;
};

export type CommentType = {
  commentId: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: string;
  User: UserInfoType;
  likeCount: number;
  isLike: boolean;
  childComments: CommentType[];
};

export type Notification = {
  user_id: number;
  trigger_user_id: number;
  post_id: number;
  type: string;
  content: string;
  is_read: boolean;
};

export interface NotificationType {
  TargetUser: UserInfoType;
  TargetPost: PostType;
  TargetComment: CommentType;
  TriggerUser: UserInfoType;
  createdAt: string;
  id: number;
  isRead: boolean;
  targetId: number;
  targetType: string;
  type: string;
  userId: 1;
}

export interface SchoolItemType {
  major_number: number;
  type_name: string;
  type_school_name: string;
  syl: number;
  school_name: string;
  type_school: number;
  is_985: number;
  is_211: number;
  is_ordinary: number;
  province_name: string;
  province_area: string;
  school_id: number;
  is_zihuaxian: number;
}

export interface SchoolDetailType {
  school_id: number;
  school_name: string;
  province: string;
  top_value: number;
  feature: string[];
  is_211: number;
  is_985: number;
  is_zihuaxian: number;
  is_ordinary: number;
  is_syl: number;
  is_key_school: number;
  type_school: number;
  region: string;
  is_apply: number;
  is_tuimian: number;
  is_apply_plan: boolean;
  is_partner: number;
  school_site: string[];
  school_phone: string[];
  school_email: string[];
  adjust_count: number;
  intro: string;
  content_id: number;
  rank: {
    rank: number;
    sorttype: string;
  }[];
  num_master: number;
  num_master_2nd: number;
  num_doctor: number;
  num_doctor_2nd: number;
  num_subject: number;
  num_lab: number;
  create_date: number;
  belongsTo: string;
  school_space: number;
  school_address: string;
  school_up_num: string;
  major_number: number;
  recruit_number: string;
  search_area_name: string;
  phone: {
    zhaoban_phone: string;
  };
  site: {
    school_site: string;
    zhaoban_site: string;
  };
  email: {
    zhaoban_email: string;
  };
}

export interface SchoolScoreType {
  id: number;
  data_type:string;
  school_id: number;
  school_name: string;
  depart_id: number;
  depart_name: string;
  code: number;
  name: string;
  politics:number;
  politics_str:string;
  english:number;
  english_str:string;
  special_one:number;
  special_one_str:string;
  special_two:number;
  special_two_str:string;
  total:number;
  note:string;
  year:number;
  degree_type:number;
  special_remark:string;
  diff_total:number;
  diff_politics:number;
  diff_english:number;
  diff_special_one:number;
  diff_special_two:number;
}
