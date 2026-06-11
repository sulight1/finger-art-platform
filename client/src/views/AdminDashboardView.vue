<template>
  <div class="admin-dashboard">
    <a-layout class="admin-layout">
      <a-layout-sider width="240" class="admin-sider">
        <div class="admin-logo">
          <span class="logo-icon">🛡️</span>
          <span class="logo-text">管理后台</span>
        </div>
        <a-menu v-model:selectedKeys="selectedMenu" mode="inline" theme="light">
          <a-menu-item key="users">
            <template #icon><user-outlined /></template>
            用户管理
          </a-menu-item>
          <a-menu-item key="products">
            <template #icon><shop-outlined /></template>
            作品管理
          </a-menu-item>
          <a-menu-item key="skills">
            <template #icon><swap-outlined /></template>
            技能管理
          </a-menu-item>
          <a-menu-item key="stats">
            <template #icon><line-chart-outlined /></template>
            数据概览
          </a-menu-item>
          <a-menu-item key="settings">
            <template #icon><setting-outlined /></template>
            个人设置
          </a-menu-item>
        </a-menu>
        <div class="sider-footer">
          <a-button type="link" danger @click="handleLogout">退出登录</a-button>
        </div>
      </a-layout-sider>

      <a-layout-content class="admin-content">
        <div class="content-header">
          <h1>{{ currentMenuTitle }}</h1>
          <div class="admin-user">
            <a-avatar :src="userStore.userAvatar" />
            <span class="admin-name">{{ userStore.user?.username || '管理员' }}</span>
          </div>
        </div>

        <div class="data-view">
          <!-- Users Table -->
          <div v-if="selectedMenu[0] === 'users'" class="table-container">
            <a-table :dataSource="users" :columns="userColumns" :loading="loading" rowKey="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'avatar'">
                  <a-avatar :src="formatImageUrl(record.avatar)" />
                </template>
                <template v-if="column.key === 'role'">
                  <a-tag :color="getRoleColor(record.role)">{{ getRoleText(record.role) }}</a-tag>
                </template>
                <template v-if="column.key === 'action'">
                  <a-popconfirm title="确定删除该用户吗？" @confirm="handleDeleteUser(record.id)">
                    <a-button type="link" danger>删除</a-button>
                  </a-popconfirm>
                </template>
              </template>
            </a-table>
          </div>

          <!-- Products Table -->
          <div v-if="selectedMenu[0] === 'products'" class="table-container">
            <a-table :dataSource="products" :columns="productColumns" :loading="loading" rowKey="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'image'">
                  <a-image :width="60" :src="record.image || 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633'" />
                </template>
                <template v-if="column.key === 'status'">
                  <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-btns">
                    <a-space v-if="record.status === 'PENDING'">
                      <a-button type="link" @click="handleAudit(record.id, 'APPROVED')">通过</a-button>
                      <a-button type="link" danger @click="handleAudit(record.id, 'REJECTED')">拒绝</a-button>
                    </a-space>
                    <a-popconfirm title="确定删除该作品吗？" @confirm="handleDeleteProduct(record.id)">
                      <a-button type="link" danger>删除</a-button>
                    </a-popconfirm>
                  </div>
                </template>
              </template>
            </a-table>
          </div>

          <!-- Skills Table -->
          <div v-if="selectedMenu[0] === 'skills'" class="table-container">
            <a-table :dataSource="skills" :columns="skillColumns" :loading="loading" rowKey="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'avatar'">
                  <a-avatar :src="formatImageUrl(record.avatar)" />
                </template>
                <template v-if="column.key === 'zaowuBiCost'">
                  <span style="color: #fa8c16; font-weight: bold;">{{ record.zaowuBiCost }} 造物币</span>
                </template>
                <template v-if="column.key === 'status'">
                  <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-btns">
                    <a-space v-if="record.status === 'PENDING'">
                      <a-button type="link" @click="handleAuditSkill(record.id, 'APPROVED')">通过</a-button>
                      <a-button type="link" danger @click="handleAuditSkill(record.id, 'REJECTED')">拒绝</a-button>
                    </a-space>
                    <a-popconfirm title="确定删除该技能交换吗？" @confirm="handleDeleteSkill(record.id)">
                      <a-button type="link" danger>删除</a-button>
                    </a-popconfirm>
                  </div>
                </template>
              </template>
            </a-table>
          </div>

          <!-- Stats -->
          <div v-if="selectedMenu[0] === 'stats'" class="stats-container">
            <a-row :gutter="24">
              <a-col :span="4">
                <a-card class="stat-card">
                  <a-statistic title="总用户数" :value="users.length" />
                </a-card>
              </a-col>
              <a-col :span="4">
                <a-card class="stat-card">
                  <a-statistic title="总作品数" :value="products.length" />
                </a-card>
              </a-col>
              <a-col :span="4">
                <a-card class="stat-card">
                  <a-statistic title="总技能交换" :value="skills.length" />
                </a-card>
              </a-col>
              <a-col :span="4">
                <a-card class="stat-card">
                  <a-statistic title="待审核作品" :value="products.filter(p => p.status === 'PENDING').length" />
                </a-card>
              </a-col>
              <a-col :span="4">
                <a-card class="stat-card">
                  <a-statistic title="待审核技能" :value="skills.filter(s => s.status === 'PENDING').length" />
                </a-card>
              </a-col>
            </a-row>

            <a-row :gutter="24" class="charts-row">
              <a-col :span="12">
                <a-card title="用户角色分布" class="chart-card">
                  <div ref="userRoleChartRef" class="chart-container"></div>
                </a-card>
              </a-col>
              <a-col :span="12">
                <a-card title="作品分类统计" class="chart-card">
                  <div ref="productCategoryChartRef" class="chart-container"></div>
                </a-card>
              </a-col>
            </a-row>

            <a-row :gutter="24" class="charts-row">
              <a-col :span="12">
                <a-card title="技能分类分布" class="chart-card">
                  <div ref="skillCategoryChartRef" class="chart-container"></div>
                </a-card>
              </a-col>
              <a-col :span="12">
                <a-card title="作品人气排行 (Top 5)" class="chart-card">
                  <div ref="popularProductsChartRef" class="chart-container"></div>
                </a-card>
              </a-col>
            </a-row>

            <a-row :gutter="24" class="charts-row">
              <a-col :span="12">
                <a-card title="技能价值排行 (Top 5)" class="chart-card">
                  <div ref="skillValueChartRef" class="chart-container"></div>
                </a-card>
              </a-col>
              <a-col :span="12">
                <a-card title="用户贡献排行 (Top 5)" class="chart-card">
                  <div ref="userContributionChartRef" class="chart-container"></div>
                </a-card>
              </a-col>
            </a-row>
          </div>

          <!-- Settings -->
          <div v-if="selectedMenu[0] === 'settings'" class="settings-container">
            <div class="settings-card">
              <h2>个人资料设置</h2>
              <a-form layout="vertical">
                <a-form-item label="管理员头像">
                  <a-upload
                    name="file"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    action="http://localhost:3000/files/upload"
                    :before-upload="beforeUpload"
                    @change="handleAvatarUpload"
                  >
                    <img 
                      v-if="adminForm.avatar || userStore.user?.avatar" 
                      :key="adminForm.avatar || userStore.user?.avatar"
                      :src="formatImageUrl(adminForm.avatar || userStore.user?.avatar)" 
                      alt="avatar" 
                      style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" 
                    />
                    <div v-else>
                      <plus-outlined />
                      <div style="margin-top: 8px">上传头像</div>
                    </div>
                  </a-upload>
                  <div class="avatar-hint">建议尺寸 200x200，支持 jpg/png</div>
                </a-form-item>
                <a-form-item label="管理员名称">
                  <a-input v-model:value="adminForm.username" placeholder="请输入管理员名称" />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" :loading="saving" @click="saveAdminSettings">
                    保存修改
                  </a-button>
                </a-form-item>
              </a-form>
            </div>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts';
