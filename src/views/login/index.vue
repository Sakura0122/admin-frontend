<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { type FormRules, type FormInstance, ElMessage } from 'element-plus'
import SvgIcon from '@/components/svg-icon/index.vue'
import type { LoginDto } from '@/api/user/type'
import useUserStore from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import storage from '@/utils/storage'
import { getCodeApi } from '@/api/user'
import { useResettableReactive } from '@/hooks/useResettableReactive'

const router = useRouter()

const formRef = useTemplateRef<FormInstance>('formRef')
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  captcha: [{ required: true, message: '请输入验证码' }]
}

// 登录表单
const form = ref<LoginDto>({
  username: storage.get('userAccount'),
  password: storage.get('userPassword'),
  codeKey: '',
  captcha: ''
})
const rememberPassword = ref(storage.get('rememberPassword'))

// 获取验证码
const captchaImg = ref('')
const getCodeData = async () => {
  const res = await getCodeApi()
  form.value.codeKey = res.data.codeKey
  captchaImg.value = res.data.codeValue
}
getCodeData()

// 登录
const userStore = useUserStore()
const handleLogin = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.userLogin(form.value)
        if (rememberPassword.value) {
          storage.set('userAccount', form.value.username)
          storage.set('userPassword', form.value.password)
          storage.set('rememberPassword', rememberPassword.value)
        } else {
          storage.remove('userAccount')
          storage.remove('userPassword')
          storage.remove('rememberPassword')
        }
        ElMessage.success('登录成功')
        router.push('/')
      } catch (e) {
        getCodeData()
      }
    }
  })
}
</script>

<template>
  <div class="login">
    <div class="shadow-box"></div>
    <div class="container shadow-xl">
      <div class="backdrop"></div>
      <div class="header">
        <div class="icon-box rounded-full">
          <svg-icon name="logo" width="38px" height="38px" />
        </div>
      </div>
      <div class="h1">欢迎回来</div>
      <div class="h2">请输入你的登录信息</div>
      <el-form ref="formRef" :rules="rules" size="large" label-position="top" :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="captcha">
            <el-input v-model="form.captcha" placeholder="请输入验证码" />
            <img :src="captchaImg" alt="" @click="getCodeData" />
          </div>
        </el-form-item>
      </el-form>
      <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
      <el-button class="sign-in-btn" type="primary" @click="handleLogin">登录</el-button>
      <div class="guide-text">by sakura</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  background-color: #f2f3f3;

  .shadow-box {
    position: absolute;
    width: 400px;
    margin-bottom: 150px;
    margin-top: calc(20vh + 160px);

    &::before {
      content: ' ';
      position: absolute;
      right: 0;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      box-shadow: 10px 0 160px var(--el-color-primary-light-7);
    }

    &::after {
      content: ' ';
      position: absolute;
      left: 0;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      box-shadow: 10px 0 160px var(--el-color-primary-light-7);
    }
  }

  .container {
    --width: 400px;
    margin-top: 20vh;
    width: var(--width);
    background-color: white;
    border-radius: var(--el-border-radius-round);
    padding: 20px;
    border-top: 4px solid white;
    overflow: hidden;
    position: relative;

    > * {
      position: relative;
      z-index: 2;
    }

    .backdrop {
      --size: calc(var(--width) * 0.9);
      position: absolute;
      z-index: 0;
      left: calc(50% - (var(--size) / 2));
      top: calc((var(--size) / 2) - var(--size));
      width: var(--size);
      height: var(--size);
      border-radius: 50%;
      background-image: radial-gradient(farthest-side circle at center, var(--el-color-primary-light-8) 0, white 95%);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 10px;

      .icon-box {
        position: relative;
        z-index: 1;
        background-image: linear-gradient(170deg, var(--el-color-primary) 0%, var(--el-color-primary-light-7) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        box-shadow: inset 0px -1px 5px #ffffff;

        .icon {
          font-size: 27px;
          color: white;
          opacity: 0.9;
        }
      }
    }

    .h1 {
      text-align: center;
      font-size: 20px;
      color: black;
      margin-top: 20px;
    }

    .h2 {
      margin-top: 8px;
      text-align: center;
      color: var(--el-text-color-regular);
      font-size: 14px;
      margin-bottom: 40px;
    }

    .el-form {
      :deep(.el-form-item__label) {
        color: black;
        margin-bottom: 5px;

        &::before {
          content: none;
        }
      }

      :deep(.el-form-item__content) {
        .captcha {
          display: flex;
          align-items: center;
          width: 100%;

          img {
            cursor: pointer;
            width: 100px;
            height: 40px;
            border-radius: 0 4px 4px 0;
            margin-left: 12px;
          }
        }
      }
    }

    .el-checkbox {
      height: auto;
      margin-bottom: 20px;
    }

    .sign-in-btn {
      display: block;
      width: 100%;
      height: 40px;
    }

    .guide-text {
      text-align: center;
      margin-top: 16px;
      padding-bottom: 5px;
      font-size: 14px;
    }
  }
}
</style>
