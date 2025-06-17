<template>
  <div class="container" :class="active ? '' : 'panel-active'">
    <img src="@/assets/close.svg" alt="" class="closeBtn" @click="closeLoginMask" />
    <!--  注册 -->
    <div class="container-form container-signup">
      <h2 class="header">注册</h2>
      <el-form
        ref="regiesterFormRef"
        :model="regiesterRuleForm"
        label-width="auto"
        style="width: 100%"
        :rules="regiesterRules"
      >
        <el-form-item label="手机号" prop="account">
          <el-input v-model.number="regiesterRuleForm.account" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="regiesterRuleForm.password" placeholder="输入密码" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input v-model="regiesterRuleForm.repassword" type="password" show-password placeholder="再次确认密码" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="code-container">
            <el-input v-model="regiesterRuleForm.code" placeholder="验证码" />
            <img class="code" :src="codeUrl" alt="" @click="refreshCode" />
          </div>
        </el-form-item>
        <el-form-item>
          <div class="login-btn">
            <el-button class="btn-item" :icon="Pointer" size="large" type="primary" @click="regiesterSubmit"
              >注册</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 登录 -->
    <div class="container-form container-signin">
      <h2 class="header">登录</h2>
      <el-form ref="loginFormRef" :model="loginRuleForm" label-width="auto" style="width: 100%" :rules="loginRules">
        <el-form-item label="账号" prop="account">
          <el-input v-model.number="loginRuleForm.account" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginRuleForm.password" type="password" show-password placeholder="输入密码" />
        </el-form-item>
        <el-form-item label="记住我">
          <el-switch v-model="remeberme" />
        </el-form-item>
        <el-form-item>
          <div class="login-btn">
            <el-button class="btn-item" :icon="User" size="large" type="primary" @click="submit">登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="container-overlay">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <button class="btn" id="signIn" @click="change">已有帐号,直接登录</button>
        </div>
        <div class="overlay-panel overlay-right">
          <button class="btn" id="signUp" @click="change">没有账号,点击注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import mask from "@/hooks/useMask";
import { User, Pointer } from "@element-plus/icons-vue";
import { type FormInstance, type FormRules } from "element-plus";
import { login, register } from "@/api/user";
import type { LoginRuleForm, RegiesterRuleForm } from "@/api/user";
import { bus } from "@/utils/EventBus";
const active = ref(true);
const remeberme = ref(false);
const loginFormRef = ref<FormInstance>();
const regiesterFormRef = ref<FormInstance>();
const codeUrl = ref("http://localhost:3000/user/code");

const loginRuleForm = ref<LoginRuleForm>({
  account: "",
  password: "",
});
const regiesterRuleForm = ref<RegiesterRuleForm>({
  account: "",
  password: "",
  repassword: "",
  code: "",
});
const validatePassPhone = (rule: any, value: any, callback: any) => {
  const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (!reg.test(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
};
const regiesterRules = ref<FormRules>({
  account: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: validatePassPhone, trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 12, message: "密码长度为6-12位", trigger: "blur" },
  ],
  repassword: [
    { required: true, message: "再次确认密码", trigger: "blur" },
    { min: 6, max: 12, message: "密码长度为6-12位", trigger: "blur" },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});
const loginRules = ref<FormRules>({
  account: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: validatePassPhone, trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 12, message: "密码长度为6-12位", trigger: "blur" },
  ],
});

const refreshCode = () => {
  codeUrl.value = `http://localhost:3000/user/code?${new Date().getTime()}`;
};

/**
 * 点击切换登录或注册
 */
const change = () => {
  loginFormRef.value.resetFields();
  regiesterFormRef.value.resetFields();
  active.value = !active.value;
};

/**
 * 关闭登录弹窗
 */
const closeLoginMask = () => {
  mask.hideMask();
};

/**
 * 登录
 */
const submit = async () => {
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        account: loginRuleForm.value.account,
        password: loginRuleForm.value.password,
      };
      await login(data)
        .then((res) => {
          if (remeberme.value) {
            localStorage.setItem("userInfo", JSON.stringify(res.data));
          } else {
            sessionStorage.setItem("userInfo", JSON.stringify(res.data));
          }
          bus.emit("updateUserInfo");
          bus.emit("connect");
          ElMessage.success("登录成功");
          mask.hideMask();
        })
        .catch((e) => {
          ElMessage.error(e.response.data.message);
        });
    }
  });
};

/**
 * 注册
 */
const regiesterSubmit = async () => {
  await regiesterFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        account: regiesterRuleForm.value.account,
        password: regiesterRuleForm.value.password,
        repassword: regiesterRuleForm.value.repassword,
        code: regiesterRuleForm.value.code,
      };
      await register(data)
        .then(() => {
          ElMessage.success("注册成功");
          change();
        })
        .catch((e) => {
          ElMessage.error(e.response.data.message);
          refreshCode();
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  border-radius: 0.7rem;
  overflow: hidden;
  width: 50%;
  height: 50%;
  position: relative;

  .closeBtn {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    z-index: 1000;
    cursor: pointer;
  }
  .container-form {
    height: 100%;
    position: absolute;
    top: 0;
    transition: all 0.6s ease-in-out;
    user-select: none;
  }
  .container-signin {
    left: 0;
    width: 50%;
    z-index: 2;
    padding: 2rem;
    box-sizing: border-box;
    .header {
      text-align: center;
      color: var(--theme-color);
    }
    .login-btn {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn-item {
        width: 60%;
      }
    }
  }
  .container-signup {
    left: 0;
    opacity: 0;
    width: 50%;
    z-index: 1;
    padding: 2rem;
    box-sizing: border-box;
    .header {
      text-align: center;
      color: var(--theme-color);
    }
    .login-btn {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn-item {
        width: 60%;
      }
    }
    .code-container {
      display: flex;
      align-items: center;

      .code {
        width: 100px;
      }
    }
  }

  .container-overlay {
    height: 100%;
    left: 50%;
    overflow: hidden;
    position: absolute;
    top: 0;
    transition: transform 0.6s ease-in-out;
    width: 50%;
    z-index: 100;

    .overlay {
      width: 200%;
      height: 100%;
      position: relative;
      left: -100%;
      background: url("@/assets/login-bg.jpg") no-repeat left top fixed;
      background-size: cover;
      transition: transform 0.6s ease-in-out;
      transform: translateX(0);

      .overlay-panel {
        height: 100%;
        width: 50%;
        position: absolute;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        transform: translateX(0);
        transition: transform 0.6s ease-in-out;
      }
      .overlay-left {
        transform: translateX(0%);
      }
      .overlay-right {
        right: 0;
        transform: translateX(0);
      }
    }
  }
  .btn {
    background-color: var(--theme-color);
    box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
    border-radius: 5px;
    color: #e7e7e7;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    padding: 0.9rem 2rem;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
  }
}
.panel-active .overlay-left {
  transform: translateX(0);
}
.panel-active .container-overlay {
  transform: translateX(-100%);
}
.panel-active .container-overlay .overlay {
  transform: translateX(50%);
}
.panel-active .container-signin {
  transform: translateX(100%);
  opacity: 0;
}
.panel-active .container-signup {
  opacity: 1;
  z-index: 5;
  transform: translateX(100%);
}
</style>