import { 
  UserOutlined, 
  ShopOutlined, 
  SwapOutlined,
  LineChartOutlined,
  SettingOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { getProducts, deleteProduct, auditProduct, ProductItem } from '../api/product';
import { getAllUsers, deleteUser, updateUser } from '../api/user';
import { getSkills, deleteSkill, auditSkill, type SkillItem } from '../api/skill-exchange';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();
const selectedMenu = ref(['users']);
const loading = ref(false);
const saving = ref(false);
const users = ref<any[]>([]);
const products = ref<ProductItem[]>([]);
const skills = ref<SkillItem[]>([]);

const userRoleChartRef = ref<HTMLElement | null>(null);
const productCategoryChartRef = ref<HTMLElement | null>(null);
const skillCategoryChartRef = ref<HTMLElement | null>(null);
const popularProductsChartRef = ref<HTMLElement | null>(null);
const skillValueChartRef = ref<HTMLElement | null>(null);
const userContributionChartRef = ref<HTMLElement | null>(null);

let userRoleChart: echarts.ECharts | null = null;
let productCategoryChart: echarts.ECharts | null = null;
let skillCategoryChart: echarts.ECharts | null = null;
let popularProductsChart: echarts.ECharts | null = null;
let skillValueChart: echarts.ECharts | null = null;
let userContributionChart: echarts.ECharts | null = null;

const adminForm = ref({
  username: '',
  avatar: ''
});

const initCharts = () => {
  if (selectedMenu.value[0] !== 'stats') return;

  nextTick(() => {
    if (userRoleChartRef.value && !userRoleChart) userRoleChart = echarts.init(userRoleChartRef.value);
    if (productCategoryChartRef.value && !productCategoryChart) productCategoryChart = echarts.init(productCategoryChartRef.value);
    if (skillCategoryChartRef.value && !skillCategoryChart) skillCategoryChart = echarts.init(skillCategoryChartRef.value);
    if (popularProductsChartRef.value && !popularProductsChart) popularProductsChart = echarts.init(popularProductsChartRef.value);
    if (skillValueChartRef.value && !skillValueChart) skillValueChart = echarts.init(skillValueChartRef.value);
    if (userContributionChartRef.value && !userContributionChart) userContributionChart = echarts.init(userContributionChartRef.value);
    
    updateCharts();
  });
};

const updateCharts = () => {
  if (userRoleChart) {
    const roleCounts = users.value.reduce((acc: any, user: any) => {
      const text = getRoleText(user.role);
      acc[text] = (acc[text] || 0) + 1;
      return acc;
    }, {});

    userRoleChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '5%', left: 'center' },
      series: [{
        name: '用户角色',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: Object.entries(roleCounts).map(([name, value]) => ({ name, value }))
      }]
    });
  }

  if (productCategoryChart) {
    const categoryCounts = products.value.reduce((acc: any, p: any) => {
      const name = getCategoryLabel(p.category);
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    productCategoryChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: Object.keys(categoryCounts) },
      yAxis: { type: 'value' },
      series: [{
        data: Object.values(categoryCounts),
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#eb2f96' },
            { offset: 1, color: '#722ed1' }
          ])
        }
      }]
    });
  }

  if (skillCategoryChart) {
    const skillCats = skills.value.reduce((acc: any, s: any) => {
      acc[s.category || '未分类'] = (acc[s.category || '未分类'] || 0) + 1;
      return acc;
    }, {});

    skillCategoryChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '5%', left: 'center' },
      series: [{
        name: '技能分类',
        type: 'pie',
        radius: '60%',
        data: Object.entries(skillCats).map(([name, value]) => ({ name, value })),
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
      }]
    });
  }

  if (popularProductsChart) {
    const sortedProducts = [...products.value]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 5)
      .reverse();

    popularProductsChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: sortedProducts.map(p => p.title.substring(0, 8) + '...') },
      series: [{
        name: '点赞数',
        type: 'bar',
        data: sortedProducts.map(p => p.likes || 0),
        itemStyle: { color: '#722ed1' },
        label: { show: true, position: 'right' }
      }]
    });
  }

  if (skillValueChart) {
    const sortedSkills = [...skills.value]
      .sort((a, b) => (b.zaowuBiCost || 0) - (a.zaowuBiCost || 0))
      .slice(0, 5);

    skillValueChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: sortedSkills.map(s => s.title.substring(0, 6) + '...') },
      yAxis: { type: 'value', name: '造物币' },
      series: [{
        name: '价值',
        type: 'bar',
        data: sortedSkills.map(s => s.zaowuBiCost || 0),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fa8c16' },
            { offset: 1, color: '#ffd666' }
          ])
        },
        label: { show: true, position: 'top' }
      }]
    });
  }

  if (userContributionChart) {
    // Count contributions per user
    const userStats: Record<string, number> = {};
    
    products.value.forEach(p => {
      const name = p.creator || '未知用户';
      userStats[name] = (userStats[name] || 0) + 1;
    });
    
    skills.value.forEach(s => {
      const name = s.username || '未知用户';
      userStats[name] = (userStats[name] || 0) + 1;
    });

    const sortedContributors = Object.entries(userStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reverse();

    userContributionChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value', name: '发布数量' },
      yAxis: { type: 'category', data: sortedContributors.map(c => c[0]) },
      series: [{
        name: '总发布数',
        type: 'bar',
        data: sortedContributors.map(c => c[1]),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#1890ff' },
            { offset: 1, color: '#36cfc9' }
          ])
        },
        label: { show: true, position: 'right' }
      }]
    });
  }
};

