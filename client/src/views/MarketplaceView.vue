<template>
  <div class="marketplace-container">
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
            <!-- Mobile-only items inside drawer -->
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
                  <a-button danger block @click="handleLogout">退出</a-button>
                </template>
                <template v-else>
                  <a-button type="dashed" block @click="menuOpen = false; $router.push('/artisan-dashboard')">我的小店</a-button>
                  <a-button type="primary" block @click="menuOpen = false; showPublishModal = true">发布作品</a-button>
                  <a-button block @click="menuOpen = false; showCopywriting = true">🤖 文案</a-button>
                  <a-button block @click="menuOpen = false; showInspireDraw = true">🎨 绘图</a-button>
                  <a-button danger block @click="handleLogout">退出登录</a-button>
                </template>
              </template>
              <template v-else>
                <a-button type="primary" block @click="menuOpen = false; $router.push('/login')">登录 / 注册</a-button>
              </template>
            </div>
          </div>
          <div class="hamburger" :class="{ active: menuOpen }" @click="menuOpen = !menuOpen"><span></span><span></span><span></span></div>

          <div class="user-area">
            <!-- 管理员 — 只保留后台管理 -->
            <template v-if="userStore.isAdmin">
              <a-button type="primary" shape="round" @click="$router.push('/admin')">🛡️ 管理后台</a-button>
              <a-button type="text" @click="handleLogout">退出</a-button>
            </template>

            <!-- 普通用户 — 全部功能 -->
            <template v-else-if="userStore.isLoggedIn">
              <a-button type="dashed" shape="round" @click="$router.push('/artisan-dashboard')" style="margin-right: 8px">
                我的小店
              </a-button>
              <a-button type="primary" shape="round" @click="showPublishModal = true" style="margin-right: 8px">
                发布作品
              </a-button>
              <a-button shape="round" @click="showCopywriting = true" style="margin-right: 4px; background: #fdf2f8; border-color: #fce4ec; color: #eb2f96">
                🤖 文案
              </a-button>
              <a-button shape="round" @click="showInspireDraw = true" style="margin-right: 8px; background: #f9f0ff; border-color: #efdbff; color: #722ed1">
                🎨 绘图
              </a-button>
              <a-dropdown>
                <div class="user-profile">
                  <a-avatar :src="userStore.userAvatar" />
                  <span class="user-name">{{ userStore.user?.username }}</span>
                </div>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="logout" @click="handleLogout" danger>退出登录</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>

            <!-- 未登录 — 登录/注册 -->
            <template v-else>
              <a-button type="text" @click="$router.push('/login')">登录 / 注册</a-button>
            </template>
          </div>
        </div>
      </a-layout-header>

      <a-layout>
        <!-- Sidebar Filters -->
        <a-layout-sider width="260" class="sider">
          <div class="filter-section">
            <h3>作品分类</h3>
            <a-menu
              v-model:selectedKeys="selectedCategory"
              mode="inline"
              :style="{ borderRight: 0 }"
            >
              <a-menu-item key="all">全部作品</a-menu-item>
              <a-menu-item key="crochet">🧶 钩织系列</a-menu-item>
              <a-menu-item key="resin">💎 滴胶干花</a-menu-item>
              <a-menu-item key="nails">💅 精致穿戴甲</a-menu-item>
              <a-menu-item key="clay">🏺 软陶超轻粘土</a-menu-item>
              <a-menu-item key="flower">🌸 古法缠花</a-menu-item>
            </a-menu>
          </div>

          <div class="filter-section">
            <h3>🔧 制作工艺</h3>
            <a-select v-model:value="craftFilter" placeholder="选择工艺" allow-clear style="width:100%">
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="t in craftTechniques" :key="t.name" :value="t.name">{{ t.label }}</a-select-option>
            </a-select>
          </div>

          <div class="filter-section">
            <h3>价格区间</h3>
            <div class="price-range">
              <a-slider range v-model:value="priceRange" :max="2000" />
              <div class="price-inputs">
                <span>￥{{ priceRange[0] }}</span>
                <span>￥{{ priceRange[1] }}</span>
              </div>
            </div>
          </div>

          <div class="filter-section">
            <h3>作品类型</h3>
            <a-checkbox-group v-model:value="productTypes" class="vertical-checkbox">
              <a-checkbox value="ready">成品</a-checkbox>
              <a-checkbox value="custom">支持定制</a-checkbox>
            </a-checkbox-group>
          </div>
        </a-layout-sider>

        <!-- Main Content -->
        <a-layout-content class="content">
          <div class="marketplace-hero">
            <div class="hero-mesh-bg">
              <div class="mesh-blob blob-1"></div>
              <div class="mesh-blob blob-2"></div>
              <div class="mesh-blob blob-3"></div>
            </div>
            <div class="hero-noise"></div>
            <div class="hero-decorations">
              <span class="decor-icon icon-1">🧶</span>
              <span class="decor-icon icon-2">✨</span>
              <span class="decor-icon icon-3">🎨</span>
              <span class="decor-icon icon-4">💎</span>
            </div>

            <div class="hero-text-content">
              <div class="hero-badge">✨ DISCOVER UNIQUE CRAFTS</div>
              <h1>探索指尖上的无限可能</h1>
              <p>发现全球手作艺人的匠心之作，定制属于你的独一无二</p>
            </div>
            <div class="hero-search">
              <a-input-search
                v-model:value="searchQuery"
                placeholder="搜索你感兴趣的作品..."
                enter-button
                size="large"
                @search="onSearch"
              />
            </div>
          </div>

          <div class="content-body-wrapper">
            <div class="content-header">
              <div class="breadcrumb">
                <a-breadcrumb>
                  <a-breadcrumb-item>首页</a-breadcrumb-item>
                  <a-breadcrumb-item>造物市集</a-breadcrumb-item>
                </a-breadcrumb>
                <h2>{{ currentCategoryName }}</h2>
              </div>
              <div class="sort-options">
                <span class="sort-label">排序方式</span>
                <a-select v-model:value="sortBy" style="width: 140px" class="premium-select">
                  <a-select-option value="recommend">🔥 推荐优先</a-select-option>
                  <a-select-option value="newest">🆕 最新上架</a-select-option>
                  <a-select-option value="price-asc">📈 价格升序</a-select-option>
                  <a-select-option value="price-desc">📉 价格降序</a-select-option>
                </a-select>
              </div>
            </div>

            <div class="product-grid">
              <a-spin :spinning="loading">
                <a-list :grid="{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }" :data-source="paginatedProducts">
                  <template #renderItem="{ item }">
                    <a-list-item class="reveal">
                      <a-card hoverable class="glass-product-card" @click="showDetail(item)">
                        <template #cover>
                          <div class="product-image-wrapper">
                            <img :alt="item.title" :src="formatImageUrl(item.image)" class="zoom-image" />
                            <div class="status-overlay" v-if="item.isCustom">
                              <span class="status-tag">定制</span>
                            </div>
                            <div class="card-hover-actions">
                              <div class="action-btn-circle" @click.stop="handleLike(item)">
                                <heart-filled v-if="item.isLiked" style="color: #eb2f96" />
                                <heart-outlined v-else />
                              </div>
                            </div>
                          </div>
                        </template>
                        <div class="product-card-info">
                          <h3 class="product-title">{{ item.title }}</h3>
                          <div class="product-bottom">
                            <div class="price-tag">
                              <span class="currency">￥</span>
                              <span class="amount">{{ item.price }}</span>
                            </div>
                            <div class="creator-mini">
                              <a-avatar :size="24" :src="item.creatorAvatar" />
                              <span class="name">{{ item.creator }}</span>
                            </div>
                          </div>
                          <div class="craft-tag-wrapper" v-if="item.craftTechnique">
                            <span class="craft-tag">{{ item.craftTechnique }}</span>
                          </div>
                        </div>
                      </a-card>
                    </a-list-item>
                  </template>
                </a-list>
              </a-spin>
              <div v-if="!loading && products.length === 0" class="empty-state-glass">
                <a-empty description="暂时没有发现心仪的造物" />
              </div>
            </div>
            
            <div class="pagination">
              <a-pagination v-model:current="currentPage" :total="totalProducts" :page-size="pageSize" show-less-items />
            </div>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <!-- Publish Product Modal -->
    <a-modal v-model:open="showPublishModal" title="发布匠心之作" @ok="handlePublishSubmit" :confirmLoading="publishing" width="700px">
      <template #extra>
        <a-button type="link" @click="showCopywriting = true" style="color: #eb2f96">
          🤖 AI 生成文案
        </a-button>
      </template>
      <a-form layout="vertical">
        <a-form-item label="作品名称" required>
          <a-input v-model:value="publishForm.title" placeholder="给你的作品起个好听的名字" />
        </a-form-item>
        <a-form-item label="作品售价 (￥)" required>
          <a-input-number v-model:value="publishForm.price" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="作品类型">
          <a-radio-group v-model:value="publishForm.type">
            <a-radio value="READY_MADE">成品</a-radio>
            <a-radio value="CUSTOMIZABLE">支持定制</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="作品分类" required>
          <a-select v-model:value="publishForm.category" placeholder="选择作品分类" @change="onPublishCategoryChange">
            <a-select-option value="crochet">🧶 钩织系列</a-select-option>
            <a-select-option value="resin">💎 滴胶干花</a-select-option>
            <a-select-option value="nails">💅 精致穿戴甲</a-select-option>
            <a-select-option value="clay">🏺 软陶超轻粘土</a-select-option>
            <a-select-option value="flower">🌸 古法缠花</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="作品图片" required>
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="http://localhost:3000/files/upload"
            accept="image/*"
            :before-upload="beforeUpload"
            @change="handleUploadChange"
          >
            <img v-if="publishForm.image" :src="formatImageUrl(publishForm.image)" alt="product" style="width: 100%" />
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="制作工艺">
          <a-select v-model:value="publishForm.craftTechnique" placeholder="选择制作工艺" allow-clear :disabled="!publishForm.category">
            <a-select-option v-for="t in publishTechniques" :key="t.name" :value="t.name">{{ t.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="创作者名称">
          <a-input v-model:value="publishForm.creator" placeholder="默认使用当前用户名" />
        </a-form-item>
        <a-form-item label="作品描述">
          <a-textarea v-model:value="publishForm.description" placeholder="简单介绍一下你的作品（选填）" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- AI 功能弹窗 -->
    <AICopywriting v-model:open="showCopywriting" />
    <AIInspireDraw v-model:open="showInspireDraw" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { 
  BellOutlined, 
  HeartOutlined, 
  HeartFilled,
  PlusOutlined,
  SearchOutlined,
  ShareAltOutlined,
  ShoppingOutlined,
  SafetyCertificateOutlined,
  CloseOutlined,
  MessageOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { 
  getProducts, 
  createProduct, 
  likeProduct, 
  getCraftTechniques, 
  type CraftTechniqueItem 
} from '../api/product';
import { createOrder } from '../api/order';
import { sendMessage } from '../api/message';
import { useUserStore } from '../stores/user';
import AICopywriting from '../components/AICopywriting.vue';
import AIInspireDraw from '../components/AIInspireDraw.vue';

const router = useRouter();
const userStore = useUserStore();

// ===== 搜索与筛选 =====
const searchQuery = ref('');
const selectedCategory = ref(['all']);
const priceRange = ref<[number, number]>([0, 2000]);
const productTypes = ref(['ready', 'custom']);
const sortBy = ref('recommend');

// ===== 筛选 =====
const craftFilter = ref('');
const craftTechniques = ref<CraftTechniqueItem[]>([]);

// 根据当前分类加载对应的制作工艺选项
const loadCraftTechniques = async (category?: string) => {
  try {
    const data = await getCraftTechniques(category);
    craftTechniques.value = data;
  } catch {
    craftTechniques.value = [];
  }
};

const currentPage = ref(1);
const showCustomModal = ref(false);
const showPublishModal = ref(false);
const showCopywriting = ref(false);
const showInspireDraw = ref(false);
const menuOpen = ref(false);
const loading = ref(false);
const publishing = ref(false);
const products = ref<any[]>([]);
const totalProducts = ref(0);
const pageSize = ref(12);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return products.value.slice(start, end);
});

// 发布表单用工艺列表
const publishTechniques = ref<CraftTechniqueItem[]>([]);

const onPublishCategoryChange = async (category: string) => {
  publishForm.value.craftTechnique = '';
  if (category) {
    try {
      publishTechniques.value = await getCraftTechniques(category);
    } catch {
      publishTechniques.value = [];
    }
  } else {
    publishTechniques.value = [];
  }
};

const beforeUpload = (file: any) => {
  const isImage = file.type?.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件');
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('图片大小不能超过 5MB');
    return false;
  }

  return true;
};

