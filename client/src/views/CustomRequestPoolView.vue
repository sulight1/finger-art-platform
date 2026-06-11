<template>
  <div class="custom-request-pool">
    <a-layout class="layout">
      <div class="drawer-overlay" :class="{ show: menuOpen }" @click="menuOpen = false"></div>
      <!-- Shared Header -->
      <a-layout-header class="header">
        <div class="header-content">
          <div class="logo" @click="$router.push('/')">
            <span class="logo-icon">✨</span>
            <span class="logo-text">指尖造物</span>
          </div>
          
          <div class="nav-links" :class="{ open: menuOpen }">
            <router-link to="/" class="nav-item" @click="menuOpen = false">首页</router-link>
            <router-link to="/marketplace" class="nav-item" @click="menuOpen = false">造物市集</router-link>
            <router-link to="/skill-exchange" class="nav-item" @click="menuOpen = false">技能交换</router-link>
            <router-link to="/custom-request-pool" class="nav-item" @click="menuOpen = false">需求大厅</router-link>
            <div class="mobile-drawer-extra">
              <div class="drawer-divider"></div>
              <template v-if="userStore.isLoggedIn">
                <div class="drawer-user-profile">
                  <a-avatar :src="userStore.userAvatar" :size="36" />
                  <span class="drawer-user-name">{{ userStore.user?.username }}</span>
                </div>
                <div class="drawer-divider"></div>
                <a-button block @click="menuOpen = false; showCustomModal = true">📋 发布求定制</a-button>
                <a-button type="dashed" block @click="menuOpen = false; $router.push('/artisan-dashboard')">🏪 我的小店</a-button>
                <a-button danger block @click="menuOpen = false; handleLogout()">退出登录</a-button>
              </template>
              <template v-else>
                <a-button type="primary" block @click="menuOpen = false; $router.push('/login')">登录 / 注册</a-button>
              </template>
            </div>
          </div>
          <div class="hamburger" :class="{ active: menuOpen }" @click="menuOpen = !menuOpen"><span></span><span></span><span></span></div>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <!-- Hero Section with Animated Mesh Gradient -->
        <div class="pool-hero-v2">
          <div class="hero-mesh"></div>
          <div class="hero-content-v2">
            <a-tag color="rgba(235, 47, 150, 0.1)" class="hero-badge">
              <template #icon><bulb-outlined /></template>
              创意集结地
            </a-tag>
            <h1>定制需求大厅</h1>
            <p>在这里，每一份独特的想象都能找到它的造物主</p>
          </div>
        </div>

        <div class="main-container-v2">
          <!-- Advanced Filter Bar -->
          <div class="glass-filter-bar">
            <div class="filter-left">
              <span class="filter-label">分类筛选：</span>
              <div class="filter-chips">
                <div 
                  v-for="cat in categories" 
                  :key="cat.value"
                  class="filter-chip"
                  :class="{ active: filterCategory === cat.value }"
                  @click="filterCategory = cat.value"
                >
                  {{ cat.label }}
                </div>
              </div>
            </div>
            
            <div class="filter-right">
              <a-input-search
                v-model:value="searchText"
                placeholder="搜索感兴趣的需求..."
                allow-clear
                class="premium-search"
                @search="onSearch"
              />
            </div>
          </div>

          <!-- Request Grid with Masonry-like Layout -->
          <div class="request-grid-v2" v-if="filteredRequests.length > 0">
            <a-row :gutter="[24, 24]">
              <a-col :xs="24" :sm="12" :lg="8" v-for="req in filteredRequests" :key="req.id">
                <div class="premium-req-card">
                  <div class="card-glow"></div>
                  <div class="card-inner">
                    <div class="card-top">
                      <div class="user-meta">
                        <a-avatar :size="36" :src="formatImageUrl(req.buyer?.avatar)" class="user-avatar-v2" />
                        <div class="user-info-v2">
                          <div class="name-v2">{{ req.buyer?.username }}</div>
                          <div class="time-v2">发布于 2小时前</div>
                        </div>
                      </div>
                      <a-tag :color="req.status === 'OPEN' ? 'green' : 'default'" class="status-tag-v2">
                        {{ req.status === 'OPEN' ? '招募中' : '已结束' }}
                      </a-tag>
                    </div>

                    <div class="card-middle">
                      <div class="cat-badge"># {{ req.category }}</div>
                      <h3 class="req-title-v2">{{ req.title }}</h3>
                      <p class="req-desc-v2">{{ truncateDesc(req.description) }}</p>
                    </div>

                    <div class="card-bottom">
                      <div class="meta-info-v2">
                        <div class="meta-item-v2">
                          <money-collect-outlined class="icon-v2" />
                          <div class="content-v2">
                            <div class="l">预估预算</div>
                            <div class="v">￥{{ req.budgetMin }} - {{ req.budgetMax }}</div>
                          </div>
                        </div>
                        <div class="meta-item-v2">
                          <calendar-outlined class="icon-v2" />
                          <div class="content-v2">
                            <div class="l">期望周期</div>
                            <div class="v">{{ req.deadline }}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="card-footer-v2">
                        <template v-if="req.buyer?.id === userStore.user?.id">
                          <a-button block disabled class="btn-mine">我的发布</a-button>
                        </template>
                        <template v-else>
                          <a-button type="primary" block class="btn-accept" @click="handleAcceptRequest(req)">
                            <template #icon><thunderbolt-filled /></template>
                            立即揭榜
                          </a-button>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
          
          <div v-else class="empty-state">
            <a-empty description="暂无匹配的定制需求，换个搜索词试试吧" />
          </div>
        </div>
      </a-layout-content>
    </a-layout>

    <!-- 发布求定制 Modal -->
    <a-modal v-model:open="showCustomModal" title="📋 发布求定制" @ok="handleCustomSubmit" width="580px">
      <a-form layout="vertical">
        <a-form-item label="我想要定制..." required>
          <a-input v-model:value="customForm.title" placeholder="例如：一个浅蓝色的钩织小兔挂件" />
        </a-form-item>
        <a-form-item label="作品分类">
          <a-select v-model:value="customForm.category" placeholder="请选择分类">
            <a-select-option value="钩织">🧶 钩织</a-select-option>
            <a-select-option value="滴胶">💎 滴胶</a-select-option>
            <a-select-option value="穿戴甲">💅 穿戴甲</a-select-option>
            <a-select-option value="粘土">🏺 粘土</a-select-option>
            <a-select-option value="缠花">🌸 缠花</a-select-option>
            <a-select-option value="其它">📦 其它</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="预算范围 (￥)">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-input-number v-model:value="customForm.budgetMin" :min="1" style="width: 100%" placeholder="最低" />
            </a-col>
            <a-col :span="12">
              <a-input-number v-model:value="customForm.budgetMax" :min="1" style="width: 100%" placeholder="最高" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="期望交付日期">
          <a-date-picker v-model:value="customForm.deadline" style="width: 100%" />
        </a-form-item>
        <a-form-item label="详细描述" required>
          <a-textarea v-model:value="customForm.description" placeholder="描述你想要的细节..." :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  MessageOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  BulbOutlined,
  MoneyCollectOutlined,
  CalendarOutlined,
  ThunderboltFilled
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '../stores/user';
import { getAllCustomRequests, createCustomRequest, type CustomRequest } from '../api/custom-request';
import { sendMessage } from '../api/message';