const getCategoryLabel = (cat: string | undefined) => {
  const map: Record<string, string> = {
    crochet: '钩织', resin: '滴胶', nails: '穿戴甲',
    clay: '粘土', flower: '缠花'
  };
  return map[cat || ''] || '未分类';
};

const syncAdminForm = () => {
  if (userStore.user) {
    adminForm.value.username = userStore.user.username || '';
    adminForm.value.avatar = userStore.user.avatar || '';
  }
};

const handleAvatarUpload = (info: any) => {
  if (info.file.status === 'uploading') {
    return;
  }
  if (info.file.status === 'done') {
    const response = info.file.response;
    console.log('Upload response:', response);
    if (response && response.code === 200) {
      adminForm.value.avatar = response.data;
      message.success('头像上传成功');
    } else {
      message.error(response?.message || '头像上传失败');
    }
  } else if (info.file.status === 'error') {
    console.error('Upload error:', info.file.error);
    message.error('文件上传网络错误');
  }
};

const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/gif';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG/WEBP/GIF 格式的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const saveAdminSettings = async () => {
  if (!adminForm.value.username) {
    message.warning('用户名不能为空');
    return;
  }
  if (!userStore.user?.id) {
    message.error('未找到用户信息，请尝试重新登录');
    return;
  }
  saving.value = true;
  console.log('Saving admin settings:', {
    id: userStore.user.id,
    username: adminForm.value.username,
    avatar: adminForm.value.avatar
  });
  try {
    const updatedUser = await updateUser(userStore.user.id, {
      username: adminForm.value.username,
      avatar: adminForm.value.avatar
    });
    console.log('Update success:', updatedUser);
    userStore.updateUserInfo(updatedUser);
    message.success('个人资料已更新');
  } catch (err: any) {
    console.error('保存管理员设置失败:', err);
    const errorMsg = err.response?.data?.message || err.message || '保存失败';
    message.error(errorMsg);
  } finally {
    saving.value = false;
  }
};

