<template>
  <div class="skill-exchange-container">
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
                <template v-if="userStore.isAdmin">
                  <a-button type="primary" block @click="menuOpen = false; $router.push('/admin')">🛡️ 管理后台</a-button>
                  <a-button danger block @click="menuOpen = false; userStore.logout(); $router.push('/')">退出</a-button>
                </template>
                <template v-else>
                  <a-button block @click="menuOpen = false; showCopywriting = true">🤖 AI 文案</a-button>
                  <a-button block @click="menuOpen = false; showExchangeHistory = true">📋 我的交换记录</a-button>
                  <a-button danger block @click="menuOpen = false; userStore.logout(); $router.push('/')">退出登录</a-button>
                </template>
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
        <!-- Hero Section v2 -->
        <div class="exchange-hero-v2">
          <div class="hero-mesh"></div>
          <div class="hero-content-v2">
            <a-tag color="rgba(235, 47, 150, 0.1)" class="hero-badge">
              <template #icon><thunderbolt-outlined /></template>
              才华交换所
            </a-tag>
            <h1>技能互助圈</h1>
            <p>在这里，技能就是硬通货。用你的才华，交换他人的梦想。</p>
            <div class="hero-action-row">
              <a-button type="primary" size="large" class="premium-btn" @click="showPostModal = true">
                <template #icon><plus-outlined /></template>
                发布我的技能
              </a-button>
              <a-button size="large" class="rules-btn" @click="showRulesModal = true">
                交换规则
              </a-button>
            </div>
          </div>
        </div>

        <div class="main-container-v2">
          <a-row :gutter="40">
            <!-- Left: Skill List -->
            <a-col :xs="24" :lg="16">
              <div class="list-section-v2">
                <div class="section-header-v2">
                  <div class="h-left">
                    <h2>探索精选技能</h2>
                    <div class="category-chips">
                      <div 
                        v-for="cat in ['all', '钩织', '摄影', '设计', '滴胶', '缠花']" 
                        :key="cat"
                        class="cat-chip"
                        :class="{ active: skillFilter === cat }"
                        @click="skillFilter = cat"
                      >
                        {{ cat === 'all' ? '全部' : cat }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="skill-grid-v2">
                  <div v-for="item in skills" :key="item.id" class="premium-skill-card">
                    <div class="card-glow"></div>
                    <div class="card-inner-v2">
                      <div class="card-top-v2">
                        <div class="creator-box">
                          <a-avatar :size="40" :src="formatImageUrl(item.avatar)" />
                          <div class="creator-meta">
                            <span class="name">{{ item.username }}</span>
                            <div class="rating-row">
                              <a-rate :value="item.rating" disabled style="font-size: 10px" />
                              <span class="credit">信用 {{ item.credit }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="price-badge">
                          <span class="val">{{ item.zaowuBiCost }}</span>
                          <span class="unit">造物币</span>
                        </div>
                      </div>

                      <div class="card-mid-v2">
                        <h3 class="skill-title-v2">{{ item.title }}</h3>
                        <p class="skill-desc-v2">{{ item.description }}</p>
                        <div class="skill-tags-v2">
                          <span class="tag-v2 blue">⏱ {{ item.duration }}</span>
                          <span class="tag-v2 pink"># {{ item.category }}</span>
                        </div>
                      </div>

                      <div class="card-footer-v2">
                        <div class="exchange-stats">
                          <span class="count">已成功交换 <b>{{ item.exchangeCount }}</b> 次</span>
                        </div>
                        <a-button type="primary" shape="round" class="btn-exchange" @click="handleExchangeRequest(item)">
                          发起交换
                        </a-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>

            <!-- Right: Sidebar -->
            <a-col :xs="24" :lg="8">
              <div class="sidebar-v2">
                <div class="glass-sidebar-card">
                  <div class="card-title-v2">
                    <calendar-outlined /> 我的排期日历
                    <a class="manage-link" @click="handleManageSchedule">管理</a>
                  </div>
                  <a-calendar :fullscreen="false" @select="onDateSelect" class="premium-calendar" />
                  <div class="calendar-footer">
                    <div class="leg"><span class="dot av"></span>空闲</div>
                    <div class="leg"><span class="dot bs"></span>忙碌</div>
                    <div class="leg"><span class="dot pd"></span>待确认</div>
                  </div>
                </div>

                <div class="glass-sidebar-card mt-32">
                  <div class="card-title-v2">
                    <fire-outlined style="color: #ff4d4f" /> 热门技能达人
                  </div>
                  <div class="creator-list-v2">
                    <div v-for="(item, index) in topCreators" :key="item.id" class="creator-item-v2">
                      <div class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
                      <a-avatar :size="44" :src="formatImageUrl(item.avatar)" class="creator-avatar" />
                      <div class="c-info">
                        <div class="c-name">
                          {{ item.username }}
                          <a-tag v-if="index === 0" color="gold" size="small" style="font-size: 10px; margin-left: 4px; border: none">殿堂级</a-tag>
                        </div>
                        <div class="c-bio">{{ item.bio || '资深手作匠人' }}</div>
                      </div>
                      <a-button 
                        ghost 
                        size="small" 
                        class="btn-follow-v2"
                        :class="{ following: isFollowing(item.id) }"
                        :loading="followLoading === item.id"
                        @click="handleFollowToggle(item)"
                      >
                        {{ isFollowing(item.id) ? '已关注' : '+ 关注' }}
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-layout-content>
    </a-layout>

    <!-- Post Skill Modal -->
    <a-modal v-model:open="showPostModal" title="发布技能服务" @ok="handlePostSubmit">
      <template #extra>
        <a-button type="link" @click="showCopywriting = true" style="color: #eb2f96">
          🤖 AI 生成文案
        </a-button>
      </template>
      <a-form layout="vertical">
        <a-form-item label="技能标题" required>
          <a-input v-model:value="postForm.title" placeholder="例如：零基础教你钩织草莓熊" />
        </a-form-item>
        <a-form-item label="详细描述" required>
          <a-textarea v-model:value="postForm.description" :rows="4" placeholder="描述一下你能提供的服务..." />
        </a-form-item>
        <a-form-item label="所属分类">
          <a-select v-model:value="postForm.category" placeholder="选择分类">
            <a-select-option value="钩织">钩织</a-select-option>
            <a-select-option value="摄影">摄影</a-select-option>
            <a-select-option value="设计">设计</a-select-option>
            <a-select-option value="滴胶">滴胶</a-select-option>
            <a-select-option value="缠花">缠花</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="预计耗时">
          <a-input v-model:value="postForm.duration" placeholder="例如：2小时" />
        </a-form-item>
        <a-form-item label="造物币价值">
          <a-input-number v-model:value="postForm.zaowuBiCost" :min="1" :max="100" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Exchange Rules Modal -->
    <a-modal v-model:open="showRulesModal" title="技能交换规则" :footer="null" width="600px">
      <div class="rules-content">
        <div class="rule-item">
          <div class="rule-icon">🤝</div>
          <div class="rule-detail">
            <h4>公平交换</h4>
            <p>技能交换以“造物币”作为价值衡量标准，确保每一次分享都能获得应有的回报。</p>
          </div>
        </div>
        <div class="rule-item">
          <div class="rule-icon">📝</div>
          <div class="rule-detail">
            <h4>发布技能</h4>
            <p>您可以发布自己擅长的技能（如钩织、摄影、设计等），并根据服务内容设定合理的造物币价值。</p>
          </div>
        </div>
        <div class="rule-item">
          <div class="rule-icon">🚀</div>
          <div class="rule-detail">
            <h4>发起请求</h4>
            <p>浏览推荐技能，选择感兴趣的项目发起交换请求。请在请求中说明您的需求和期望时间。</p>
          </div>
        </div>
        <div class="rule-item">
          <div class="rule-icon">📅</div>
          <div class="rule-detail">
            <h4>排期确认</h4>
            <p>双方需通过内置日历功能协调具体服务时间，避免冲突，提高交换效率。</p>
          </div>
        </div>
        <div class="rule-item">
          <div class="rule-icon">💰</div>
          <div class="rule-detail">
            <h4>结算机制</h4>
            <p>服务完成后，系统将自动从需求方账户划扣造物币至提供方账户，保障双方权益。</p>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- My Exchanges Modal -->
    <a-modal v-model:open="showExchangeHistory" title="我的交换记录" width="800px" :footer="null">
      <a-list :data-source="myExchanges" :loading="loading">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :description="item.description">
              <template #title>
                <div style="display: flex; justify-content: space-between;">
                  <span>与 <strong>{{ item.userB.id === userStore.user?.id ? item.userA.username : item.userB.username }}</strong> 的交换</span>
                  <a-tag :color="item.status === 'COMPLETED' ? 'green' : 'blue'">{{ item.status }}</a-tag>
                </div>
              </template>
            </a-list-item-meta>
            <template #actions>
              <span v-if="item.status === 'COMPLETED'">+{{ item.zaowuBiCost || 10 }} 造物币</span>
              <a-button 
                v-else-if="item.status === 'ACCEPTED' && item.userB.id === userStore.user?.id" 
                type="link" 
                @click="handleCompleteExchange(item.id)"
              >
                确认完成并收款
              </a-button>
              <span v-else-if="item.status === 'ACCEPTED'">等待对方确认</span>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>

  <!-- 排期管理 Modal -->
    <a-modal v-model:open="showManageModal" title="📅 排期管理" @ok="handleScheduleSave" width="420px">
      <div style="text-align: center; padding: 20px 0;">
        <div style="font-size: 28px; font-weight: 700; color: #262626; margin-bottom: 8px;">{{ selectedDateStr }}</div>
        <div style="font-size: 13px; color: #8c8c8c; margin-bottom: 24px;">点击下方按钮标记当天状态</div>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <a-button 
            :type="manageStatus === 'FREE' ? 'primary' : 'default'"
            size="large" 
            style="border-radius: 12px; min-width: 100px;"
            @click="manageStatus = 'FREE'"
          >🟢 空闲</a-button>
          <a-button 
            :type="manageStatus === 'BUSY' ? 'primary' : 'default'"
            size="large" danger
            style="border-radius: 12px; min-width: 100px;"
            @click="manageStatus = 'BUSY'"
          >🔴 忙碌</a-button>
          <a-button 
            :type="manageStatus === 'PENDING' ? 'primary' : 'default'"
            size="large" 
            :style="{ borderRadius: '12px', minWidth: '100px', background: manageStatus === 'PENDING' ? '#fff7e6' : '', borderColor: manageStatus === 'PENDING' ? '#faad14' : '' }"
            @click="manageStatus = 'PENDING'"
          >🟡 待确认</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 交换预约 Modal -->
    <a-modal v-model:open="showExchangeModal" title="📅 预约技能交换" @ok="handleExchangeSubmit" width="540px" :confirmLoading="loadingSlot">
      <template v-if="exchangeTarget">
        <div style="margin-bottom: 16px; padding: 12px 16px; background: #fdf2f8; border-radius: 12px;">
          <div style="font-size: 13px; color: #8c8c8c;">正在发起交换</div>
          <div style="font-size: 16px; font-weight: 700; color: #262626; margin-top: 4px;">
            {{ exchangeTarget.title }}
            <a-tag color="pink" style="margin-left: 8px;">{{ exchangeTarget.zaowuBiCost }} 造物币</a-tag>
          </div>
          <div style="font-size: 13px; color: #595959;">技能提供者：{{ exchangeTarget.username }}</div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">📆 选择预约日期</div>
          <div v-if="creatorFreeDates.length === 0 && !loadingSlot" style="color: #faad14; font-size: 13px; padding: 12px 0;">
            ⚠️ 该创作者暂无空闲日期标记，您仍然可以选择任意日期发起请求。
          </div>
          <div v-if="loadingSlot" style="text-align: center; padding: 20px;">
            <a-spin /> <span style="margin-left: 8px; color: #8c8c8c;">加载排期中...</span>
          </div>
          <div v-else style="display: flex; flex-wrap: wrap; gap: 8px; max-height: 200px; overflow-y: auto; padding: 4px 0;">
            <div
              v-for="d in creatorFreeDates"
              :key="d"
              class="date-chip"
              :class="{ selected: selectedScheduleDate === d }"
              @click="selectedScheduleDate = d"
            >
              <div style="font-size: 12px; font-weight: 600;">{{ d.slice(5) }}</div>
              <div style="font-size: 10px; color: #8c8c8c;">{{ ['日','一','二','三','四','五','六'][new Date(d).getDay()] }}</div>
            </div>
          </div>
        </div>

        <div>
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">💬 附言</div>
          <a-textarea v-model:value="exchangeMessage" :rows="3" placeholder="给对方留言..." />
        </div>
      </template>
    </a-modal>

    <!-- AI 功能弹窗 -->
    <AICopywriting v-model:open="showCopywriting" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  MessageOutlined,
  ThunderboltOutlined,
  PlusOutlined,
  CalendarOutlined,
  FireOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '../stores/user';
import AICopywriting from '../components/AICopywriting.vue';
import { 
  getSkills, 
  addSkill, 
  type SkillItem, 
  getMyExchanges, 
  completeExchange,
  requestExchange,
  getScheduleSlots,
  saveScheduleSlot
} from '../api/skill-exchange';
import { 
  getAllUsers, 
  type UserInfo,
  followUser,
  unfollowUser,
  getFollowings
} from '../api/user';

const router = useRouter();
const userStore = useUserStore();

const skillFilter = ref('all');
const showPostModal = ref(false);
const showCopywriting = ref(false);
const showRulesModal = ref(false);
const showExchangeHistory = ref(false);
const menuOpen = ref(false);
const loading = ref(false);
const skills = ref<SkillItem[]>([]);
const myExchanges = ref<any[]>([]);
const followLoading = ref<number | null>(null);
const followings = ref<UserInfo[]>([]);

// ===== 排期日历 =====
const scheduleSlots = ref<Map<string, string>>(new Map());       // date -> status
const currentMonth = ref(new Date().getMonth() + 1);
const currentYear = ref(new Date().getFullYear());
const showManageModal = ref(false);
const selectedDateStr = ref('');
const selectedDateStatus = ref('FREE');
const manageStatus = ref('FREE');

const loadSchedule = async () => {
  if (!userStore.user?.id) return;
  try {
    const slots = await getScheduleSlots(userStore.user.id, currentYear.value, currentMonth.value);
    const map = new Map<string, string>();
    slots.forEach(s => map.set(s.date, s.status));
    scheduleSlots.value = map;
  } catch (err) {
    console.error('加载排期失败', err);
  }
};

const getCellStatus = (dateStr: string): string => {
  return scheduleSlots.value.get(dateStr) || '';
};

const handleDateSelect = (date: any) => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录');
    return;
  }
  const y = date.$y ?? date.getFullYear?.() ?? date.getFullYear();
  const m = date.$M ?? date.getMonth?.() ?? date.getMonth();
  const d = date.$D ?? date.getDate?.() ?? date.getDate();
  selectedDateStr.value = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  selectedDateStatus.value = getCellStatus(selectedDateStr.value) || 'FREE';
  manageStatus.value = selectedDateStatus.value;
  showManageModal.value = true;
};