const router = useRouter();
const userStore = useUserStore();

const requests = ref<CustomRequest[]>([]);
const filterCategory = ref('all');
const searchText = ref('');
const menuOpen = ref(false);
const loading = ref(false);

// 发布求定制
const showCustomModal = ref(false);
const customForm = ref({
  title: '', category: '', budgetMin: 10, budgetMax: 200, deadline: '', description: ''
});

const handleCustomSubmit = async () => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录后再发布需求');
    return;
  }

  if (!customForm.value.title || !customForm.value.category || !customForm.value.description) {
    message.warning('请填写完整的定制需求信息（名称、分类和详细描述）');
    return;
  }

  try {
    const deadline = customForm.value.deadline
      ? (typeof customForm.value.deadline === 'string' ? customForm.value.deadline : (customForm.value.deadline as any).format('YYYY-MM-DD'))
      : '';

    await createCustomRequest({
      title: customForm.value.title,
      category: customForm.value.category,
      budgetMin: Number(customForm.value.budgetMin || 0),
      budgetMax: Number(customForm.value.budgetMax || 0),
      deadline: deadline,
      description: customForm.value.description,
    } as any);

    message.success('定制需求发布成功！等待手作娘联系。');
    showCustomModal.value = false;
    customForm.value = {
      title: '', category: '', budgetMin: 10, budgetMax: 200, deadline: '', description: ''
    };
    fetchRequests();
  } catch (err) {
    console.error('发布定制需求失败', err);
    message.error('发布失败，请稍后重试');
  }
};

