<template>
  <el-drawer v-model="showDrawer" :direction="direction" lock-scroll size="40%" label-position="right">
    <template #header>
      <h3 style="color: #1296db">编辑个人信息</h3>
    </template>
    <template #default>
      <el-form ref="formRef" label-position="right" label-width="auto" :model="ruleForm" :rules="rules">
        <el-form-item label="头像" prop="avatar">
          <img
            v-if="ruleForm.avatar"
            :src="ruleForm.avatar"
            alt=""
            style="width: 5rem; height: 5rem; border-radius: 50%; margin-right: 1rem"
          />
          <el-upload
            ref="upload"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="changeFile"
            :show-file-list="false"
          >
            上传
          </el-upload>
        </el-form-item>
        <el-form-item label="你的昵称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="名称不可超过12位" maxlength="12" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="ruleForm.gender">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专业" prop="profession">
          <el-input v-model="ruleForm.profession" placeholder="请输入您的专业名称" />
        </el-form-item>
        <el-form-item label="毕业时间" prop="graduateDate">
          <el-date-picker v-model="ruleForm.graduateDate" type="month" placeholder="选择毕业日期" clearable />
        </el-form-item>
        <el-form-item label="毕业院校" prop="graduateSchool">
          <el-select v-model="ruleForm.graduateSchool" filterable placeholder="请选择" no-match-text="未找到该学校">
            <el-option v-for="item in schoolOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="备考科目" prop="specializedCourse">
          <el-input v-model="ruleForm.specializedCourse" placeholder="请输入您的备考科目" maxlength="12" />
        </el-form-item>
        <el-form-item label="目标院校" prop="targetUniversity">
          <el-select v-model="ruleForm.targetUniversity" filterable placeholder="请选择" no-match-text="未找到该学校">
            <el-option v-for="item in schoolOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="自我描述" prop="introduce">
          <el-input v-model="ruleForm.introduce" type="textarea" maxlength="50" placeholder="50字以内" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button type="primary" @click="submitForm">保存修改</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { genFileId } from "element-plus";
import { uploadFile } from "@/utils/upload";
import type { UploadInstance, UploadProps, UploadRawFile, FormRules, FormInstance } from "element-plus";
import { filterRichText } from "@/utils/filterRichText";
import { SaveRuleForm, saveUserInfo } from "@/api/user";
import type { UserInfoType } from "@/types";
import { bus } from "@/utils/EventBus";
const props = defineProps<{
  userInfo: UserInfoType;
}>();
const selectedFile = ref<UploadRawFile>();
const upload = ref<UploadInstance>();
const formRef = ref<FormInstance>();
const rules = ref<FormRules>({
  avatar: [{ required: true, message: "请选择一张图片作为您的头像", trigger: "blur" }],
  name: [
    { required: true, message: "请输入您的昵称", trigger: "blur" },
    {
      max: 12,
      message: "昵称长度不能超过12位",
      trigger: "blur",
    },
  ],
  gender: [{ required: true, message: "请选择您的性别", trigger: "blur" }],
  profession: [],
  graduateDate: [{ required: true, message: "请选择您的毕业时间", trigger: "blur" }],
  graduateSchool: [{ required: true, message: "请选择您的毕业学校", trigger: "blur" }],
  specializedCourse: [],
  targetUniversity: [],
  introduce: [{ max: 50, message: "自我介绍长度不能超过50位", trigger: "blur" }],
});
const ruleForm = ref<SaveRuleForm>({ ...props.userInfo });

watch(
  props,
  (newVal) => {
    console.log("watch执行", newVal);
    ruleForm.value = { ...newVal.userInfo };
  },
  {
    immediate: true,
  }
);
const showDrawer = ref(false);
const direction = ref("rtl");
const schoolOptions = ref(["湖北文理学院", "湖北文理学院理工学院", "襄阳职业技术学院"]);
const closeDrawer = () => {
  formRef.value.resetFields();
  showDrawer.value = false;
};

// 保存修改
const submitForm = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (selectedFile.value) {
        ruleForm.value.avatar = await uploadImage(selectedFile.value);
        console.log("新的url", ruleForm.value.avatar);
      }
      const formData = {
        avatar: ruleForm.value.avatar,
        name: filterRichText(ruleForm.value.name),
        gender: ruleForm.value.gender,
        profession: filterRichText(ruleForm.value.profession),
        graduateDate: ruleForm.value.graduateDate,
        graduateSchool: ruleForm.value.graduateSchool,
        specializedCourse: filterRichText(ruleForm.value.specializedCourse),
        targetUniversity: ruleForm.value.targetUniversity,
        introduce: filterRichText(ruleForm.value.introduce),
      };
      saveUserInfo(props.userInfo.id, formData)
        .then(() => {
          const newUserInfo = { ...props.userInfo, ...formData };
          console.log("newUserInfo", newUserInfo);
          if (localStorage.getItem("userInfo")) {
            localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
          } else {
            sessionStorage.setItem("userInfo", JSON.stringify(newUserInfo));
          }
          bus.emit("updateUserInfo");
          ElMessage.success("修改成功");
          closeDrawer();
        })
        .catch((err) => {
          ElMessage.error(err.message);
        });
    }
  });
};

// 超出文件
const handleExceed: UploadProps["onExceed"] = async (files: File[]) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

// 上传图片
const uploadImage = async (file: UploadRawFile) => {
  const { url } = await uploadFile(file);
  return url;
};

// 修改图片
const changeFile = async (file: any) => {
  selectedFile.value = file.raw;
  ruleForm.value.avatar = file.url;
};

defineExpose({
  showDrawer,
});
</script>

<style lang="scss" scoped>
::v-deep(.el-upload-list__item) {
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
}
::v-deep(.el-upload) {
  height: 5rem;
  width: 5rem;
}
</style>