const handleScheduleSave = async () => {
  if (!userStore.user?.id) return;
  try {
    await saveScheduleSlot(userStore.user.id, selectedDateStr.value, manageStatus.value);
    scheduleSlots.value.set(selectedDateStr.value, manageStatus.value);
    message.success(manageStatus.value === 'FREE' ? '已标记为空闲' : manageStatus.value === 'BUSY' ? '已标记为忙碌' : '已标记为待确认');
    showManageModal.value = false;
  } catch (err) {
    message.error('保存失败');
  }
};

const handleManageSchedule = () => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录');
    return;
  }
  // 直接打开当前月份的日历管理
  const today = new Date();
  selectedDateStr.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  selectedDateStatus.value = getCellStatus(selectedDateStr.value) || 'FREE';
  manageStatus.value = selectedDateStatus.value;
  showManageModal.value = true;
};

const fetchMyExchanges = async () => {
  if (!userStore.user?.id) return;
  try {
    myExchanges.value = await getMyExchanges(userStore.user.id);
  } catch (err) {
    console.error('加载交换记录失败', err);
  }
};

const handleCompleteExchange = async (id: number) => {
  try {
    await completeExchange(id);
    message.success('交换已完成，造物币已结算');
    fetchMyExchanges();
    userStore.fetchProfile(); // 刷新余额
  } catch (err) {
    message.error('结算失败');
  }
};