const categories = [
  { label: '全部需求', value: 'all' },
  { label: '🧶 钩织', value: '钩织' },
  { label: '💎 滴胶', value: '滴胶' },
  { label: '💅 穿戴甲', value: '穿戴甲' },
  { label: '🏺 泥塑', value: '泥塑' },
  { label: '🌸 缠花', value: '缠花' },
  { label: '🧩 拼豆', value: '拼豆' },
  { label: '📦 其它', value: '其它' }
];

const fetchRequests = async () => {
  loading.value = true;
  try {
    const reqData = await getAllCustomRequests();
    
    // 只显示开放中的需求
    requests.value = reqData.filter(r => r.status === 'OPEN');
  } catch (err) {
    message.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

const filteredRequests = computed(() => {
  return requests.value.filter(req => {
    const matchCategory = filterCategory.value === 'all' || req.category === filterCategory.value;
    const matchSearch = !searchText.value || 
                       req.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
                       req.description.toLowerCase().includes(searchText.value.toLowerCase());
    return matchCategory && matchSearch;
  });
});

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

const formatImageUrl = (url: string | undefined) => {
  if (!url) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=User&backgroundColor=ffdfbf';
  if (url.startsWith('http')) return url;
  return `http://localhost:3000${url}`;
};

const truncateDesc = (desc: string) => {
  if (desc.length <= 60) return desc;
  return desc.substring(0, 60) + '...';
};

const handleAcceptRequest = async (req: CustomRequest) => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录后再接取需求');
    router.push('/login');
    return;
  }

  try {
    const content = `你好，我看到了你发布的定制需求《${req.title}》，我对此非常感兴趣，想要了解更多细节。`;
    
    await sendMessage({
      senderId: userStore.user.id,
      senderName: userStore.user.username,
      receiverId: req.buyer.id,
      receiverName: req.buyer.username,
      content: content
    });

    message.success(`已向「${req.buyer.username}」发送合作意向，请在私信中进一步沟通。`);
    
    router.push({
      path: '/artisan-dashboard',
      query: { 
        menu: 'messages',
        chatWithId: req.buyer.id,
        chatWithName: req.buyer.username
      }
    });
  } catch (err) {
    message.error('发起接取失败，请稍后重试');
  }
};

const onSearch = () => {
  // Computed property handles searching
};

onMounted(fetchRequests);
</script>

<style scoped>
.custom-request-pool {
  min-height: 100vh;
  background: #fdfdfd;
  overflow-x: hidden;
}

/* Header Refinement */
.header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  height: 72px;
  line-height: 72px;
  padding: 0 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 48px;
}

