<template>
  <div class="product-detail-view">
    <!-- Top Navigation Breadcrumb -->
    <div class="top-nav">
      <div class="nav-container">
        <a-breadcrumb separator=">">
          <a-breadcrumb-item @click="router.push('/marketplace')">匠心市集</a-breadcrumb-item>
          <a-breadcrumb-item>{{ product?.category }}</a-breadcrumb-item>
          <a-breadcrumb-item>{{ product?.title }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="back-link" @click="router.back()">
          <arrow-left-outlined /> 返回
        </div>
      </div>
    </div>

    <div class="main-content" v-if="product">
      <a-row :gutter="64" justify="center">
        <!-- Left: Image Gallery (Compact) -->
        <a-col :xs="24" :lg="10" class="image-gallery-col">
          <div class="image-list">
            <div class="main-image-wrapper">
              <img :src="formatImageUrl(product.image)" :alt="product.title" class="product-image" />
              <div class="type-badge" v-if="product.type === 'CUSTOMIZABLE'">支持定制</div>
            </div>
          </div>
        </a-col>

        <!-- Right: Purchase Info (Sticky) -->
        <a-col :xs="24" :lg="10" class="info-sticky-col">
          <div class="sticky-info-card">
            <div class="product-header">
              <h1 class="title">{{ product.title }}</h1>
              <p class="subtitle">{{ product.category }} · {{ product.craftTechnique }}</p>
              
              <div class="price-section">
                <span class="currency">￥</span>
                <span class="amount">{{ product.price }}</span>
                <span class="price-tag">匠心价</span>
              </div>
            </div>

            <div class="purchase-options">
              <div class="option-item">
                <div class="label">服务保障</div>
                <div class="content">
                  <span class="tag"><safety-certificate-outlined /> 匠心实名</span>
                  <span class="tag"><history-outlined /> 72小时发货</span>
                  <span class="tag"><smile-outlined /> 售后无忧</span>
                </div>
              </div>
              
              <div class="option-item" v-if="product.type === 'CUSTOMIZABLE'">
                <div class="label">定制周期</div>
                <div class="content">预计 7-15 个工作日完成</div>
              </div>
            </div>

            <a-divider />

            <div class="action-buttons">
              <a-button type="primary" size="large" class="buy-btn" @click="handlePurchase(product)">
                {{ product.type === 'CUSTOMIZABLE' ? '立即发起定制' : '立即购买' }}
              </a-button>
              <a-button size="large" class="chat-btn" @click="handleConsult(product)">
                <template #icon><message-outlined /></template>
                联系创作者
              </a-button>
            </div>

            <div class="social-actions">
              <div class="action-item" @click="handleLike(product)">
                <heart-filled v-if="isLiked" style="color: #eb2f96" />
                <heart-outlined v-else />
                <span>收藏 ({{ product.likes }})</span>
              </div>
              <div class="action-item">
                <share-alt-outlined />
                <span>分享作品</span>
              </div>
            </div>

            <!-- Creator Mini Card -->
            <div class="creator-mini-card">
              <a-avatar :size="48" :src="product.creatorAvatar" />
              <div class="creator-info">
                <div class="name">{{ product.creator }} <a-tag color="gold" size="small">认证匠人</a-tag></div>
                <div class="bio">致力于传统工艺的现代呈现</div>
              </div>
              <a-button ghost size="small" type="primary" class="follow-btn">+ 关注</a-button>
            </div>
          </div>
        </a-col>
      </a-row>

      <!-- Bottom: Detailed Sections -->
      <div class="details-footer-container">
        <a-tabs default-active-key="1" class="custom-tabs">
          <a-tab-pane key="1" tab="作品详情">
            <div class="tab-content description-content">
              <h3>作品故事</h3>
              <p>{{ product.description || '暂无描述' }}</p>
              <div class="image-placeholder-box">
                <img :src="formatImageUrl(product.image)" />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="定制/购买须知">
            <div class="tab-content guide-content">
              <div class="guide-item">
                <h4>1. 关于色差</h4>
                <p>由于拍摄光线及显示器不同，可能存在轻微色差，请以实物为准。</p>
              </div>
              <div class="guide-item">
                <h4>2. 定制说明</h4>
                <p>定制作品一经开始制作，非质量问题不支持中途退款，请在确认半成品时仔细核对。</p>
              </div>
              <div class="guide-item">
                <h4>3. 物流包装</h4>
                <p>所有作品均采用加厚防震包装，确保运输安全。</p>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <div v-else-if="loading" class="loading-full">
      <a-spin size="large" tip="匠心加载中..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ArrowLeftOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  HistoryOutlined,
  SmileOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { getProductById, likeProduct, type ProductItem } from '../api/product';
import { createOrder } from '../api/order';
import { sendMessage } from '../api/message';
import { useUserStore } from '../stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const product = ref<ProductItem | null>(null);
const loading = ref(true);
const isLiked = ref(false);

const fetchProduct = async () => {
  const id = Number(route.params.id);
  if (!id) return;
  
  loading.value = true;
  try {
    product.value = await getProductById(id);
  } catch (err) {
    message.error('获取作品详情失败');
    router.push('/marketplace');
  } finally {
    loading.value = false;
  }
};

const formatImageUrl = (url: string | undefined) => {
  if (!url) return 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80';
  if (url.startsWith('http')) return url;
  return `http://localhost:3000${url}`;
};

const handleLike = async (p: ProductItem) => {
  try {
    await likeProduct(p.id);
    p.likes++;
    isLiked.value = true;
    message.success('已收藏');
  } catch {
    message.error('操作失败');
  }
};

const handleConsult = async (p: ProductItem) => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录后再咨询');
    router.push('/login');
    return;
  }
  
  if (p.creatorId === userStore.user?.id) {
    message.warning('不能咨询自己的作品哦');
    return;
  }

  try {
    const isCustom = p.type === 'CUSTOMIZABLE';
    const initialMessage = isCustom 
      ? `你好，我对你的作品《${p.title}》很感兴趣，想要咨询一下定制细节。`
      : `你好，我对你的作品《${p.title}》很感兴趣，请问还有现货吗？`;

    await sendMessage({
      senderId: userStore.user.id,
      senderName: userStore.user.username,
      receiverId: Number(p.creatorId),
      receiverName: p.creator,
      content: initialMessage
    });

    message.success(`已开启与「${p.creator}」的私信咨询。`);
    router.push({
      path: '/artisan-dashboard',
      query: { menu: 'messages', chatWithId: p.creatorId, chatWithName: p.creator }
    });
  } catch (err) {
    message.error('发起咨询失败');
  }
};