watch(showExchangeHistory, (val) => {
  if (val) fetchMyExchanges();
});

// 监听发布弹窗打开 → 检查 AI 文案
watch(showPostModal, (val) => {
  if (val) {
    const saved = localStorage.getItem('ai_copywriting');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        postForm.value.title = data.title || '';
        postForm.value.description = data.description || '';
        localStorage.removeItem('ai_copywriting');
      } catch {}
    }
  }
});

const formatImageUrl = (url: string | undefined) => {
  if (!url) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=User&backgroundColor=ffdfbf';
  if (url.startsWith('http')) return url;
  return `http://localhost:3000${url}`;
};

const topCreators = ref<UserInfo[]>([]);

const fetchTopCreators = async () => {
  try {
    const users = await getAllUsers();
    // 过滤掉管理员，或者只展示前几个活跃用户
    topCreators.value = users.filter(u => u.role !== 'ADMIN' && u.id !== userStore.user?.id).slice(0, 5);
  } catch (err) {
    console.error('加载达人列表失败', err);
  }
};

const fetchFollowings = async () => {
  if (!userStore.isLoggedIn) return;
  try {
    followings.value = await getFollowings(userStore.user.id);
  } catch (err) {
    console.error('获取关注列表失败', err);
  }
};

const isFollowing = (userId: number) => {
  return followings.value.some(u => u.id === userId);
};