const handleUploadChange = (info: any) => {
  if (info.file.status === 'done') {
    const response = info.file.response;
    const imageUrl = response?.data?.url || response?.data || response?.url;

    if ((response?.code === 200 || response?.success) && imageUrl) {
      publishForm.value.image = imageUrl;
      message.success('图片上传成功');
    } else {
      publishForm.value.image = '';
      message.error(response?.message || '图片上传失败');
    }
  } else if (info.file.status === 'error') {
    publishForm.value.image = '';
    message.error('图片上传失败');
  }
};

const formatImageUrl = (url: string | undefined) => {
  if (!url) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=User&backgroundColor=ffdfbf';
  if (url.startsWith('http')) return url;
  return `http://localhost:3000${url}`;
};

const handleLogout = () => { userStore.logout(); router.push('/login'); };

const showDetail = (product: any) => {
  router.push(`/product/${product.id}`);
};

// ===== 发布表单 =====
const publishForm = ref({
  title: '',
  price: 0,
  type: 'READY_MADE',
  category: '',
  craftTechnique: '',
  creator: '',
  image: '',
  description: '',
});

// 定制需求表单
const customForm = ref({
  title: '', category: '', budgetMin: 10, budgetMax: 200, deadline: '', description: ''
});

const categoryMap: Record<string, string> = {
  all: '全部作品', crochet: '钩织系列', resin: '滴胶干花',
  nails: '精致穿戴甲', clay: '软陶超轻粘土', flower: '古法缠花'
};