.logo { display: flex; align-items: center; cursor: pointer; margin-right: 48px; gap: 6px; flex-shrink: 0; }
.logo-icon { font-size: 24px; }
.logo-text { 
  font-size: 20px; 
  font-weight: 800; 
  background: linear-gradient(135deg, #eb2f96, #722ed1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nav-links { flex: 1; display: flex; gap: 6px; align-items: center; }
.nav-item {
  color: #595959; font-size: 14px; font-weight: 500; transition: all 0.25s;
  padding: 0 16px; height: 36px; line-height: 36px; border-radius: 10px;
}
.nav-item:hover { color: #eb2f96; background: rgba(235,47,150,0.04); }
.nav-item.router-link-active { color: #eb2f96; font-weight: 600; background: rgba(235,47,150,0.06); }

/* Hamburger + drawer */
.hamburger { display: none; flex-direction: column; gap: 4px; cursor: pointer; padding: 6px; z-index: 1100; margin-left: auto; }
.hamburger span { display: block; width: 22px; height: 2px; background: #595959; border-radius: 2px; transition: all 0.3s; }
.hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }
.mobile-drawer-extra { display: none; }
.drawer-divider { display: none; }
.drawer-user-profile { display: none; }
.drawer-user-name { display: none; }

/* Drawer overlay */
.drawer-overlay { display: none; }

/* Mobile drawer overlay */
@media (max-width: 768px) {
  .hamburger { display: flex; }
  .nav-links {
    position: fixed; top: 0; right: 0; width: 240px; height: 100vh;
    background: rgba(255,255,255,0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    flex-direction: column; padding: 80px 20px 24px;
    box-shadow: -4px 0 24px rgba(0,0,0,0.06); transition: transform 0.3s ease;
    z-index: 1000; gap: 4px; overflow-y: auto; transform: translateX(100%);
  }
  .nav-links.open { transform: translateX(0); }
  .nav-item { font-size: 16px; padding: 12px 16px; height: auto; line-height: 1.4; width: 100%; border-radius: 10px; }
  .mobile-drawer-extra { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
  .drawer-user-profile { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
  .drawer-user-name { font-size: 16px; font-weight: 700; color: #262626; }
  .drawer-divider { display: block; height: 1px; background: #f0f0f0; margin: 8px 0; }
  .user-area { display: none; }
  .header-content { gap: 8px; }
  .drawer-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.15); z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
  .drawer-overlay.show { opacity: 1; pointer-events: auto; }
}

.user-area { margin-left: auto; display: flex; align-items: center; gap: 16px; }
.user-profile { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.user-name { font-weight: 500; color: #595959; }

/* Hero Section v2 */
.pool-hero-v2 {
  position: relative;
  padding: 100px 0 120px;
  overflow: hidden;
  background: #fff;
}

.hero-mesh {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(at 0% 0%, rgba(255, 133, 192, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(114, 46, 209, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(255, 133, 192, 0.1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(114, 46, 209, 0.1) 0px, transparent 50%);
  z-index: 0;
}

.hero-content-v2 {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(235, 47, 150, 0.1);
}

.hero-content-v2 h1 {
  font-size: 48px;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.hero-content-v2 p {
  font-size: 20px;
  color: #86868b;
  margin-bottom: 48px;
}

/* Main Container v2 */
.main-container-v2 {
  max-width: 1300px;
  margin: -40px auto 80px;
  padding: 0 24px;
  position: relative;
  z-index: 10;
}

/* Glass Filter Bar */
.glass-filter-bar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  padding: 20px 32px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #86868b;
}

.filter-chips {
  display: flex;
  gap: 10px;
}

.filter-chip {
  padding: 8px 18px;
  background: #f5f5f7;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1f;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-chip:hover {
  background: #f0f0f2;
  transform: translateY(-1px);
}

.filter-chip.active {
  background: #eb2f96;
  color: white;
  box-shadow: 0 4px 12px rgba(235, 47, 150, 0.2);
}

.premium-search :deep(.ant-input) {
  border-radius: 12px 0 0 12px !important;
  height: 44px;
  border-color: transparent !important;
  background: #f5f5f7;
}

.premium-search :deep(.ant-input-search-button) {
  height: 44px;
  border-radius: 0 12px 12px 0 !important;
  background: #eb2f96 !important;
  border: none !important;
}

/* Premium Request Card */
.premium-req-card {
  position: relative;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-req-card:hover {
  transform: translateY(-8px);
}

.card-glow {
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, #eb2f96, #722ed1);
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.4s;
  z-index: 0;
}

.premium-req-card:hover .card-glow {
  opacity: 0.15;
}

.card-inner {
  position: relative;
  z-index: 1;
  background: white;
  border-radius: 24px;
  padding: 28px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.user-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-avatar-v2 {
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info-v2 .name-v2 {
  font-weight: 700;
  color: #1d1d1f;
  font-size: 15px;
}

.user-info-v2 .time-v2 {
  font-size: 12px;
  color: #86868b;
  margin-top: 2px;
}

.status-tag-v2 {
  border-radius: 6px;
  font-weight: 600;
  margin: 0;
  border: none;
}

.cat-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  color: #eb2f96;
  background: #fff0f6;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.req-title-v2 {
  font-size: 20px;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 12px;
  line-height: 1.4;
}

.req-desc-v2 {
  color: #424245;
  line-height: 1.7;
  font-size: 14px;
  margin-bottom: 24px;
  flex: 1;
}

.meta-info-v2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: #f5f5f7;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.meta-item-v2 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.icon-v2 {
  font-size: 18px;
  color: #eb2f96;
}

.content-v2 .l {
  font-size: 11px;
  color: #86868b;
  font-weight: 600;
  text-transform: uppercase;
}

.content-v2 .v {
  font-size: 13px;
  font-weight: 700;
  color: #1d1d1f;
}

.btn-accept {
  height: 48px !important;
  border-radius: 14px !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #eb2f96, #722ed1) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(235, 47, 150, 0.3) !important;
}

.btn-accept:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(235, 47, 150, 0.4) !important;
}

.btn-mine {
  height: 48px !important;
  border-radius: 14px !important;
  background: #f5f5f7 !important;
  border: none !important;
  color: #86868b !important;
}

.empty-state {
  padding: 120px 0;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

/* ===== Responsive ===== */
@media (max-width: 992px) {
  .pool-hero-v2 { padding: 48px 24px; }
  .hero-content-v2 h1 { font-size: 38px; }
  .glass-filter-bar { flex-direction: column; gap: 16px; align-items: flex-start; }
  .filter-right { width: 100%; }
  .filter-right :deep(.premium-search) { width: 100% !important; }
}

@media (max-width: 768px) {
  .header-content { padding: 0 16px; }
  .nav-links { gap: 4px; }
  .nav-item { padding: 0 10px; font-size: 13px; height: 32px; line-height: 32px; }
  .logo-text { font-size: 17px; }
  .logo-icon { font-size: 20px; }
  .user-area :deep(.ant-btn) { font-size: 12px; height: 32px; padding: 0 10px; }
  .pool-hero-v2 { padding: 36px 20px; }
  .hero-content-v2 h1 { font-size: 30px; }
  .hero-content-v2 p { font-size: 16px; margin-bottom: 24px; }
  .glass-filter-bar { padding: 16px 20px; }
  .main-container-v2 { padding: 0 12px; margin-top: -20px; }
  .request-card { padding: 24px; }
}

@media (max-width: 480px) {
  .header-content { flex-wrap: wrap; gap: 6px; padding: 0 12px; }
  .logo { margin-right: 0; }
  .nav-links { order: 3; width: 100%; justify-content: center; gap: 2px; }
  .nav-item { font-size: 12px; padding: 0 6px; height: 28px; line-height: 28px; }
  .hero-content-v2 h1 { font-size: 26px; }
  .hero-badge { font-size: 11px; }
  .glass-filter-bar { margin-bottom: 24px; }
  .filter-chips { flex-wrap: wrap; gap: 6px; }
  .filter-chip { font-size: 12px; padding: 4px 12px; }
  .premium-req-card { border-radius: 14px; }
  .card-inner { padding: 18px; }
  .req-title-v2 { font-size: 16px; }
  .meta-item-v2 { gap: 8px; }
}

/* --- 640px: mid-range fix --- */
@media (max-width: 640px) {
  .header-content { flex-wrap: wrap; gap: 6px; padding: 0 12px; }
  .logo { margin-right: 0; }
  .nav-links { width: 100%; justify-content: center; gap: 4px; }
  .nav-item { font-size: 12px; padding: 0 8px; height: 28px; line-height: 28px; }
  .user-area :deep(.ant-btn) { font-size: 11px; height: 28px; padding: 0 8px; }
  .pool-hero-v2 { padding: 40px 20px; }
  .hero-content-v2 h1 { font-size: 30px; }
  .hero-content-v2 p { font-size: 16px; margin-bottom: 24px; }
  .main-container-v2 { margin-top: -24px; padding: 0 14px; }
  .glass-filter-bar { flex-direction: column; gap: 12px; align-items: stretch; padding: 16px 20px; }
  .filter-left { flex-direction: column; gap: 8px; }
  .filter-label { display: none; }
  .filter-chips { flex-wrap: wrap; gap: 6px; }
  .filter-chip { font-size: 12px; padding: 4px 14px; }
  .filter-right { width: 100%; }
  .filter-right :deep(.ant-input-search) { width: 100% !important; }
  .premium-req-card { border-radius: 16px; }
  .card-inner { padding: 20px; }
  .card-top { flex-direction: column; align-items: flex-start; gap: 8px; }
  .req-title-v2 { font-size: 17px; }
  .meta-info-v2 { flex-direction: column; gap: 8px; }
  .meta-item-v2 { gap: 10px; }
  .hero-badge { font-size: 11px; padding: 4px 12px; }
  .btn-accept { height: 40px; font-size: 13px; }
}
</style>