const handleFollowToggle = async (item: UserInfo) => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录后再关注');
    router.push('/login');
    return;
  }
  
  followLoading.value = item.id;
  try {
    if (isFollowing(item.id)) {
      await unfollowUser(userStore.user.id, item.id);
      message.success(`已取消关注 ${item.username}`);
    } else {
      await followUser(userStore.user.id, item.id);
      message.success(`已成功关注 ${item.username}`);
    }
    await fetchFollowings();
  } catch (err: any) {
    message.error(err.response?.data?.message || '操作失败');
  } finally {
    followLoading.value = null;
  }
};

const postForm = ref({
  username: '',
  title: '',
  description: '',
  category: '钩织',
  duration: '2小时',
  zaowuBiCost: 10
});

const fetchSkills = async () => {
  loading.value = true;
  try {
    const category = skillFilter.value === 'all' ? undefined : skillFilter.value;
    skills.value = await getSkills(category, 'APPROVED');
  } catch (err) {
    console.error('加载技能列表失败', err);
  } finally {
    loading.value = false;
  }
};

watch(skillFilter, () => {
  fetchSkills();
});

const handleEarnCoins = async () => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录');
    return;
  }
  try {
    // 模拟获取造物币的过程，实际可能对接支付或任务系统
    const amount = 50;
    await userStore.addCoinsToUser(amount);
    message.success(`恭喜获得 ${amount} 造物币！`);
  } catch (err) {
    message.error('获取造物币失败');
  }
};