const handlePurchase = async (p: ProductItem) => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录后再操作');
    router.push('/login');
    return;
  }
  
  if (p.creatorId === userStore.user?.id) {
    message.warning('不能购买自己的作品哦');
    return;
  }

  try {
    const isCustom = p.type === 'CUSTOMIZABLE';
    await createOrder({
      buyerId: userStore.user.id,
      buyerName: userStore.user.username,
      artisanId: Number(p.creatorId),
      artisanName: p.creator,
      productTitle: p.title,
      productType: p.type,
      price: Number(p.price),
      productId: p.id,
      requirements: isCustom ? `正式定制请求: ${p.title}` : `正式购买请求: ${p.title}`,
      customRequirements: isCustom ? `正式定制请求: ${p.title}` : `正式购买请求: ${p.title}`,
      status: 'PENDING_PAY'
    });
    
    message.success(isCustom ? '定制订单已发起！' : '购买订单已生成！');
    router.push({
      path: '/artisan-dashboard',
      query: { menu: 'buyer-orders' }
    });
  } catch (err) {
    message.error('操作失败');
  }
};

onMounted(fetchProduct);
</script>

<style scoped>
.product-detail-view {
  background: #fff;
  min-height: 100vh;
}

/* Top Nav */
.top-nav {
  height: 60px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
}

.back-link {
  cursor: pointer;
  color: #86868b;
  font-size: 14px;
  transition: color 0.3s;
}

.back-link:hover {
  color: #eb2f96;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Image Gallery */
.image-gallery-col {
  display: flex;
  justify-content: flex-end;
}

.image-list {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: #f9f9f9;
  border: 1px solid #f0f0f0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.type-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #eb2f96;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
}

.extra-images {
  margin-top: 40px;
}

.image-tip {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 20px;
  text-align: center;
}

.detail-img-item {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* Info Sticky */
.info-sticky-col {
  position: relative;
}

.sticky-info-card {
  position: sticky;
  top: 100px;
}

.product-header .title {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
  line-height: 1.2;
}

.product-header .subtitle {
  font-size: 16px;
  color: #86868b;
  margin-bottom: 24px;
}

.price-section {
  margin-bottom: 32px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-section .currency {
  font-size: 24px;
  color: #eb2f96;
  font-weight: 600;
}

.price-section .amount {
  font-size: 44px;
  color: #eb2f96;
  font-weight: 700;
}

.price-tag {
  margin-left: 12px;
  background: #fff0f6;
  color: #eb2f96;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
}

.purchase-options {
  margin-bottom: 32px;
}

.option-item {
  display: flex;
  margin-bottom: 16px;
}

.option-item .label {
  width: 80px;
  color: #86868b;
  font-size: 14px;
}

.option-item .content {
  flex: 1;
  color: #1d1d1f;
  font-size: 14px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-right: 16px;
  color: #52c41a;
  font-size: 13px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.buy-btn {
  height: 54px !important;
  border-radius: 27px !important;
  font-size: 17px !important;
  font-weight: 600 !important;
  background: #eb2f96 !important;
  border-color: #eb2f96 !important;
}

.chat-btn {
  height: 54px !important;
  border-radius: 27px !important;
  font-size: 17px !important;
  font-weight: 600 !important;
  color: #eb2f96 !important;
  border-color: #eb2f96 !important;
}

.social-actions {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 40px;
}

.action-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #86868b;
  font-size: 14px;
  transition: color 0.3s;
}

.action-item:hover {
  color: #eb2f96;
}

/* Creator Card */
.creator-mini-card {
  background: #fdf6f9;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.creator-info {
  flex: 1;
}

.creator-info .name {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
}

.creator-info .bio {
  font-size: 12px;
  color: #86868b;
}

/* Footer Tabs */
.details-footer-container {
  margin-top: 80px;
  border-top: 1px solid #f0f0f0;
  padding-top: 40px;
}

.custom-tabs :deep(.ant-tabs-nav-list) {
  margin: 0 auto;
}

.tab-content {
  padding: 40px 0;
  max-width: 800px;
  margin: 0 auto;
}

.description-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
}

.description-content p {
  font-size: 16px;
  line-height: 1.8;
  color: #3c3c43;
  margin-bottom: 40px;
}

.image-placeholder-box img {
  width: 100%;
  border-radius: 12px;
}

.guide-item {
  margin-bottom: 32px;
}

.guide-item h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.guide-item p {
  color: #86868b;
  line-height: 1.6;
}

.loading-full {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

