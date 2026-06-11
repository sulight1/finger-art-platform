<template>
  <div class="artisan-dashboard">
    <a-layout class="dashboard-layout">
      <a-layout-sider width="260" class="glass-sider">
        <div class="user-info-section">
          <a-avatar :size="80" :src="userStore.userAvatar" class="user-avatar" />
          <h3>{{ userStore.user?.username }}</h3>
          <div class="balance-sidebar">
            <span class="label">我的造物币: </span>
            <span class="value">{{ userStore.user?.zaowuBiBalance || '0.00' }}</span>
          </div>
          <div class="follow-counts">
            <span @click="selectedMenu = ['followings']"><b>{{ followings.length }}</b> 关注</span>
            <a-divider type="vertical" />
            <span @click="selectedMenu = ['followers']"><b>{{ followers.length }}</b> 粉丝</span>
          </div>
          <a-tag color="purple" style="margin-top: 12px">认证手作娘</a-tag>
        </div>
        <a-menu v-model:selectedKeys="selectedMenu" mode="inline">
          <a-menu-item key="my-products">
            <template #icon><shop-outlined /></template>
            我的作品库
          </a-menu-item>
          <a-menu-item key="orders">
            <template #icon><container-outlined /></template>
            店铺订单
          </a-menu-item>
          <a-menu-item key="buyer-orders">
            <template #icon><shopping-cart-outlined /></template>
            我的订单
          </a-menu-item>
          <a-menu-item key="my-requests">
            <template #icon><bulb-outlined /></template>
            我的定制需求
          </a-menu-item>
          <a-menu-item key="messages">
            <template #icon><message-outlined /></template>
            私信咨询
          </a-menu-item>
          <a-menu-item key="followings">
            <template #icon><user-outlined /></template>
            我关注的
          </a-menu-item>
          <a-menu-item key="followers">
            <template #icon><team-outlined /></template>
            我的粉丝
          </a-menu-item>
          <a-menu-item key="settings">
            <template #icon><setting-outlined /></template>
            小店设置
          </a-menu-item>
        </a-menu>
        <div class="sider-footer">
          <a-button block @click="$router.push('/marketplace')">返回市集</a-button>
        </div>
      </a-layout-sider>

      <a-layout-content class="dashboard-content">
        <div class="welcome-banner">
          <h1>手作娘工作台</h1>
          <p>在这里管理你的每一件匠心之作</p>
          <a-button type="primary" size="large" @click="goToPublish">发布新作品</a-button>
        </div>

        <div class="content-body">
          <template v-if="selectedMenu[0] === 'my-products'">
            <a-tabs v-model:activeKey="activeTab">
              <a-tab-pane key="all" tab="全部作品" />
              <a-tab-pane key="PENDING" tab="审核中" />
              <a-tab-pane key="APPROVED" tab="已上架" />
              <a-tab-pane key="REJECTED" tab="未通过" />
            </a-tabs>

            <div class="product-list">
              <a-row :gutter="[24, 24]">
                <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in filteredProducts" :key="item.id">
                  <a-card hoverable class="artisan-product-card">
                    <template #cover>
                      <div class="img-container">
                        <img :src="formatImageUrl(item.image)" />
                        <div class="status-badge" :class="item.status === 'APPROVED' ? 'approved' : (item.status === 'REJECTED' ? 'rejected' : 'pending')">
                          {{ getStatusText(item.status) }}
                        </div>
                      </div>
                    </template>
                    <a-card-meta :title="item.title">
                      <template #description>
                        <div class="card-desc">
                          <span class="price">￥{{ item.price }}</span>
                          <span class="likes"><heart-filled /> {{ item.likes }}</span>
                        </div>
                      </template>
                    </a-card-meta>
                    <template #actions>
                      <edit-outlined key="edit" @click="handleEdit(item)" />
                      <a-popconfirm title="确定删除吗？" @confirm="handleDelete(item.id)">
                        <delete-outlined key="delete" style="color: #ff4d4f" />
                      </a-popconfirm>
                    </template>
                  </a-card>
                </a-col>
              </a-row>
              <div v-if="filteredProducts.length === 0" class="empty-list">
                <a-empty description="这里空空如也，快去发布作品吧" />
              </div>
            </div>
          </template>

          <template v-else-if="selectedMenu[0] === 'settings'">
            <div class="settings-section">
              <h2>小店设置</h2>
              <div class="settings-card">
                <a-form layout="vertical">
                  <a-form-item label="店铺头像">
                    <a-upload
                      name="file"
                      list-type="picture-card"
                      class="avatar-uploader"
                      :show-upload-list="false"
                      action="http://localhost:3000/files/upload"
                      :before-upload="beforeUpload"
                      @change="handleAvatarUpload"
                    >
                      <img v-if="userStore.user?.avatar || settingsForm.avatar" :src="formatImageUrl(settingsForm.avatar || userStore.user?.avatar)" alt="avatar" style="width: 100%" />
                      <div v-else>
                        <plus-outlined />
                        <div style="margin-top: 8px">上传头像</div>
                      </div>
                    </a-upload>
                  </a-form-item>
                  <a-form-item label="小店名称 (用户名)" required>
                    <a-input v-model:value="settingsForm.username" placeholder="请输入新的用户名" />
                  </a-form-item>
                  <a-form-item label="联系邮箱">
                    <a-input v-model:value="settingsForm.email" placeholder="请输入联系邮箱" />
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" size="large" :loading="savingSettings" @click="saveSettings">
                      保存修改
                    </a-button>
                  </a-form-item>
                </a-form>
              </div>
            </div>
          </template>

          <template v-else-if="selectedMenu[0] === 'followings'">
            <div class="follow-section">
              <h2>我关注的 ({{ followings.length }})</h2>
              <div class="follow-list">
                <a-list :data-source="followings" :loading="followLoading">
                  <template #renderItem="{ item }">
                    <a-list-item class="follow-item">
                      <a-list-item-meta :title="item.username" :description="item.bio || '这个用户很神秘，什么都没写~'">
                        <template #avatar>
                          <a-avatar :size="54" :src="formatImageUrl(item.avatar)" />
                        </template>
                      </a-list-item-meta>
                      <template #actions>
                        <a-button type="link" danger @click="handleUnfollow(item)">取消关注</a-button>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>
                <div v-if="followings.length === 0 && !followLoading" class="empty-list">
                  <a-empty description="你还没有关注任何人哦" />
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="selectedMenu[0] === 'followers'">
            <div class="follow-section">
              <h2>我的粉丝 ({{ followers.length }})</h2>
              <div class="follow-list">
                <a-list :data-source="followers" :loading="followLoading">
                  <template #renderItem="{ item }">
                    <a-list-item class="follow-item">
                      <a-list-item-meta :title="item.username" :description="item.bio || '这个用户很神秘，什么都没写~'">
                        <template #avatar>
                          <a-avatar :size="54" :src="formatImageUrl(item.avatar)" />
                        </template>
                      </a-list-item-meta>
                      <template #actions>
                        <a-button type="primary" ghost size="small" v-if="!isFollowing(item.id)" @click="handleFollow(item)">关注回他</a-button>
                        <span v-else class="mutual-follow">互相关注</span>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>
                <div v-if="followers.length === 0 && !followLoading" class="empty-list">
                  <a-empty description="还没有粉丝关注你，继续加油创作吧" />
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="selectedMenu[0] === 'orders'">
            <div class="orders-section">
              <h2>店铺订单管理</h2>
              <a-tabs v-model:activeKey="orderTab">
                <a-tab-pane key="all" tab="全部" />
                <a-tab-pane key="PENDING" tab="待处理" />
                <a-tab-pane key="ACCEPTED" tab="制作中" />
                <a-tab-pane key="COMPLETED" tab="已完成" />
              </a-tabs>
              
              <div class="order-list">
                <a-table :dataSource="filteredOrders" :columns="orderColumns" :loading="loadingOrders">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'type'">
                      <a-tag :color="record.isCustom ? 'pink' : 'blue'">
                        {{ record.isCustom ? '定制' : '成品' }}
                      </a-tag>
                    </template>
                    <template v-if="column.key === 'status'">
                      <a-tag :color="getOrderStatusColor(record.status)">{{ getOrderStatusText(record.status) }}</a-tag>
                    </template>
                    <template v-if="column.key === 'action'">
                      <a-space>
                        <a-button v-if="record.status === 'PENDING_PAY'" type="link" @click="handleUpdateOrderStatus(record.id, 'PRODUCING')">接单制作</a-button>
                        <a-button v-if="record.status === 'PRODUCING'" type="link" @click="handleUpdateOrderStatus(record.id, 'HALF_FINISHED_CONFIRM')">发送半成品确认</a-button>
                        <a-button v-if="record.status === 'HALF_FINISHED_CONFIRM'" type="link" disabled>等待买家确认</a-button>
                        <a-button v-if="record.status === 'PENDING_SHIP'" type="link" @click="handleUpdateOrderStatus(record.id, 'RECEIVED')">标记已发货</a-button>
                        <a-button type="link" @click="openChat(record.buyerId, record.buyerName)">联系买家</a-button>
                        <a-popconfirm title="确定删除该订单吗？" @confirm="handleDeleteOrder(record.id)">
                          <a-button type="link" danger>删除</a-button>
                        </a-popconfirm>
                      </a-space>
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
          </template>

          <template v-else-if="selectedMenu[0] === 'buyer-orders'">
            <div class="orders-section">
              <h2>我的订单</h2>
              <div class="order-list">
                <a-table :dataSource="buyerOrders" :columns="buyerOrderColumns" :loading="loadingOrders">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'type'">
                      <a-tag :color="record.isCustom ? 'pink' : 'blue'">
                        {{ record.isCustom ? '定制' : '成品' }}
                      </a-tag>
                    </template>
                    <template v-if="column.key === 'status'">
                      <a-tag :color="getOrderStatusColor(record.status)">{{ getOrderStatusText(record.status) }}</a-tag>
                    </template>
                    <template v-if="column.key === 'action'">
                      <a-space>
                        <a-button v-if="record.status === 'PENDING_PAY'" type="primary" size="small" @click="openPayModal(record)">去支付</a-button>
                        <a-button v-if="record.status === 'HALF_FINISHED_CONFIRM'" type="primary" size="small" @click="handleUpdateOrderStatus(record.id, 'PENDING_SHIP')">确认定制效果</a-button>
                        <a-button v-if="record.status === 'RECEIVED'" type="primary" size="small" @click="handleUpdateOrderStatus(record.id, 'COMPLETED')">确认收货</a-button>
                        <a-button type="link" @click="openChat(record.artisanId, record.artisanName)">联系手作娘</a-button>
                        <a-popconfirm title="确定取消并删除该定制订单吗？" @confirm="handleDeleteOrder(record.id)">
                          <a-button type="link" danger>删除</a-button>
                        </a-popconfirm>
                      </a-space>
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
          </template>

          <template v-else-if="selectedMenu[0] === 'my-requests'">
            <div class="orders-section">
              <h2>我的定制需求 (广撒网)</h2>
              <div class="order-list">
                <a-table :dataSource="myRequests" :columns="requestColumns" :loading="loadingRequests">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'budget'">
                      ￥{{ record.budgetMin }} - ￥{{ record.budgetMax }}
                    </template>
                    <template v-if="column.key === 'deadline'">
                      {{ new Date(record.deadline).toLocaleDateString() }}
                    </template>
                    <template v-if="column.key === 'status'">
                      <a-tag :color="getRequestStatusColor(record.status)">{{ getRequestStatusText(record.status) }}</a-tag>
                    </template>
                    <template v-if="column.key === 'action'">
                      <a-popconfirm title="确定删除该定制需求吗？" @confirm="handleDeleteRequest(record.id)">
                        <a-button type="link" danger size="small">删除</a-button>
                      </a-popconfirm>
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
          </template>

          <template v-else-if="selectedMenu[0] === 'messages'">
            <div class="messages-section">
              <div class="chat-container">
                <div class="chat-list">
                  <div class="chat-list-header">近期联系人</div>
                  <div 
                    v-for="chat in chatList" 
                    :key="chat.userId" 
                    class="chat-user-item"
                    :class="{ active: currentChatUser?.userId === chat.userId }"
                    @click="selectChat(chat)"
                  >
                    <a-avatar :src="formatImageUrl(chat.avatar)" />
                    <div class="chat-user-info">
                      <div class="chat-user-name">{{ chat.username }}</div>
                      <div class="chat-last-msg">{{ chat.lastMsg }}</div>
                    </div>
                    <div v-if="chat.unread" class="unread-dot"></div>
                  </div>
                </div>
                
                <div class="chat-main">
                  <template v-if="currentChatUser">
                    <div class="chat-header">{{ currentChatUser.username }}</div>
                    <div class="chat-messages" ref="chatMsgRef">
                      <div v-for="msg in messages" :key="msg.id" class="message-item" :class="{ 'mine': msg.senderId === userStore.user?.id }">
                        <div class="message-content">
                          {{ msg.content }}
                          <a-popconfirm title="确定删除这条消息吗？" @confirm="handleDeleteMessage(msg.id!)" placement="top">
                            <delete-outlined class="msg-delete-icon" />
                          </a-popconfirm>
                        </div>
                        <div class="message-time">{{ formatTime(msg.createTime) }}</div>
                      </div>
                    </div>
                    <div class="chat-input-area">
                      <a-textarea v-model:value="newMsg" placeholder="输入消息..." :rows="3" @pressEnter="handleSendMsg" />
                      <div class="chat-actions">
                        <a-button type="primary" @click="handleSendMsg">发送</a-button>
                      </div>
                    </div>
                  </template>
                  <div v-else class="chat-placeholder">
                    <a-empty description="选择一个联系人开始聊天吧" />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="empty-list">
              <a-empty description="该模块正在开发中..." />
            </div>
          </template>
        </div>
      </a-layout-content>
    </a-layout>

    <!-- Edit Product Modal -->
    <a-modal v-model:open="showEditModal" title="编辑作品" @ok="handleUpdateSubmit" :confirmLoading="updating" width="700px">
      <a-form layout="vertical">
        <a-form-item label="作品名称" required>
          <a-input v-model:value="editForm.title" placeholder="给你的作品起个好听的名字" />
        </a-form-item>
        <a-form-item label="作品售价 (￥)" required>
          <a-input-number v-model:value="editForm.price" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="作品类型">
          <a-radio-group v-model:value="editForm.type">
            <a-radio value="READY_MADE">成品</a-radio>
            <a-radio value="CUSTOMIZABLE">支持定制</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="作品分类" required>
          <a-select v-model:value="editForm.category" placeholder="选择作品分类" @change="onEditCategoryChange">
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
            accept=".jpg,.jpeg,.png,.webp,.gif"
            :before-upload="beforeUpload"
            @change="handleUploadChange"
          >
            <img v-if="editForm.image" :src="formatImageUrl(editForm.image)" alt="product" style="width: 100%" />
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">更换图片</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="制作工艺">
          <a-select v-model:value="editForm.craftTechnique" placeholder="选择制作工艺" allow-clear :disabled="!editForm.category">
            <a-select-option v-for="t in editTechniques" :key="t.name" :value="t.name">{{ t.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="作品描述">
          <a-textarea v-model:value="editForm.description" placeholder="简单介绍一下你的作品（选填）" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 支付模态框 -->
    <a-modal
      v-model:open="showPayModal"
      title="确认支付"
      @ok="handlePay"
      :confirmLoading="paying"
      okText="确认支付"
      cancelText="取消"
    >
      <div v-if="currentOrder" class="pay-modal-content">
        <p>订单作品：<strong>{{ currentOrder.productTitle }}</strong></p>
        <p>支付金额：<span class="pay-amount" style="color: #eb2f96; font-weight: bold;">￥{{ currentOrder.price }}</span></p>
        <div class="balance-info">
          <span>当前造物币余额：</span>
          <span :class="{ 'insufficient': (userStore.user?.zaowuBiBalance || 0) < currentOrder.price }" :style="(userStore.user?.zaowuBiBalance || 0) < currentOrder.price ? 'color: #ff4d4f' : ''">
            {{ userStore.user?.zaowuBiBalance || 0 }}
          </span>
        </div>
        <p v-if="(userStore.user?.zaowuBiBalance || 0) < currentOrder.price" class="error-tip" style="color: #ff4d4f; margin-top: 8px;">
          余额不足，请前往个人设置充值
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ShopOutlined, 
  ContainerOutlined, 
  MessageOutlined, 
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  HeartFilled,
  PlusOutlined,
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  BulbOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { getProducts, deleteProduct, updateProduct, getCraftTechniques, type CraftTechniqueItem, ProductItem } from '../api/product';
import { updateUser, getFollowings, getFollowers, followUser, unfollowUser, addCoins, type UserInfo } from '../api/user';
import { getArtisanOrders, getBuyerOrders, updateOrderStatus, deleteOrder, type CustomOrder } from '../api/order';
import { getAllCustomRequests, deleteCustomRequest, type CustomRequest } from '../api/custom-request';
import { getChatHistory, sendMessage, getUserMessages, deleteMessage, type Message } from '../api/message';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();
const selectedMenu = ref(['my-products']);
const activeTab = ref('all');
const products = ref<ProductItem[]>([]);

// ===== Order Logic =====
const orderTab = ref('all');
const artisanOrders = ref<CustomOrder[]>([]);
const buyerOrders = ref<CustomOrder[]>([]);
const myRequests = ref<CustomRequest[]>([]);
const loadingOrders = ref(false);
const loadingRequests = ref(false);

const fetchRequests = async () => {
  if (!userStore.user?.id) return;
  loadingRequests.value = true;
  try {
    const data = await getAllCustomRequests();
    // 过滤出自己的需求
    myRequests.value = data.filter(r => r.buyer?.id === userStore.user?.id);
  } catch (err) {
    message.error('获取定制需求失败');
  } finally {
    loadingRequests.value = false;
  }
};

const fetchOrders = async () => {
  if (!userStore.user?.id) return;
  loadingOrders.value = true;
  try {
    const [artisanData, buyerData] = await Promise.all([
      getArtisanOrders(userStore.user.id),
      getBuyerOrders(userStore.user.id)
    ]);
    
    // 适配后端返回的嵌套对象，并补充缺失字段
    artisanOrders.value = (artisanData as any[]).map(o => ({
      ...o,
      productTitle: o.product?.title || o.productTitle,
      buyerName: o.buyer?.username || o.buyerName,
      price: o.amount || o.price,
      requirements: o.customRequirements || o.requirements,
      isCustom: o.productType === 'CUSTOMIZABLE' || o.product?.type === 'CUSTOMIZABLE'
    }));
    
    buyerOrders.value = (buyerData as any[]).map(o => ({
      ...o,
      productTitle: o.product?.title || o.productTitle,
      artisanName: o.product?.creator?.username || o.artisanName,
      artisanId: o.product?.creator?.id || o.artisanId,
      price: o.amount || o.price,
      requirements: o.customRequirements || o.requirements,
      // 严谨判断：优先读取订单持久化的类型，其次读取关联作品的实时类型
      isCustom: o.productType === 'CUSTOMIZABLE' || o.product?.type === 'CUSTOMIZABLE'
    }));
  } catch (err) {
    console.error('Fetch orders error:', err);
    message.error('获取订单失败');
  } finally {
    loadingOrders.value = false;
  }
};

const filteredOrders = computed(() => {
  if (orderTab.value === 'all') return artisanOrders.value;
  return artisanOrders.value.filter(o => o.status === orderTab.value);
});

const orderColumns = [
  { title: '作品', dataIndex: 'productTitle', key: 'productTitle' },
  { title: '类型', key: 'type' },
  { title: '买家', dataIndex: 'buyerName', key: 'buyerName' },
  { title: '定制需求', dataIndex: 'requirements', key: 'requirements' },
  { title: '金额', dataIndex: 'price', key: 'price' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'action' }
];

const buyerOrderColumns = [
  { title: '作品', dataIndex: 'productTitle', key: 'productTitle' },
  { title: '类型', key: 'type' },
  { title: '手作娘', dataIndex: 'artisanName', key: 'artisanName' },
  { title: '定制需求', dataIndex: 'requirements', key: 'requirements' },
  { title: '金额', dataIndex: 'price', key: 'price' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'action' }
];

const requestColumns = [
  { title: '需求名称', dataIndex: 'title', key: 'title' },
  { title: '分类', dataIndex: 'category', key: 'category' },
  { title: '预算', key: 'budget' },
  { title: '交付日期', dataIndex: 'deadline', key: 'deadline' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'action' }
];

const getOrderStatusColor = (status: string) => {
  const map: any = { 
    PENDING_PAY: 'orange', 
    PRODUCING: 'processing', 
    HALF_FINISHED_CONFIRM: 'blue',
    PENDING_SHIP: 'cyan', 
    RECEIVED: 'green', 
    COMPLETED: 'green',
    CANCELLED: 'red' 
  };
  return map[status] || 'default';
};

const getOrderStatusText = (status: string) => {
  const map: any = { 
    PENDING_PAY: '待支付', 
    PRODUCING: '制作中', 
    HALF_FINISHED_CONFIRM: '半成品待确认',
    PENDING_SHIP: '待发货', 
    RECEIVED: '已收货', 
    COMPLETED: '已完成', 
    CANCELLED: '已取消' 
  };
  return map[status] || status;
};

const getRequestStatusColor = (status: string) => {
  const map: any = { OPEN: 'green', CLOSED: 'red', COMPLETED: 'blue' };
  return map[status] || 'default';
};

const getRequestStatusText = (status: string) => {
  const map: any = { OPEN: '招募中', CLOSED: '已关闭', COMPLETED: '已完成' };
  return map[status] || status;
};

const handleUpdateOrderStatus = async (id: number, status: string) => {
  try {
    await updateOrderStatus(id, status);
    message.success('状态已更新');
    fetchOrders();
  } catch (err) {
    message.error('更新失败');
  }
};

const handleDeleteOrder = async (id: number) => {
  try {
    await deleteOrder(id);
    message.success('订单已删除');
    fetchOrders();
  } catch (err) {
    message.error('删除失败');
  }
};

const handleDeleteRequest = async (id: number) => {
  try {
    await deleteCustomRequest(id);
    message.success('定制需求已删除');
    fetchRequests();
  } catch (err) {
    message.error('删除失败');
  }
};

const handleDeleteMessage = async (id: number) => {
  try {
    await deleteMessage(id);
    message.success('消息已删除');
    fetchMessages();
  } catch (err) {
    message.error('删除失败');
  }
};

// ===== Pay Logic =====
const showPayModal = ref(false);
const paying = ref(false);
const currentOrder = ref<any>(null);

const openPayModal = async (order: any) => {
  currentOrder.value = order;
  showPayModal.value = true;
  // 每次打开支付弹窗前，先刷新一遍用户最新的余额
  if (userStore.user?.id) {
    await userStore.fetchProfile();
  }
};

const handlePay = async () => {
  if (!currentOrder.value || !userStore.user?.id) return;
  
  const price = currentOrder.value.price || 0;
  const currentBalance = Number(userStore.user.zaowuBiBalance || 0);
  
  if (currentBalance < price) {
    message.error('造物币余额不足，请先充值');
    return;
  }

  paying.value = true;
  try {
    // 1. 扣除造物币
    await addCoins(userStore.user.id, -price);
    
    // 2. 更新订单状态为制作中
    await updateOrderStatus(currentOrder.value.id, 'PRODUCING');
    
    // 3. 重新获取最新的用户信息（包含余额）
    await userStore.fetchProfile();
    
    message.success('支付成功！手作娘已收到订单。');
    showPayModal.value = false;
    fetchOrders();
  } catch (err) {
    console.error('支付失败:', err);
    message.error('支付失败，请稍后重试');
  } finally {
    paying.value = false;
  }
};

// ===== Message Logic =====
const chatList = ref<any[]>([]);
const currentChatUser = ref<any>(null);
const messages = ref<Message[]>([]);
const newMsg = ref('');
const chatMsgRef = ref<HTMLElement | null>(null);

const fetchChatList = async () => {
  if (!userStore.user?.id) return;
  try {
    const allMsgs = await getUserMessages(userStore.user.id);
    const uniqueUsers = new Map();
    
    allMsgs.forEach(m => {
      const isMine = m.senderId === userStore.user?.id;
      const otherId = isMine ? m.receiverId : m.senderId;
      const otherName = isMine ? m.receiverName : m.senderName;
      
      if (!uniqueUsers.has(otherId)) {
        uniqueUsers.set(otherId, { 
          userId: otherId, 
          username: otherName, 
          avatar: '', 
          lastMsg: m.content,
          unread: !isMine && !m.isRead
        });
      }
    });
    
    chatList.value = Array.from(uniqueUsers.values());
    
    // 如果是通过路由跳转过来的（带参数），则自动选中
    const targetUserId = router.currentRoute.value.query.chatWithId;
    const targetUserName = router.currentRoute.value.query.chatWithName;
    if (targetUserId && targetUserName) {
      const userId = Number(targetUserId);
      const existing = chatList.value.find(c => c.userId === userId);
      if (existing) {
        selectChat(existing);
      } else {
        const newUser = { userId, username: targetUserName as string, avatar: '', lastMsg: '' };
        chatList.value.unshift(newUser);
        selectChat(newUser);
      }
      // 清除参数
      router.replace({ query: {} });
    }
  } catch (err) {
    console.error('获取聊天列表失败', err);
  }
};

const selectChat = async (user: any) => {
  if (!user || !user.userId) return;
  currentChatUser.value = user;
  fetchMessages();
};

const fetchMessages = async () => {
  if (!userStore.user?.id || !currentChatUser.value?.userId) return;
  try {
    messages.value = await getChatHistory(userStore.user.id, currentChatUser.value.userId);
    nextTick(() => {
      if (chatMsgRef.value) {
        chatMsgRef.value.scrollTop = chatMsgRef.value.scrollHeight;
      }
    });
  } catch (err) {
    console.error('获取聊天记录失败', err);
  }
};

const handleSendMsg = async () => {
  if (!newMsg.value.trim() || !currentChatUser.value?.userId || !userStore.user?.id) return;
  try {
    await sendMessage({
      senderId: userStore.user.id,
      senderName: userStore.user.username,
      receiverId: currentChatUser.value.userId,
      receiverName: currentChatUser.value.username,
      content: newMsg.value
    });
    newMsg.value = '';
    fetchMessages();
  } catch (err) {
    message.error('发送失败');
  }
};

const openChat = (userId: number, username: string) => {
  if (!userId) {
    message.warning('无法联系该用户，用户信息缺失');
    return;
  }
  selectedMenu.value = ['messages'];
  currentChatUser.value = { userId, username };
  fetchMessages();
};

const formatTime = (time: string | undefined) => {
  if (!time) return '';
  const date = new Date(time);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// ===== Follow Logic =====
const followings = ref<UserInfo[]>([]);
const followers = ref<UserInfo[]>([]);
const followLoading = ref(false);

const fetchFollowData = async () => {
  if (!userStore.user?.id) return;
  followLoading.value = true;
  try {
    const [followingData, followerData] = await Promise.all([
      getFollowings(userStore.user.id),
      getFollowers(userStore.user.id)
    ]);
    followings.value = followingData;
    followers.value = followerData;
  } catch (err) {
    message.error('获取关注数据失败');
  } finally {
    followLoading.value = false;
  }
};

const isFollowing = (userId: number) => {
  return followings.value.some(u => u.id === userId);
};

const handleFollow = async (user: UserInfo) => {
  if (!userStore.user?.id) return;
  try {
    await followUser(userStore.user.id, user.id);
    message.success(`已关注 ${user.username}`);
    fetchFollowData();
  } catch (err) {
    message.error('关注失败');
  }
};

const handleUnfollow = async (user: UserInfo) => {
  if (!userStore.user?.id) return;
  try {
    await unfollowUser(userStore.user.id, user.id);
    message.success(`已取消关注 ${user.username}`);
    fetchFollowData();
  } catch (err) {
    message.error('取消关注失败');
  }
};

// ===== Settings Logic =====
const savingSettings = ref(false);
const settingsForm = ref({
  username: '',
  email: '',
  avatar: ''
});

// Sync form with store data
const syncSettingsForm = () => {
  if (userStore.user) {
    settingsForm.value = {
      username: userStore.user.username || '',
      email: userStore.user.email || '',
      avatar: userStore.user.avatar || ''
    };
  }
};

// Initial sync and watch for menu changes
watch(() => selectedMenu.value, (newVal) => {
  if (newVal[0] === 'settings') {
    syncSettingsForm();
  } else if (newVal[0] === 'followings' || newVal[0] === 'followers') {
    fetchFollowData();
  } else if (newVal[0] === 'orders' || newVal[0] === 'buyer-orders') {
    fetchOrders();
  } else if (newVal[0] === 'my-requests') {
    fetchRequests();
  } else if (newVal[0] === 'messages') {
    fetchChatList();
  }
}, { immediate: true });

const handleAvatarUpload = (info: any) => {
  if (info.file.status === 'done') {
    const response = info.file.response;
    if (response && response.code === 200) {
      settingsForm.value.avatar = response.data;
      // 不要在这里更新 store，等保存按钮点击后再更新，或者预览用本地状态
      message.success('头像上传成功');
    } else {
      message.error(response?.message || '头像上传失败');
    }
  } else if (info.file.status === 'error') {
    message.error('文件上传网络错误');
  }
};

const saveSettings = async () => {
  if (!settingsForm.value.username) {
    message.warning('用户名不能为空');
    return;
  }
  if (!userStore.user?.id) {
    message.error('用户信息异常，请尝试重新登录');
    return;
  }
  savingSettings.value = true;
  try {
    const updatedUser = await updateUser(userStore.user.id, {
      username: settingsForm.value.username,
      email: settingsForm.value.email,
      avatar: settingsForm.value.avatar
    });
    userStore.updateUserInfo(updatedUser);
    message.success('个人资料已更新');
  } catch (err: any) {
    console.error('更新用户信息失败:', err);
    const errorMsg = err.response?.data?.message || err.message || '更新失败';
    message.error(errorMsg);
  } finally {
    savingSettings.value = false;
  }
};

// ===== Edit Logic =====
const showEditModal = ref(false);
const updating = ref(false);
const editTechniques = ref<CraftTechniqueItem[]>([]);
const editForm = ref<Partial<ProductItem>>({
  id: 0,
  title: '',
  price: 0,
  type: 'READY_MADE',
  category: '',
  craftTechnique: '',
  image: '',
  description: ''
});

const handleEdit = async (item: ProductItem) => {
  editForm.value = { ...item };
  if (item.category) {
    editTechniques.value = await getCraftTechniques(item.category);
  }
  showEditModal.value = true;
};

const onEditCategoryChange = async (category: string) => {
  editForm.value.craftTechnique = '';
  if (category) {
    editTechniques.value = await getCraftTechniques(category);
  } else {
    editTechniques.value = [];
  }
};

const handleUploadChange = (info: any) => {
  if (info.file.status === 'done') {
    const response = info.file.response;
    if (response.code === 200) {
      editForm.value.image = response.data;
      message.success('图片上传成功');
    }
  } else if (info.file.status === 'error') {
    message.error('图片上传失败');
  }
};

const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/gif';
  if (!isJpgOrPng) message.error('只能上传 JPG/PNG/WEBP/GIF 格式的图片!');
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) message.error('图片大小不能超过 5MB!');
  return isJpgOrPng && isLt5M;
};

const formatImageUrl = (url: string) => {
  if (!url) return 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80';
  if (url.startsWith('http')) return url;
  return `http://localhost:3000${url}`;
};

const handleUpdateSubmit = async () => {
  if (!editForm.value.title || (editForm.value.price || 0) <= 0 || !editForm.value.category) {
    message.warning('请填写完整的作品信息');
    return;
  }
  updating.value = true;
  try {
    await updateProduct(editForm.value.id!, editForm.value);
    message.success('修改成功，请等待管理员重新审核');
    showEditModal.value = false;
    fetchData();
  } catch (err: any) {
    console.error('修改作品失败详情:', err);
    const errorMsg = err.response?.data?.message || err.message || '服务器响应异常';
    message.error('修改失败: ' + errorMsg);
  } finally {
    updating.value = false;
  }
};

const fetchData = async () => {
  try {
    const data = await getProducts();
    // 优先使用 ID 匹配，兼容旧数据使用用户名匹配
    products.value = data.filter(p => {
      if (p.creatorId && userStore.user?.id) {
        return p.creatorId === userStore.user.id;
      }
      return p.creator === userStore.user?.username;
    });
  } catch (err) {
    message.error('获取作品失败');
  }
};

const filteredProducts = computed(() => {
  if (activeTab.value === 'all') return products.value;
  return products.value.filter(p => p.status === activeTab.value);
});

const getStatusText = (status: string) => {
  const texts: Record<string, string> = { 
    PENDING: '审核中', 
    APPROVED: '已上架',
    REJECTED: '未通过'
  };
  return texts[status] || status;
};

const handleDelete = async (id: number) => {
  try {
    await deleteProduct(id);
    message.success('作品已删除');
    fetchData();
  } catch (err) {
    message.error('删除失败');
  }
};

const goToPublish = () => {
  router.push('/marketplace');
  message.info('请点击市集页的"发布作品"按钮');
};

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  
  // 检查 URL 参数是否有指定的菜单
  const menuParam = router.currentRoute.value.query.menu;
  if (menuParam) {
    selectedMenu.value = [menuParam as string];
  }
  
  fetchData();
  fetchFollowData();
});
</script>

