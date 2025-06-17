<template>
  <div class="editorDemo">
    <div>
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor
        style="height: 400px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { onBeforeUnmount, ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { Boot } from "@wangeditor/editor";
import MySelectMenu from "@/hooks/select";
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("");

const selectOption = ref({
  key: Math.random(),
  dataName: "selectData",
  data: [
    { value: "北京", text: "北京" },
    { value: "上海", text: "上海" },
    { value: "深圳", text: "深圳" },
  ],
});
const menu1Conf = {
  key: selectOption.value.key, // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new MySelectMenu(selectOption.value.dataName);
  },
};
const mode = ref("default");
Boot.registerMenu(menu1Conf as any);

//自定义工具栏的菜单配置
const toolbarConfig = {
  toolbarKeys: [
    "fontSize",
    "lineHeight",
    "|",
    "bold",
    "italic",
    "underline",
    "color",
    "uploadImage",
    "|",
    "|",
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    "|",
    "indent",
    "delIndent",
  ],
};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  // 我将下拉框选项的值保存在了 editor实例 身上
  editorRef.value[selectOption.value.dataName] = {
    data: selectOption.value.data,
  };
};

const dataTest = [
  [
    { value: "北京", text: "北京" },
    { value: "上海", text: "上海" },
    { value: "深圳", text: "深圳" },
  ],
  [
    { value: "汽车", text: "汽车" },
    { value: "大汽车", text: "大汽车" },
    { value: "超级大汽车", text: "超级大汽车" },
  ],
  [
    { value: "火车", text: "火车" },
    { value: "上海", text: "上海" },
    { value: "飞机", text: "飞机" },
  ],
];

const updateSelectOptionData = (index) => {
  selectOption.value.data = dataTest[index];
  if (editorRef.value == null) return;
  // 主要就是更新 实例 中存的值
  editorRef.value[selectOption.value.dataName] = {
    data: selectOption.value.data,
  };
};
defineExpose({
  valueHtml,
});
</script>
<style scoped>
.editorDemo {
  width: 100%;
  height: 100%;
}
</style>