const handleResize = () => {
  userRoleChart?.resize();
  productCategoryChart?.resize();
  skillCategoryChart?.resize();
  popularProductsChart?.resize();
  skillValueChart?.resize();
  userContributionChart?.resize();
};

watch(() => selectedMenu.value, (newVal) => {
  if (newVal[0] === 'settings') {
    syncAdminForm();
  }
  if (newVal[0] === 'stats') {
    initCharts();
  }
}, { immediate: true });

watch([users, products, skills], () => {
  if (selectedMenu.value[0] === 'stats') {
    updateCharts();
  }
}, { deep: true });

const currentMenuTitle = computed(() => {
  const titles: Record<string, string> = {
    users: '用户管理',
    products: '作品管理',
    skills: '技能管理',
    stats: '数据概览',
    settings: '个人设置'
  };
  return titles[selectedMenu.value[0]];
});

const userColumns = [
  { title: '头像', key: 'avatar', width: 80 },
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '角色', key: 'role' },
  { title: '操作', key: 'action' }
];

const skillColumns = [
  { title: '发布者头像', key: 'avatar', width: 100 },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '技能标题', dataIndex: 'title', key: 'title' },
  { title: '分类', dataIndex: 'category', key: 'category' },
  { title: '造物币', key: 'zaowuBiCost' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'action' }
];

