<template>
  <div class="login-page">
    <!-- Background orbs -->
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>
    <div class="bg-orb bg-orb-3"></div>

    <div class="login-container">
      <div class="login-card">
        <!-- Left: Decorative Panel -->
        <div class="brand-panel">
          <div class="brand-content">
            <h1 class="brand-title">指尖造物</h1>
            <p class="brand-subtitle">Finger Art Platform</p>
            <p class="brand-desc">「 每一件手作，都是独一无二的温度 」</p>
            <div class="brand-icons">
              <span class="bi bi-1">🩷</span>
              <span class="bi bi-2">🌸</span>
              <span class="bi bi-3">🫧</span>
              <span class="bi bi-4">🌷</span>
              <span class="bi bi-5">💫</span>
            </div>
          </div>
          <div class="brand-footer">
            <span>Finger Art Platform</span>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="form-panel">
          <div class="tabs">
            <button :class="{ active: isLogin }" @click="isLogin = true">
              登录
              <span class="tab-line" v-if="isLogin"></span>
            </button>
            <button :class="{ active: !isLogin }" @click="isLogin = false">
              注册
              <span class="tab-line" v-if="!isLogin"></span>
            </button>
          </div>

          <h2 class="form-title">{{ isLogin ? '欢迎回来 ✨' : '加入我们 🎀' }}</h2>
          <p class="form-sub">{{ isLogin ? '登录继续您的创作之旅' : '注册成为造物者' }}</p>

          <a-form :model="formState" layout="vertical" @finish="handleSubmit" class="main-form">
            <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名' }]">
              <a-input v-model:value="formState.username" placeholder="用户名">
                <template #prefix><user-outlined class="input-icon" /></template>
              </a-input>
            </a-form-item>

            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
              <a-input-password v-model:value="formState.password" placeholder="密码">
                <template #prefix><lock-outlined class="input-icon" /></template>
              </a-input-password>
            </a-form-item>

            <div v-if="isLogin" class="form-options">
              <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
              <a class="forgot-link">忘记密码？</a>
            </div>

            <a-form-item class="submit-wrap">
              <a-button type="primary" html-type="submit" block :loading="loading" class="btn-primary">
                {{ isLogin ? '登 录' : '注 册' }}
              </a-button>
            </a-form-item>
          </a-form>

          <div class="form-footer">
            <p v-if="isLogin">
              还没有账号？
              <a @click="isLogin = false">去注册 →</a>
            </p>
            <p v-else>
              已有账号？
              <a @click="isLogin = true">去登录 →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { login, register } from '../api/user';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();
const isLogin = ref(true);
const loading = ref(false);

const formState = reactive({
  username: '',
  password: '',
  remember: true,
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (isLogin.value) {
      const userInfo = await login({
        username: formState.username,
        password: formState.password
      });
      
      userStore.setLogin(userInfo);
      message.success(`欢迎回来，${userInfo.username}！`);
      if (userInfo.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      await register({
        username: formState.username,
        password: formState.password
      });
      message.success('注册成功！请登录。');
      isLogin.value = true;
    }
  } catch (err: any) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce4ec 30%, #f3e5f5 70%, #ede7f6 100%);
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* === Background orbs === */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  z-index: 0;
}
.bg-orb-1 {
  width: 320px; height: 320px;
  background: #f8bbd0;
  top: -80px; right: 15%;
  animation: orb-drift 10s ease-in-out infinite alternate;
}
.bg-orb-2 {
  width: 260px; height: 260px;
  background: #e1bee7;
  bottom: 8%; left: 8%;
  animation: orb-drift 12s ease-in-out infinite alternate-reverse;
}
.bg-orb-3 {
  width: 200px; height: 200px;
  background: #ffccd5;
  top: 40%; left: 50%;
  animation: orb-drift 8s ease-in-out infinite alternate;
}

@keyframes orb-drift {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -25px) scale(1.1); }
}

/* === Card === */
.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 800px;
  padding: 16px;
}

.login-card {
  display: flex;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(235, 47, 150, 0.10), 0 2px 10px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  min-height: 520px;
}

/* === Left Decorative Panel === */
.brand-panel {
  flex: 0 0 280px;
  background: linear-gradient(160deg, #f48fb1 0%, #f06292 20%, #ec407a 40%, #d81b60 60%, #ab47bc 80%, #7b1fa2 100%);
  padding: 44px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.brand-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 4px 0;
  letter-spacing: 5px;
}

.brand-subtitle {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.brand-desc {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255,255,255,0.75);
  margin-bottom: 28px;
  letter-spacing: 0.5px;
}

/* Cute icons */
.brand-icons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 4px;
}