const currentCategoryName = computed(() => categoryMap[selectedCategory.value[0]] || '全部作品');

// 监听分类选择 —— 动态加载对应工艺选项
watch(selectedCategory, async () => {
  const cat = selectedCategory.value[0];
  craftFilter.value = '';
  if (cat && cat !== 'all') {
    await loadCraftTechniques(cat);
  } else {
    await loadCraftTechniques();
  }
  fetchProducts();
});

// ===== 商品加载 =====
const fetchProducts = async (resetPage = true) => {
  if (resetPage) currentPage.value = 1;
  loading.value = true;
  try {
    // 根据 productTypes 构建 type 查询参数
    let typeParam: string | undefined;
    if (productTypes.value.length === 1) {
      if (productTypes.value[0] === 'ready') typeParam = 'READY_MADE';
      else if (productTypes.value[0] === 'custom') typeParam = 'CUSTOMIZABLE';
    }
    // 根据 selectedCategory 构建 category 查询参数
    const categoryParam = selectedCategory.value[0] === 'all' ? undefined : selectedCategory.value[0];
    const data = await getProducts({ scope: 'approved', type: typeParam, category: categoryParam, craftTechnique: craftFilter.value || undefined });
    let filtered = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price),
      type: item.type,
      category: item.category,
      creator: item.creator || '未知作者',
      creatorId: item.creatorId,
      creatorAvatar: formatImageUrl(item.creatorAvatar),
      image: item.image || 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      isCustom: item.type === 'CUSTOMIZABLE',
      likes: item.likes || 0,
      isLiked: false,
      status: item.status,
      craftTechnique: item.craftTechnique,
    }));

    // 搜索过滤（仅在输入搜索词时）
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.creator.toLowerCase().includes(q));
    }
    // 价格过滤
    filtered = filtered.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy.value) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'newest': return b.id - a.id;
        case 'recommend': return b.likes - a.likes; // 推荐优先：按点赞数降序
        default: return 0;
      }
    });

    totalProducts.value = filtered.length;
    products.value = filtered;
  } catch (err) {
    console.error('加载商品失败', err);
  } finally {
    loading.value = false;
  }
};