const productColumns = [
  { title: '作品图片', key: 'image', width: 120 },
  { title: '名称', dataIndex: 'title', key: 'title' },
  { title: '价格', dataIndex: 'price', key: 'price' },
  { title: '创作者', dataIndex: 'creator', key: 'creator' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action' }
];

const fetchData = async () => {
  loading.value = true;
  try {
    const [userData, productData, skillData] = await Promise.all([
      getAllUsers(),
      getProducts(),
      getSkills()
    ]);
    users.value = userData;
    products.value = productData;
    skills.value = skillData;
  } catch (err) {
    message.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
  syncAdminForm();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  userRoleChart?.dispose();
  productCategoryChart?.dispose();
  skillCategoryChart?.dispose();
  popularProductsChart?.dispose();
  skillValueChart?.dispose();
  userContributionChart?.dispose();
});

const handleDeleteUser = async (id: number) => {
  try {
    await deleteUser(id);
    message.success('用户已删除');
    fetchData();
  } catch (err) {
    message.error('删除失败');
  }
};

const handleDeleteSkill = async (id: number) => {
  try {
    await deleteSkill(id);
    message.success('技能已删除');
    fetchData();
  } catch (err) {
    message.error('删除失败');
  }
};

const handleAuditSkill = async (id: number, status: string) => {
  try {
    await auditSkill(id, status);
    message.success(status === 'APPROVED' ? '技能已通过审核' : '技能已拒绝');
    fetchData();
  } catch (err) {
    message.error('操作失败');
  }
};

const handleDeleteProduct = async (id: number) => {
  try {
    await deleteProduct(id);
    message.success('作品已删除');
    fetchData();
  } catch (err) {
    message.error('删除失败');
  }
};

const handleAudit = async (id: number, status: string) => {
  try {
    await auditProduct(id, status);
    message.success(status === 'APPROVED' ? '作品已通过审核' : '作品已拒绝');
    fetchData();
  } catch (err) {
    message.error('操作失败');
  }
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};

const formatImageUrl = (url: string | undefined) => {
  if (!url) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4';
  if (url.startsWith('http')) return url;
  return `http://localhost:3000${url}`;
};

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = { ADMIN: 'red', USER: 'blue', BUYER: 'blue', ARTISAN: 'blue', CREATOR: 'blue' };
  return colors[role] || 'default';
};

const getRoleText = (role: string) => {
  const texts: Record<string, string> = { ADMIN: '管理员', USER: '普通用户', BUYER: '普通用户', ARTISAN: '普通用户', CREATOR: '普通用户' };
  return texts[role] || '普通用户';
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'orange',
    APPROVED: 'green',
    REJECTED: 'red'
  };
  return colors[status] || 'default';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    PENDING: '待审核',
    APPROVED: '已通过',
    REJECTED: '已拒绝'
  };
  return texts[status] || status;
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.admin-sider {
  background: white;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.admin-logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.logo-icon { font-size: 24px; margin-right: 12px; }
.logo-text { font-size: 18px; font-weight: 700; color: #eb2f96; }

.sider-footer {
  margin-top: auto;
  padding: 16px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.admin-content {
  padding: 24px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.content-header h1 { margin: 0; font-size: 20px; font-weight: 600; }

.admin-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-name { font-weight: 500; color: #595959; }

.table-container {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.charts-row {
  margin-top: 24px;
}

.chart-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.chart-container {
  height: 350px;
  width: 100%;
}

.settings-container {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.settings-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 500px;
}

.settings-card h2 {
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  text-align: center;
}

.avatar-hint {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 8px;
}

.avatar-uploader :deep(.ant-upload) {
  width: 128px;
  height: 128px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