.bi {
  font-size: 24px;
  display: inline-block;
  animation: bi-bounce 2.8s ease-in-out infinite;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.08));
}

.bi-1 { animation-delay: 0s; margin-top: -4px; }
.bi-2 { animation-delay: 0.5s; margin-top: 4px; }
.bi-3 { animation-delay: 1s; margin-top: -2px; }
.bi-4 { animation-delay: 1.5s; margin-top: 3px; }
.bi-5 { animation-delay: 2s; margin-top: -3px; }

@keyframes bi-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  40% { transform: translateY(-6px) rotate(4deg); }
  60% { transform: translateY(-3px) rotate(-2deg); }
}

.brand-footer {
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 12px;
  color: rgba(255,255,255,0.35);
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* === Right Form === */
.form-panel {
  flex: 1;
  padding: 44px 44px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tabs {
  display: flex;
  gap: 32px;
  margin-bottom: 28px;
}

.tabs button {
  background: none;
  border: none;
  padding: 0 0 8px 0;
  font-size: 15px;
  font-weight: 500;
  color: #bfbfbf;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tabs button.active {
  color: #d81b60;
  font-weight: 600;
}

.tab-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2.5px;
  background: #d81b60;
  border-radius: 2px;
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 6px 0;
}

.form-sub {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 32px 0;
}

/* === Form === */
.main-form :deep(.ant-form-item) {
  margin-bottom: 20px;
}

.main-form :deep(.ant-form-item-label) {
  display: none;
}

.main-form :deep(.ant-input-affix-wrapper) {
  height: 48px;
  border-radius: 12px;
  border: 1.5px solid #e8e0e6;
  padding: 0 14px;
  background: #faf5f8;
  transition: all 0.25s;
}

.main-form :deep(.ant-input-affix-wrapper:hover) {
  border-color: #e8a0c0;
  background: #fff;
}

.main-form :deep(.ant-input-affix-wrapper-focused) {
  border-color: #d81b60;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(216, 27, 96, 0.06);
}

.main-form :deep(.ant-input) {
  font-size: 14px;
  background: transparent !important;
}

.input-icon {
  color: #d4b8cc;
  font-size: 16px;
  margin-right: 6px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.forgot-link {
  font-size: 13px;
  color: #bfbfbf;
  cursor: pointer;
  transition: color 0.2s;
}
.forgot-link:hover { color: #d81b60; }

.btn-primary {
  height: 50px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #ec407a, #ab47bc);
  border: none;
  box-shadow: 0 6px 20px rgba(233, 30, 99, 0.25);
  transition: all 0.3s;
  letter-spacing: 2px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(210, 27, 96, 0.35);
}

.submit-wrap {
  margin-top: 20px;
}

.form-footer {
  margin-top: 28px;
  text-align: center;
}

.form-footer p {
  font-size: 14px;
  color: #bfbfbf;
  margin: 0;
}

.form-footer a {
  color: #d81b60;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.form-footer a:hover {
  opacity: 0.7;
}

/* === Responsive === */
@media (max-width: 720px) {
  .login-card {
    flex-direction: column;
    max-width: 400px;
    margin: 0 auto;
    min-height: auto;
  }
  .brand-panel {
    flex: none;
    padding: 36px 28px;
  }
  .form-panel { padding: 36px 28px; }
}

@media (max-width: 480px) {
  .login-container { padding: 8px; }
  .login-card { border-radius: 16px; }
  .brand-panel { padding: 28px 20px; min-height: 180px; }
  .brand-title { font-size: 24px; letter-spacing: 3px; }
  .brand-subtitle { font-size: 10px; margin-bottom: 14px; }
  .brand-desc { font-size: 12px; margin-bottom: 20px; }
  .form-panel { padding: 28px 20px; }
  .form-title { font-size: 22px; }
  .form-sub { font-size: 13px; margin-bottom: 24px; }
  .tabs { gap: 20px; margin-bottom: 20px; }
  .main-form :deep(.ant-input-affix-wrapper) { height: 44px; }
  .main-form :deep(.ant-form-item) { margin-bottom: 16px; }
  .btn-primary { height: 44px; font-size: 14px; }
  .brand-icons { gap: 14px; }
  .bi { font-size: 20px; }
}
</style>