// 监听筛选条件变化
watch(priceRange, () => fetchProducts(), { deep: true });
watch(productTypes, () => fetchProducts(), { deep: true });
watch(sortBy, () => fetchProducts());
// 用户手动选择工艺时重新请求后端
watch(craftFilter, () => fetchProducts());

// ===== Reveal Animation Logic =====
const initObserver = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

watch(() => products.value, async () => {
  await nextTick();
  initObserver();
}, { deep: true });

onMounted(async () => {
  // 初始加载全部工艺选项
  await loadCraftTechniques();
  await fetchProducts();
  await nextTick();
  initObserver();
});

// 监听 AI 文案弹窗关闭 → 自动打开发布弹窗
watch(showCopywriting, (val) => {
  if (!val) {
    const saved = localStorage.getItem('ai_copywriting');
    if (saved) {
      showPublishModal.value = true;
    }
  }
});

// 监听发布弹窗打开 → 检查 AI 文案和图片
watch(showPublishModal, (val) => {
  if (val) {
    const savedCopy = localStorage.getItem('ai_copywriting');
    if (savedCopy) {
      try {
        const data = JSON.parse(savedCopy);
        publishForm.value.title = data.title || '';
        publishForm.value.description = data.description || '';
        localStorage.removeItem('ai_copywriting');
      } catch {}
    }
    
    const savedImage = localStorage.getItem('ai_generated_image');
    if (savedImage) {
      publishForm.value.image = savedImage;
      localStorage.removeItem('ai_generated_image');
    }
  }
});