onMounted(() => {
  fetchSkills();
  fetchTopCreators();
  if (userStore.isLoggedIn) {
    userStore.fetchProfile();
    fetchFollowings();
    loadSchedule();
  }
});

const onDateSelect = handleDateSelect;

// ===== 发起交换（带排期选择）=====
const showExchangeModal = ref(false);
const exchangeTarget = ref<SkillItem | null>(null);
const exchangeMessage = ref('');
const selectedScheduleDate = ref('');
const creatorSchedule = ref<Map<string, string>>(new Map());
const creatorFreeDates = ref<string[]>([]);
const loadingSlot = ref(false);

const openExchangeModal = async (item: SkillItem) => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录后再发起交换');
    router.push('/login');
    return;
  }
  exchangeTarget.value = item;
  exchangeMessage.value = `你好，我对你的「${item.title}」技能很感兴趣，想预约学习，方便吗？`;
  selectedScheduleDate.value = '';
  
  // 加载该创建者的排期
  loadingSlot.value = true;
  try {
    const now = new Date();
    const slots = await getScheduleSlots(item.userId, now.getFullYear(), now.getMonth() + 1);
    // 也加载下个月的
    const nextMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
    const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    const slots2 = await getScheduleSlots(item.userId, nextYear, nextMonth);
    
    const map = new Map<string, string>();
    [...slots, ...slots2].forEach(s => map.set(s.date, s.status));
    creatorSchedule.value = map;
    
    // 筛选出空闲日期
    const freeDates: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 生成接下来60天的日期
    for (let i = 1; i <= 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const status = map.get(key);
      // 没有标记 = 空闲，或显式标记为 FREE
      if (!status || status === 'FREE') {
        freeDates.push(key);
      }
    }
    creatorFreeDates.value = freeDates;
    showExchangeModal.value = true;
  } catch (err) {
    console.error('加载排期失败', err);
    creatorFreeDates.value = []; // 加载失败也允许发起
    showExchangeModal.value = true;
  } finally {
    loadingSlot.value = false;
  }
};

const handleExchangeSubmit = async () => {
  if (!exchangeTarget.value || !userStore.user?.id) return;
  if (!selectedScheduleDate.value) {
    message.warning('请选择一个预约日期');
    return;
  }
  try {
    await requestExchange({
      userAId: userStore.user.id,
      userBId: exchangeTarget.value.userId,
      description: exchangeMessage.value,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      zaowuBiCost: exchangeTarget.value.zaowuBiCost,
      scheduleDate: selectedScheduleDate.value
    });
    message.success(`已向 ${exchangeTarget.value.username} 发起交换请求，预约日期：${selectedScheduleDate.value}`);
    showExchangeModal.value = false;
  } catch (err) {
    message.error('发起交换请求失败');
  }
};

const handleExchangeRequest = (item: SkillItem) => {
  openExchangeModal(item);
};

const handlePostSubmit = async () => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录后再发布技能');
    return;
  }
  if (!postForm.value.title || !postForm.value.description) {
    message.warning('请填写完整信息');
    return;
  }
  try {
    await addSkill({
      userId: userStore.user?.id,
      username: userStore.user?.username || '匿名创作者',
      title: postForm.value.title,
      description: postForm.value.description,
      category: postForm.value.category,
      duration: postForm.value.duration,
      zaowuBiCost: postForm.value.zaowuBiCost,
      avatar: userStore.user?.avatar || ''
    });
    message.success('技能发布成功！');
    showPostModal.value = false;
    postForm.value = { username: '', title: '', description: '', category: '钩织', duration: '2小时', zaowuBiCost: 10 };
    fetchSkills();
  } catch (err) {
    console.error('发布失败', err);
  }
};
</script>