<style scoped>
.artisan-dashboard {
  min-height: 100vh;
  background: #fdf6f9;
}

.dashboard-layout {
  min-height: 100vh;
}

.glass-sider {
  background: white;
  border-right: 1px solid #f0f0f0;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
}

.user-info-section {
  text-align: center;
  padding-bottom: 32px;
  border-bottom: 1px solid #f9f9f9;
  margin-bottom: 24px;
}

.user-avatar {
  border: 4px solid #fff0f6;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(235, 47, 150, 0.1);
}

.user-info-section h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #262626;
}

.balance-sidebar {
  margin-bottom: 12px;
  font-size: 14px;
}

.balance-sidebar .value {
  color: #fa8c16;
  font-weight: 700;
}

.pay-modal-content {
  padding: 12px 0;
  font-size: 16px;
}

.pay-amount {
  color: #eb2f96;
  font-weight: 700;
  font-size: 20px;
}

.balance-info {
  margin-top: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.insufficient {
  color: #ff4d4f !important;
}

.error-tip {
  color: #ff4d4f;
  font-size: 13px;
  margin-top: 8px;
}

.follow-counts {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #8c8c8c;
  margin-top: 4px;
}

.follow-counts span {
  cursor: pointer;
  transition: color 0.3s;
}

.follow-counts span:hover {
  color: #eb2f96;
}

.follow-counts b {
  color: #262626;
}

.dashboard-content {
  padding: 40px;
}

.welcome-banner {
  background: linear-gradient(135deg, #fff0f6 0%, #f9f0ff 100%);
  padding: 40px;
  border-radius: 24px;
  margin-bottom: 40px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.welcome-banner h1 { font-size: 32px; font-weight: 800; color: #262626; margin-bottom: 8px; }
.welcome-banner p { color: #8c8c8c; font-size: 16px; margin-bottom: 24px; }

.content-body {
  background: white;
  padding: 32px;
  border-radius: 24px;
  min-height: 600px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.product-list { margin-top: 32px; }

.artisan-product-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f5f5f5;
  transition: all 0.3s;
}

.artisan-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.05);
}

.img-container {
  height: 180px;
  position: relative;
}

.img-container img { width: 100%; height: 100%; object-fit: cover; }

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  backdrop-filter: blur(4px);
}

.status-badge.pending { background: rgba(250, 173, 20, 0.9); }
.status-badge.approved { background: rgba(82, 196, 26, 0.9); }
.status-badge.rejected { background: rgba(245, 34, 45, 0.9); }

.card-desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.price { color: #eb2f96; font-weight: 700; font-size: 16px; }
.likes { color: #8c8c8c; font-size: 13px; display: flex; align-items: center; gap: 4px; }

/* Follow Styles */
.follow-section h2 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 24px;
  color: #262626;
}
.follow-item {
  padding: 20px 0;
  border-bottom: 1px solid #f5f5f5;
}
.follow-item :deep(.ant-list-item-meta-title) {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}
.follow-item :deep(.ant-list-item-meta-description) {
  font-size: 14px;
  color: #8c8c8c;
}
.mutual-follow {
  font-size: 12px;
  color: #bfbfbf;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

/* Settings Styles */
.settings-section {
  max-width: 600px;
}
.settings-section h2 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 24px;
  color: #262626;
}
.settings-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

/* Chat Styles */
.chat-container {
  display: flex;
  height: 600px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.chat-list {
  width: 260px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.chat-list-header {
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}

.chat-user-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.3s;
  position: relative;
}

.chat-user-item:hover { background: #fafafa; }
.chat-user-item.active { background: #fff0f6; }

.chat-user-info { flex: 1; overflow: hidden; }
.chat-user-name { font-weight: 500; font-size: 14px; }
.chat-last-msg { font-size: 12px; color: #8c8c8c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.unread-dot {
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
  position: absolute;
  right: 16px;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fdfdfd;
}

.chat-header {
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
  background: white;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  max-width: 80%;
  align-self: flex-start;
}

.message-item.mine {
  align-self: flex-end;
}

.message-content {
  padding: 10px 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  font-size: 14px;
  position: relative;
  word-break: break-all;
}

.msg-delete-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  border-radius: 50%;
  padding: 4px;
  font-size: 12px;
  color: #ff4d4f;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.message-item:hover .msg-delete-icon {
  opacity: 1;
}

.mine .msg-delete-icon {
  right: auto;
  left: -8px;
}

.mine .message-content {
  background: #eb2f96;
  color: white;
}

.message-time {
  font-size: 11px;
  color: #bfbfbf;
  margin-top: 4px;
  text-align: right;
}

.chat-input-area {
  padding: 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.chat-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.chat-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader :deep(.ant-upload) {
  width: 128px;
  height: 128px;
  border-radius: 50% !important;
  overflow: hidden;
}
.avatar-uploader img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-list {
  padding: 80px 0;
  text-align: center;
}

.sider-footer {
  margin-top: auto;
  padding: 24px;
}
</style>