// 监听求定制弹窗打开 → 检查 AI 文案
watch(showCustomModal, (val) => {
  if (val) {
    const saved = localStorage.getItem('ai_copywriting');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        customForm.value.title = data.title || '';
        customForm.value.description = data.description || '';
        localStorage.removeItem('ai_copywriting');
      } catch {}
    }
  }
});

const onSearch = (val: string) => {
  searchQuery.value = val;
  fetchProducts();
};

const handlePublishSubmit = async () => {
  if (!publishForm.value.title || publishForm.value.price <= 0 || !publishForm.value.category || !publishForm.value.image) {
    message.warning('请填写完整的作品信息（名称、价格、分类并上传图片）');
    return;
  }
  publishing.value = true;
  try {
    await createProduct({
      title: publishForm.value.title,
      price: publishForm.value.price,
      type: publishForm.value.type,
      category: publishForm.value.category,
      craftTechnique: publishForm.value.craftTechnique || undefined,
      creatorId: userStore.user?.id,
      creator: publishForm.value.creator || userStore.user?.username || '神秘创作者',
      image: publishForm.value.image,
      description: publishForm.value.description,
    });
    message.success('作品发布成功！等待管理员审核后即可上架。');
    showPublishModal.value = false;
    publishForm.value = { title: '', price: 0, type: 'READY_MADE', category: '', craftTechnique: '', creator: '', image: '', description: '' };
    publishTechniques.value = [];
    fetchProducts();
  } catch (err) {
    console.error('发布失败', err);
  } finally {
    publishing.value = false;
  }
};

const handleLike = async (item: any) => {
  try {
    const updated = await likeProduct(item.id);
    item.likes = updated.likes;
    item.isLiked = true;
    message.success('点赞成功！✨');
  } catch (err) {
    console.error('点赞失败', err);
  }
};
</script>

<style scoped>
/* ========== Layout & General ========== */
.marketplace-container {
  background: #fff;
  min-height: 100vh;
  overflow-x: hidden;
}

.layout { background: transparent; }