<style scoped>
.skill-exchange-container {
  min-height: 100vh;
  background: #fdfdfd;
  overflow-x: hidden;
}

/* Header */
.header {
  background: rgba(255,255,255,0.85);
  backdrop-filter: saturate(180%) blur(16px);
  position: sticky; top: 0; z-index: 1000;
  height: 68px; line-height: 68px;
  border-bottom: 1px solid rgba(235,47,150,0.06);
  box-shadow: 0 1px 20px rgba(235,47,150,0.03);
}
.header-content {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; padding: 0 28px;
}
.logo { display: flex; align-items: center; cursor: pointer; margin-right: 48px; gap: 6px; flex-shrink: 0; }
.logo-icon { font-size: 24px; }
.logo-text {
  font-size: 20px; font-weight: 800;
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
  .zaowubi-display { display: none; }
  .header-content { gap: 8px; }
  .drawer-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.15); z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
  .drawer-overlay.show { opacity: 1; pointer-events: auto; }
}

.zaowubi-display {
  background: rgba(255, 247, 230, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 229, 143, 0.5);
  height: 44px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  margin-left: 48px;
  flex-shrink: 0;
}

.coin-icon { font-size: 18px; }
.coin-info { display: flex; flex-direction: column; line-height: 1.1; }
.coin-label { font-size: 10px; color: #8c8c8c; font-weight: 600; text-transform: uppercase; }
.coin-value { font-size: 14px; font-weight: 700; color: #fa8c16; }

.earn-btn {
  background: linear-gradient(135deg, #ffa940, #fa8c16) !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(250, 140, 22, 0.2);
}

.user-area { margin-left: auto; display: flex; align-items: center; gap: 16px; }
.user-profile { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  transition: all 0.3s;
}
.user-profile:hover { background: rgba(0, 0, 0, 0.04); }
.user-name { font-weight: 600; color: #1d1d1f; font-size: 14px; }

/* Hero Section v2 */
.exchange-hero-v2 {
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
  font-size: 56px;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 20px;
  letter-spacing: -1.5px;
  line-height: 1.1;
}

.hero-content-v2 p {
  font-size: 20px;
  color: #86868b;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-action-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 60px;
}

.premium-btn {
  height: 52px !important;
  padding: 0 32px !important;
  border-radius: 26px !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #eb2f96, #722ed1) !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(235, 47, 150, 0.3) !important;
  font-size: 16px !important;
}

.rules-btn {
  height: 52px !important;
  padding: 0 32px !important;
  border-radius: 26px !important;
  font-weight: 600 !important;
  background: #f5f5f7 !important;
  border: none !important;
  font-size: 16px !important;
  transition: all 0.3s !important;
}

.rules-btn:hover { background: #e8e8ed !important; }

/* Main Container v2 */
.main-container-v2 {
  max-width: 1400px;
  margin: -40px auto 80px;
  padding: 0 40px;
  position: relative;
  z-index: 10;
}

/* List Section */
.list-section-v2 {
  background: white;
  border-radius: 32px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f0f2;
}

.section-header-v2 {
  margin-bottom: 32px;
}

.section-header-v2 h2 {
  font-size: 28px;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 24px;
}

.category-chips {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cat-chip {
  padding: 8px 20px;
  background: #f5f5f7;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cat-chip:hover {
  background: #f0f0f2;
  transform: translateY(-2px);
}

.cat-chip.active {
  background: #eb2f96;
  color: white;
}

/* Date chip for exchange scheduling */
.date-chip {
  padding: 8px 14px;
  background: #f5f5f7;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s;
  text-align: center;
  min-width: 56px;
  border: 1.5px solid transparent;
}

.date-chip:hover {
  border-color: #eb2f96;
  background: #fff0f6;
  transform: translateY(-2px);
}

.date-chip.selected {
  border-color: #eb2f96;
  background: #fdf2f8;
  box-shadow: 0 2px 8px rgba(235, 47, 150, 0.15);
}

.date-chip.selected div:first-child {
  color: #eb2f96;
}

/* Skill Grid & Card */
.skill-grid-v2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

@media (max-width: 640px) {
  .skill-grid-v2 {
    grid-template-columns: 1fr;
  }
}

.premium-skill-card {
  position: relative;
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  border: 1px solid #f0f0f2;
  overflow: hidden; /* 确保内容不会溢出圆角 */
}

.premium-skill-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  border-color: rgba(235, 47, 150, 0.2);
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

.premium-skill-card:hover .card-glow {
  opacity: 0.1;
}

.card-inner-v2 {
  position: relative;
  z-index: 1;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-mid-v2 {
  flex: 1;
  margin-bottom: 16px;
}

.card-top-v2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.creator-box {
  display: flex;
  gap: 12px;
  align-items: center;
}

.creator-meta .name {
  display: block;
  font-weight: 700;
  color: #1d1d1f;
  font-size: 15px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.credit {
  font-size: 11px;
  color: #86868b;
  font-weight: 600;
}

.price-badge {
  background: #fff7e6;
  padding: 6px 14px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1;
}

.price-badge .val {
  font-size: 18px;
  font-weight: 800;
  color: #fa8c16;
}

.price-badge .unit {
  font-size: 10px;
  color: #fa8c16;
  font-weight: 700;
  margin-top: 2px;
  opacity: 0.8;
}

.skill-title-v2 {
  font-size: 20px;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 12px;
}

.skill-desc-v2 {
  color: #424245;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.skill-tags-v2 {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.tag-v2 {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.tag-v2.blue { background: #e6f7ff; color: #1890ff; }
.tag-v2.pink { background: #fff0f6; color: #eb2f96; }

.card-footer-v2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f5f5f7;
}

.exchange-stats {
  font-size: 13px;
  color: #86868b;
}

.exchange-stats b { color: #eb2f96; font-weight: 700; }

.btn-exchange {
  height: 40px !important;
  padding: 0 20px !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #eb2f96, #722ed1) !important;
  border: none !important;
  box-shadow: 0 4px 10px rgba(235, 47, 150, 0.2) !important;
}

/* Sidebar Styling */
.sidebar-v2 {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.glass-sidebar-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
}

.card-title-v2 {
  font-size: 18px;
  font-weight: 800;
  color: #1d1d1f;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.manage-link {
  font-size: 13px;
  color: #eb2f96;
  font-weight: 600;
}

.premium-calendar :deep(.ant-picker-calendar-header) {
  padding: 0 0 16px 0;
}

.premium-calendar :deep(.ant-picker-panel) {
  border: none !important;
}

.premium-calendar :deep(.ant-picker-cell-inner) {
  border-radius: 8px !important;
}

.calendar-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dotted rgba(0, 0, 0, 0.1);
}

.leg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #86868b;
  font-weight: 600;
}

.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.av { background: #52c41a; box-shadow: 0 0 6px rgba(82, 196, 26, 0.4); }
.dot.bs { background: #ff4d4f; box-shadow: 0 0 6px rgba(255, 77, 79, 0.4); }
.dot.pd { background: #faad14; box-shadow: 0 0 6px rgba(250, 173, 20, 0.4); }

.creator-list-v2 {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.creator-item-v2 {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
}

.creator-item-v2:hover { transform: translateX(4px); }

.rank-badge {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #86868b;
  background: #f5f5f7;
}

.rank-1 { background: #fff1f0; color: #ff4d4f; }
.rank-2 { background: #fff7e6; color: #fa8c16; }
.rank-3 { background: #feffe6; color: #fadb14; }

.creator-avatar {
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.c-info { flex: 1; }
.c-name { font-size: 15px; font-weight: 700; color: #1d1d1f; }
.c-bio { font-size: 12px; color: #86868b; margin-top: 2px; }

.btn-follow-v2 {
  border-radius: 14px !important;
  font-weight: 600 !important;
  border-color: #f0f0f2 !important;
  color: #1d1d1f !important;
  height: 32px !important;
}

.btn-follow-v2:hover {
  border-color: #eb2f96 !important;
  color: #eb2f96 !important;
}

.btn-follow-v2.following {
  background: #f5f5f7 !important;
  color: #86868b !important;
  border-color: transparent !important;
}

.mt-32 { margin-top: 32px; }

/* Rules Modal */
.rules-content { padding: 8px 0; }
.rule-item { display: flex; gap: 20px; margin-bottom: 24px; }
.rule-icon {
  font-size: 24px;
  background: #fff0f6;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  flex-shrink: 0;
  color: #eb2f96;
}
.rule-detail h4 { margin: 0 0 6px 0; font-size: 17px; font-weight: 700; color: #1d1d1f; }
.rule-detail p { margin: 0; color: #86868b; line-height: 1.6; font-size: 14px; }

@media (max-width: 992px) {
  .main-container-v2 { padding: 0 20px; }
  .list-section-v2 { padding: 24px; border-radius: 24px; }
  .hero-content-v2 h1 { font-size: 40px; }
  .sidebar-v2 { margin-top: 24px; }
}

@media (max-width: 768px) {
  .header-content { padding: 0 16px; }
  .nav-links { gap: 4px; }
  .nav-item { padding: 0 10px; font-size: 13px; height: 32px; line-height: 32px; }
  .logo-text { font-size: 17px; }
  .logo-icon { font-size: 20px; }
  .user-area :deep(.ant-btn) { font-size: 12px; height: 32px; padding: 0 10px; }
  .zaowubi-display { display: none; }
  .exchange-hero-v2 { padding: 48px 20px; }
  .hero-content-v2 h1 { font-size: 34px; }
  .hero-content-v2 p { font-size: 16px; }
  .hero-action-row { flex-direction: column; gap: 12px; }
  .main-container-v2 { padding: 0 16px; }
  .list-section-v2 { padding: 20px; }
  .section-header-v2 { flex-direction: column; gap: 16px; }
  .category-chips { flex-wrap: wrap; }
  .premium-skill-card { border-radius: 16px; }
  .skill-title-v2 { font-size: 17px; }
  .creator-box { gap: 10px; }
}

@media (max-width: 480px) {
  .header-content { flex-wrap: wrap; gap: 6px; padding: 0 12px; }
  .logo { margin-right: 0; }
  .nav-links { order: 3; width: 100%; justify-content: center; gap: 2px; }
  .nav-item { font-size: 12px; padding: 0 6px; height: 28px; line-height: 28px; }
  .exchange-hero-v2 { padding: 36px 16px; }
  .hero-content-v2 h1 { font-size: 28px; }
  .hero-content-v2 p { font-size: 14px; margin-bottom: 24px; }
  .hero-badge { font-size: 11px; }
  .list-section-v2 { padding: 16px; border-radius: 16px; }
  .section-header-v2 h2 { font-size: 20px; }
  .skill-grid-v2 { grid-template-columns: 1fr; }
  .premium-skill-card { border-radius: 14px; }
  .card-inner-v2 { padding: 20px; }
  .card-top-v2 { flex-direction: column; align-items: flex-start; gap: 12px; }
  .card-footer-v2 { flex-direction: column; gap: 12px; }
  .btn-exchange { width: 100%; }
  .glass-sidebar-card { padding: 20px; border-radius: 20px; }
  .date-chip { min-width: 48px; padding: 6px 10px; }
}

/* --- 640px: mid-range fix --- */
@media (max-width: 640px) {
  .header-content { flex-wrap: wrap; gap: 6px; padding: 0 12px; }
  .logo { margin-right: 0; }
  .nav-links { width: 100%; justify-content: center; gap: 4px; }
  .nav-item { font-size: 12px; padding: 0 8px; height: 28px; line-height: 28px; }
  .user-area :deep(.ant-btn) { font-size: 11px; height: 28px; padding: 0 8px; }
  .zaowubi-display { display: none; }
  .exchange-hero-v2 { padding: 40px 20px; }
  .hero-content-v2 h1 { font-size: 32px; }
  .hero-content-v2 p { font-size: 15px; margin-bottom: 28px; }
  .hero-action-row { flex-direction: column; gap: 10px; align-items: stretch; }
  .hero-action-row .ant-btn { width: 100%; }
  .main-container-v2 { margin-top: -24px; padding: 0 14px; }
  .list-section-v2 { padding: 18px; border-radius: 20px; }
  .section-header-v2 { flex-direction: column; gap: 12px; }
  .section-header-v2 h2 { font-size: 22px; }
  .category-chips { flex-wrap: wrap; gap: 6px; }
  .skill-grid-v2 { gap: 16px; }
  .premium-skill-card { border-radius: 14px; }
  .card-inner-v2 { padding: 22px; }
  .card-top-v2 { flex-wrap: wrap; gap: 10px; }
  .price-badge { padding: 4px 12px; }
  .price-badge .val { font-size: 16px; }
  .skill-title-v2 { font-size: 18px; }
  .card-footer-v2 { flex-direction: column; gap: 10px; }
  .btn-exchange { width: 100%; }
  .sidebar-v2 { gap: 24px; }
  .glass-sidebar-card { padding: 22px; border-radius: 24px; }
  .card-title-v2 { font-size: 16px; }
  .premium-calendar { font-size: 12px; }
  .creator-list-v2 { gap: 14px; }
  .c-name { font-size: 13px; }
  .c-bio { font-size: 11px; }
  .rules-content { gap: 20px; }
  .rule-item { gap: 14px; }
  .rule-icon { width: 44px; height: 44px; font-size: 20px; }
  .rule-detail h4 { font-size: 15px; }
  .rule-detail p { font-size: 13px; }
}
</style>