/* ========== Shared Header ========== */
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
.logo { display: flex; align-items: center; cursor: pointer; margin-right: 48px; gap: 6px; }
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
.user-area { display: flex; align-items: center; gap: 16px; margin-left: auto; }
.login-btn { color: #595959; }
.start-btn { border-radius: 8px; height: 40px; padding: 0 24px; }

/* Hamburger menu */
.hamburger { display: none; flex-direction: column; gap: 4px; cursor: pointer; padding: 6px; z-index: 1100; margin-left: auto; }
.hamburger span { display: block; width: 22px; height: 2px; background: #595959; border-radius: 2px; transition: all 0.3s; }
.hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }
.mobile-drawer-extra { display: none; }
.drawer-divider { display: none; }
.drawer-user-profile { display: none; }
.drawer-user-name { display: none; }

/* Drawer overlay backdrop */
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

/* Hero search bar */
.hero-search {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  position: relative;
  z-index: 2;
}
.hero-search :deep(.ant-input-search) {
  max-width: 520px;
  width: 100%;
  border-radius: 100px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(235, 47, 150, 0.10);
}
.hero-search :deep(.ant-input) {
  height: 50px;
  border: none !important;
  background: rgba(255,255,255,0.9);
  padding-left: 20px;
  font-size: 15px;
}
.hero-search :deep(.ant-input:focus) {
  background: #fff;
}
.hero-search :deep(.ant-btn) {
  height: 50px;
  padding: 0 28px;
  border-radius: 0 100px 100px 0 !important;
  background: linear-gradient(135deg, #eb2f96, #722ed1);
  border: none;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.hero-search :deep(.ant-btn:hover) {
  opacity: 0.9;
}

.user-profile {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 14px; border-radius: 100px;
  background: rgba(235,47,150,0.04);
  cursor: pointer; transition: all 0.3s;
}
.user-profile:hover { background: rgba(235,47,150,0.08); transform: translateY(-1px); }
.user-name { font-weight: 600; font-size: 14px; color: #1d1d1f; }

/* ========== Sidebar (Glassmorphism) ========== */
.sider {
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(0,0,0,0.05);
  padding: 40px 0;
  height: calc(100vh - 72px);
  position: sticky;
  top: 72px;
  overflow-y: auto;
}

.filter-section {
  padding: 0 24px 32px;
}
.filter-section h3 {
  font-size: 12px;
  font-weight: 800;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-section :deep(.ant-menu) { background: transparent; border: none; }
.filter-section :deep(.ant-menu-item) {
  height: 44px !important;
  line-height: 44px !important;
  margin: 4px 0 !important;
  border-radius: 12px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #424245 !important;
  transition: all 0.3s !important;
}
.filter-section :deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, #eb2f96, #722ed1) !important;
  color: #fff !important;
  box-shadow: 0 8px 16px rgba(235,47,150,0.2) !important;
}

.price-inputs {
  display: flex; justify-content: space-between;
  margin-top: 12px; font-weight: 700; color: #1d1d1f; font-size: 14px;
}

.vertical-checkbox { display: flex; flex-direction: column; gap: 12px; }
.vertical-checkbox :deep(.ant-checkbox-wrapper) { font-weight: 500; color: #424245; }

/* ========== Marketplace Hero (Premium) ========== */
.marketplace-hero {
  position: relative;
  padding: 80px 40px 100px;
  text-align: center;
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.03);
}

.hero-mesh-bg {
  position: absolute; inset: 0; z-index: 0; filter: blur(100px); opacity: 0.5;
}
.mesh-blob {
  position: absolute; border-radius: 50%;
  animation: blobFloat 20s infinite alternate ease-in-out;
}
.blob-1 { width: 400px; height: 400px; background: #fff0f6; top: -100px; right: 10%; }
.blob-2 { width: 350px; height: 350px; background: #f9f0ff; bottom: -50px; left: 5%; animation-delay: -5s; }
.blob-3 { width: 300px; height: 300px; background: #e6f7ff; top: 20%; left: 30%; animation-delay: -10s; }

@keyframes blobFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, -40px) scale(1.1); }
}

.hero-noise {
  position: absolute; inset: 0; z-index: 1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.02; pointer-events: none;
}

.hero-decorations .decor-icon {
  position: absolute; font-size: 24px; z-index: 2;
  animation: floatDecor 8s infinite ease-in-out;
}
.icon-1 { top: 20%; left: 15%; animation-delay: 0s; }
.icon-2 { top: 15%; right: 20%; animation-delay: -2s; }
.icon-3 { bottom: 25%; left: 25%; animation-delay: -4s; }
.icon-4 { bottom: 20%; right: 15%; animation-delay: -6s; }

@keyframes floatDecor {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

.hero-text-content { position: relative; z-index: 10; max-width: 800px; margin: 0 auto; }
.hero-badge {
  display: inline-block; padding: 6px 16px; border-radius: 100px;
  background: rgba(235,47,150,0.06); color: #eb2f96;
  font-size: 12px; font-weight: 800; letter-spacing: 1px; margin-bottom: 24px;
}
.hero-text-content h1 {
  font-size: 48px; font-weight: 900; color: #1d1d1f;
  margin-bottom: 16px; letter-spacing: -1px;
}
.hero-text-content p { font-size: 18px; color: #86868b; font-weight: 500; }

/* ========== Content Body ========== */
.content-body-wrapper { padding: 40px; background: #fbfbfd; min-height: 600px; }

.content-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 40px; padding: 0 12px;
}
.breadcrumb h2 { font-size: 32px; font-weight: 800; color: #1d1d1f; margin-top: 8px; }

.sort-options { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.sort-label { font-size: 12px; font-weight: 700; color: #86868b; text-transform: uppercase; }

/* ========== Product Cards (Upgraded) ========== */
.glass-product-card {
  background: #fff !important;
  border: 1px solid rgba(0,0,0,0.04) !important;
  border-radius: 24px !important;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.glass-product-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important;
}

.product-image-wrapper { position: relative; height: 280px; overflow: hidden; }
.zoom-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
.glass-product-card:hover .zoom-image { transform: scale(1.1); }

.status-overlay {
  position: absolute; top: 16px; left: 16px; z-index: 10;
}
.status-tag {
  background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);
  padding: 6px 14px; border-radius: 12px; font-weight: 700; font-size: 12px; color: #1d1d1f;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-hover-actions {
  position: absolute; top: 16px; right: 16px; z-index: 10;
  opacity: 0; transform: translateY(-10px); transition: all 0.3s ease;
}
.glass-product-card:hover .card-hover-actions { opacity: 1; transform: translateY(0); }

.action-btn-circle {
  width: 40px; height: 40px; border-radius: 50%;
  background: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 18px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s;
}
.action-btn-circle:hover { transform: scale(1.1); background: #fdf2f8; }

.product-card-info { padding: 20px; }
.product-title {
  font-size: 17px; font-weight: 700; color: #1d1d1f;
  margin-bottom: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.product-bottom { display: flex; justify-content: space-between; align-items: center; }

.price-tag { display: flex; align-items: baseline; color: #eb2f96; }
.price-tag .currency { font-size: 14px; font-weight: 800; margin-right: 2px; }
.price-tag .amount { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }

.creator-mini { display: flex; align-items: center; gap: 8px; }
.creator-mini .name { font-size: 13px; font-weight: 600; color: #86868b; }

.craft-tag-wrapper { margin-top: 14px; display: flex; gap: 6px; }
.craft-tag {
  font-size: 11px; font-weight: 700; color: #722ed1;
  background: #f9f0ff; padding: 4px 10px; border-radius: 6px;
}

/* ========== Reveal Animation ========== */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ========== Pagination ========== */
.pagination {
  margin-top: 60px; text-align: center; padding-bottom: 40px;
}
.pagination :deep(.ant-pagination-item-active) {
  border-color: #eb2f96;
}
.pagination :deep(.ant-pagination-item-active a) {
  color: #eb2f96;
}

/* ========== Empty State ========== */
.empty-state-glass {
  padding: 100px 0; text-align: center;
}

/* ========== Detail Modal ========== */
.detail-modal :deep(.ant-modal-content) {
  border-radius: 32px;
  overflow: hidden;
  padding: 0;
  background: rgba(255, 255, 255, 0.98);
}

.product-detail-container { padding: 40px; }

.detail-image-box img {
  width: 100%;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}

.detail-info-box { padding: 10px 0; }
.detail-header h2 { font-size: 32px; font-weight: 800; color: #1d1d1f; margin: 12px 0; }

.detail-price .symbol { font-size: 20px; font-weight: 800; color: #eb2f96; }
.detail-price .value { font-size: 40px; font-weight: 900; color: #eb2f96; }

.detail-section { margin-top: 32px; border-top: 1px solid #f5f5f7; pt: 24px; }
.detail-section h4 { font-size: 12px; font-weight: 800; color: #86868b; text-transform: uppercase; margin-bottom: 12px; }
.detail-section .description { font-size: 16px; color: #424245; line-height: 1.6; }

.creator-info-large { display: flex; align-items: center; gap: 16px; }
.creator-info-large .name { font-size: 18px; font-weight: 700; color: #1d1d1f; }
.creator-info-large .bio { font-size: 13px; color: #86868b; }

/* ===== Responsive ===== */
@media (max-width: 992px) {
  .hero-text-content h1 { font-size: 36px; }
  .hero-search :deep(.ant-input-search) { max-width: 100%; }
}

@media (max-width: 768px) {
  .header-content { padding: 0 16px; }
  .nav-links { gap: 4px; }
  .nav-item { padding: 0 10px; font-size: 13px; height: 32px; line-height: 32px; }
  .logo-text { font-size: 17px; }
  .logo-icon { font-size: 20px; }
  .user-area :deep(.ant-btn) { padding: 0 10px; font-size: 12px; height: 32px; }
  .user-area { gap: 8px; }
  .marketplace-hero { padding: 40px 20px 32px; min-height: auto; }
  .hero-text-content h1 { font-size: 28px; }
  .hero-text-content p { font-size: 14px; }
  .hero-badge { font-size: 10px; padding: 4px 12px; }
  .content-header { flex-direction: column; gap: 12px; align-items: flex-start; }
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .premium-product-card { border-radius: 16px; }
  .product-image { height: 180px; }
  .product-info { padding: 14px; }
  .product-title { font-size: 14px; }
  .product-meta { font-size: 11px; }
  .content-body-wrapper { padding: 0 16px; }
}

@media (max-width: 480px) {
  .header-content { flex-wrap: wrap; gap: 6px; padding: 0 12px; }
  .logo { margin-right: 0; }
  .nav-links { order: 3; width: 100%; justify-content: center; gap: 2px; }
  .nav-item { font-size: 12px; padding: 0 6px; height: 28px; line-height: 28px; }
  .user-area { margin-left: auto; }
  .product-grid { grid-template-columns: 1fr; gap: 12px; }
  .product-image { height: 200px; }
  .hero-text-content h1 { font-size: 24px; }
  .hero-text-content p { font-size: 13px; }
  .hero-search :deep(.ant-input) { height: 44px; font-size: 14px; }
  .hero-search :deep(.ant-btn) { height: 44px; padding: 0 16px; }
  .marketplace-hero { padding: 32px 16px 24px; border-radius: 0; }
  .sort-options { width: 100%; }
  .sort-options .premium-select { width: 100% !important; }
  .breadcrumb h2 { font-size: 18px; }
  .decor-icon { display: none; }
  .product-tags { flex-wrap: wrap; gap: 4px; }
  .product-tags .ant-tag { font-size: 10px; padding: 0 6px; }
  .marketplace-hero { border-radius: 0; }
}

/* --- 640px: mid-range fix --- */
@media (max-width: 640px) {
  .header-content { flex-wrap: wrap; gap: 6px; padding: 0 12px; }
  .logo { margin-right: 0; }
  .nav-links { width: 100%; justify-content: center; gap: 4px; }
  .nav-item { font-size: 12px; padding: 0 8px; height: 28px; line-height: 28px; }
  .user-area :deep(.ant-btn) { font-size: 11px; padding: 0 8px; height: 28px; }
  .user-area { gap: 6px; }
  .marketplace-hero { padding: 36px 16px 28px; min-height: auto; border-radius: 0; margin: 0; }
  .hero-text-content h1 { font-size: 26px; }
  .hero-text-content p { font-size: 13px; }
  .hero-decorations .decor-icon { transform: scale(0.7); }
  .hero-decorations .icon-3, .hero-decorations .icon-4 { display: none; }
  .content-body-wrapper { padding: 0 12px; }
  .content-header { flex-direction: column; gap: 8px; align-items: flex-start; }
  .breadcrumb h2 { font-size: 18px; }
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .product-image { height: 160px; }
  .product-info { padding: 12px; }
  .product-title { font-size: 13px; }
  .product-price { font-size: 15px; }
  .product-meta { font-size: 11px; }
  .premium-product-card { border-radius: 12px; }
  .publish-fab { bottom: 16px; right: 16px; width: 48px; height: 48px; font-size: 20px; }
  .sort-options { flex-wrap: wrap; gap: 8px; }
  .sort-label { display: none; }
  .detail-image-box { padding: 16px; }
  .detail-header h2 { font-size: 24px; }
  .detail-price .value { font-size: 30px; }
  .detail-actions .buy-now-btn { height: 44px; font-size: 14px; }
}
</style>