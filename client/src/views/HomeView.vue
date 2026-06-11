<template>
  <div class="home-container">
    <a-layout class="layout">
      <div class="drawer-overlay" :class="{ show: menuOpen }" @click="menuOpen = false"></div>
      <!-- Enhanced Navigation Bar -->
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
            <!-- 移动端抽屉额外菜单 -->
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
                  <a-button type="dashed" block @click="menuOpen = false; $router.push('/artisan-dashboard')">🏪 我的小店</a-button>
                  <a-button block @click="menuOpen = false; showAI = true">🤖 AI 创作</a-button>
                  <a-button danger block @click="handleLogout">退出登录</a-button>
                </template>
              </template>
              <template v-else>
                <a-button type="primary" block @click="menuOpen = false; $router.push('/login')">登录 / 注册</a-button>
              </template>
            </div>
          </div>
          <div class="hamburger" :class="{ active: menuOpen }" @click="menuOpen = !menuOpen"><span></span><span></span><span></span></div>

          <div class="ai-entry" @click="showAI = !showAI">
            <span class="ai-entry-icon">🤖</span>
            <span class="ai-entry-text">AI 创作</span>
          </div>

          <div class="user-area">
            <template v-if="userStore.isLoggedIn">
              <template v-if="userStore.isAdmin">
                <a-button type="primary" shape="round" @click="$router.push('/admin')">🛡️ 管理后台</a-button>
                <a-button type="text" @click="handleLogout">退出</a-button>
              </template>
              <template v-else>
                <a-button type="dashed" shape="round" @click="$router.push('/artisan-dashboard')">我的小店</a-button>
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
            </template>
            <template v-else>
              <a-button type="text" class="login-btn" @click="$router.push('/login')">
                登录 / 注册
              </a-button>
              <a-button type="primary" class="start-btn" @click="$router.push('/marketplace')">
                开始创作
              </a-button>
            </template>
          </div>
        </div>
      </a-layout-header>
      
      <a-layout-content>
        <!-- Refined Hero Section -->
        <section class="hero-section">
          <div class="hero-mesh-bg">
            <div class="mesh-blob blob-1"></div>
            <div class="mesh-blob blob-2"></div>
            <div class="mesh-blob blob-3"></div>
          </div>
          <div class="hero-noise"></div>
          
          <!-- Decorative Floating Icons -->
          <div class="hero-decorations">
            <span class="decor-icon icon-1">🧶</span>
            <span class="decor-icon icon-2">✨</span>
            <span class="decor-icon icon-3">🎨</span>
            <span class="decor-icon icon-4">💎</span>
            <span class="decor-icon icon-5">🌸</span>
          </div>

          <div class="hero-content">
            <div class="hero-text">
              <div class="hero-badge-wrapper">
                <span class="hero-pill">✨ 首创 C2C 手作定制平台</span>
              </div>
              <h1 class="hero-title">
                <span class="title-line">指尖上的艺术</span>
                <span class="title-line highlight-text">心灵的共鸣</span>
              </h1>
              <p class="hero-description">专为年轻女性打造的垂直类手作定制与技能交换空间。<br/>在这里，我们不仅交易作品，更交换热爱。</p>
              
              <div class="hero-cta">
                <a-button type="primary" size="large" class="btn-premium explore-btn" @click="$router.push('/marketplace')">
                  探索市集 <right-outlined class="btn-icon" />
                </a-button>
                <a-button size="large" class="btn-glass exchange-btn" @click="$router.push('/skill-exchange')">
                  技能交换
                </a-button>
                <a-button size="large" class="btn-ghost ai-btn" @click="showAI = true">
                  🤖 AI 创作
                </a-button>
              </div>

              <div class="hero-stats-glass">
                <div class="stat-glass-item">
                  <span class="stat-val">{{ stats.userCount }}</span>
                  <span class="stat-lab">认证手作娘</span>
                </div>
                <div class="stat-glass-divider"></div>
                <div class="stat-glass-item">
                  <span class="stat-val">{{ stats.productCount }}</span>
                  <span class="stat-lab">原创作品</span>
                </div>
                <div class="stat-glass-divider"></div>
                <div class="stat-glass-item">
                  <span class="stat-val">{{ stats.skillCount }}</span>
                  <span class="stat-lab">技能互助</span>
                </div>
              </div>
            </div>

            <div class="hero-visual">
              <div class="visual-stack">
                <div class="main-card-wrap floating-y">
                  <div class="main-card-inner">
                    <img src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&q=80" alt="Handmade" />
                    <div class="card-glass-overlay"></div>
                  </div>
                </div>
                <div class="side-card-wrap floating-y-delayed">
                  <img src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=300&q=80" alt="Handmade" />
                </div>
                <div class="mini-card-wrap floating-y-slow">
                  <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300&q=80" alt="Handmade" />
                </div>
                
                <div class="live-badge-glass" v-if="stats.hotProducts.length">
                  <div class="pulse-dot"></div>
                  <div class="badge-content">
                    <span class="badge-title">{{ stats.hotProducts[0]?.title || '今日热门' }}</span>
                    <span class="badge-sub">{{ stats.productCount > 0 ? stats.productCount + ' 件作品在售' : '火热招募中' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Hot Products Section -->
        <section class="hot-section reveal" v-if="stats.hotProducts.length">
          <div class="features-bg-ornament"></div>
          <div class="section-header centered">
            <div class="section-header-content">
              <span class="section-subtitle">TRENDING NOW</span>
              <h2>🔥 热门作品</h2>
              <div class="section-header-line"></div>
              <p>发现最受欢迎的手作好物，每一件都独一无二</p>
            </div>
            <router-link to="/marketplace" class="view-all-floating">
              查看全部 <right-outlined />
            </router-link>
          </div>
          <a-row :gutter="[24, 24]" class="relative-z">
            <a-col :xs="12" :sm="12" :md="6" v-for="item in stats.hotProducts" :key="item.id">
              <div class="hot-product-card" @click="$router.push('/marketplace')">
                <div class="hot-product-inner">
                  <div class="hot-product-img">
                    <img :src="item.image || 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80'" :alt="item.title" />
                    <div class="hot-product-like">
                      <heart-filled style="color:#ff4d4f;font-size:12px" /> {{ item.likes || 0 }}
                    </div>
                    <div class="vintage-tag-mini" v-if="item.vintageCategory">🎞️</div>
                  </div>
                  <div class="hot-product-info">
                    <span class="hot-product-title">{{ item.title }}</span>
                    <span class="hot-product-price">￥{{ item.price }}</span>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </section>

        <!-- Features Section -->
        <section class="features-section reveal">
          <div class="features-bg-ornament"></div>
          <div class="section-header centered">
            <div class="section-header-content">
              <span class="section-subtitle">OUR FEATURES</span>
              <h2>为什么选择指尖造物</h2>
              <div class="section-header-line"></div>
              <p>连接手艺与热爱，打造最有温度的手作定制社区</p>
            </div>
          </div>
          
          <div class="features-grid">
            <div class="feature-card-wrapper">
              <div class="feature-card">
                <div class="feature-card-inner">
                  <div class="feature-icon-box gradient-pink">
                    <span class="feature-icon">🧶</span>
                  </div>
                  <h3>专属定制大厅</h3>
                  <p>买家发布需求，手作娘在线竞标，订单状态机全程追踪制作进度。</p>
                  <div class="feature-card-footer">
                    <span class="feature-link">了解更多 <right-outlined /></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="feature-card-wrapper">
              <div class="feature-card">
                <div class="feature-card-inner">
                  <div class="feature-icon-box gradient-purple">
                    <span class="feature-icon">💎</span>
                  </div>
                  <h3>技能互助圈</h3>
                  <p>首创"造物币"虚拟货币体系，让技能可以传递和交换价值。</p>
                  <div class="feature-card-footer">
                    <span class="feature-link">了解更多 <right-outlined /></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="feature-card-wrapper">
              <div class="feature-card">
                <div class="feature-card-inner">
                  <div class="feature-icon-box gradient-orange">
                    <span class="feature-icon">🤖</span>
                  </div>
                  <h3>AI 创作助手</h3>
                  <p>智能文案生成 + 灵感绘图，让手作娘专注创作，告别文案焦虑。</p>
                  <div class="feature-card-footer">
                    <span class="feature-link">了解更多 <right-outlined /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Skills Preview -->
        <section class="skills-preview reveal" v-if="stats.hotSkills.length">
          <div class="features-bg-ornament"></div>
          <div class="section-header centered">
            <div class="section-header-content">
              <span class="section-subtitle">SKILL EXCHANGE</span>
              <h2>🌟 热门技能交换</h2>
              <div class="section-header-line"></div>
              <p>用你的才华换取别人的技艺，共同探索手作的奥秘</p>
            </div>
            <router-link to="/skill-exchange" class="view-all-floating">
              查看全部 <right-outlined />
            </router-link>
          </div>
          <a-row :gutter="[24, 24]" class="relative-z">
            <a-col :xs="24" :sm="12" :md="6" v-for="item in stats.hotSkills" :key="item.id">
              <div class="skill-preview-card" @click="$router.push('/skill-exchange')">
                <div class="skill-preview-inner">
                  <div class="skill-preview-header">
                    <a-avatar :size="44" :src="item.avatar || 'https://joeschmoe.io/api/v1/random'" />
                    <div>
                      <strong>{{ item.username }}</strong>
                      <span>{{ item.category }}</span>
                    </div>
                  </div>
                  <p class="skill-preview-title">{{ item.title }}</p>
                  <div class="skill-preview-footer">
                    <span class="skill-cost">{{ item.zaowuBiCost }} 造物币</span>
                    <span class="skill-exchanges">已交换 {{ item.exchangeCount }} 次</span>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </section>

        <!-- CTA Section -->
        <section class="cta-section reveal">
          <div class="cta-bg">
            <div class="cta-inner">
              <h2>准备好开启造物之旅了吗？</h2>
              <p>加入指尖造物社区，与热爱手作的伙伴一起分享创造的快乐。</p>
              <a-button type="primary" size="large" shape="round" @click="$router.push('/login')">
                立即免费注册
              </a-button>
            </div>
          </div>
        </section>
      </a-layout-content>

      <a-layout-footer class="footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-icon">✨</span>
              <span class="logo-text">指尖造物</span>
            </div>
            <p>连接手工艺人与爱好者的数字空间</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>平台</h4>
              <a>项目定位</a>
              <a>用户守则</a>
              <a>信用体系</a>
            </div>
            <div class="link-group">
              <h4>帮助</h4>
              <a>定制流程</a>
              <a>造物币规则</a>
              <a>技能交换指引</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          ©2026 指尖造物 Finger-Art-Platform · 让每一次创造都能找到共鸣
        </div>
      </a-layout-footer>
    </a-layout>

    <!-- AI 功能入口弹窗 -->
    <AICopywriting v-model:open="showCopywriting" />
    <AIInspireDraw v-model:open="showInspireDraw" />

    <a-back-top />

    <a-modal v-model:open="showAI" title="🤖 AI 创作中心" :footer="null" width="460px">
      <div class="ai-menu">
        <div class="ai-menu-item" @click="showAI=false; showCopywriting=true">
          <div class="ai-menu-icon">📝</div>
          <div class="ai-menu-info">
            <strong>智能文案生成</strong>
            <span>上传作品图，AI自动生成商品标题与详情</span>
          </div>
        </div>
        <div class="ai-menu-item" @click="showAI=false; showInspireDraw=true">
          <div class="ai-menu-icon">🎨</div>
          <div class="ai-menu-info">
            <strong>AI 灵感绘图</strong>
            <span>输入描述词，AI生成高清手作设计稿</span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { RightOutlined, HeartFilled } from '@ant-design/icons-vue';
import { useUserStore } from '../stores/user';
import { getHomeStats, type HomeStats } from '../api/home';
import AICopywriting from '../components/AICopywriting.vue';
import AIInspireDraw from '../components/AIInspireDraw.vue';

const router = useRouter();
const userStore = useUserStore();

const showAI = ref(false);
const showCopywriting = ref(false);
const showInspireDraw = ref(false);
const menuOpen = ref(false);
const stats = ref<HomeStats>({ userCount: 0, productCount: 0, skillCount: 0, hotProducts: [], hotSkills: [] });

const handleLogout = () => { userStore.logout(); router.push('/'); };

const formatImageUrl = (url: string | undefined) => {
  if (!url) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=User&backgroundColor=ffdfbf';
  if (url.startsWith('http')) return url;
  return `http://localhost:3000${url}`;
};

// Reveal animation logic
const initObserver = () => {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));
};

// Re-initialize observer when data changes and DOM updates
watch(() => stats.value, async () => {
  await nextTick();
  initObserver();
}, { deep: true });

onMounted(async () => {
  try {
    stats.value = await getHomeStats();
  } catch (error) {
    console.error('Failed to fetch home stats:', error);
    // Fallback: show reveal elements anyway
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('reveal-visible'));
  }
  
  await nextTick();
  initObserver();
  
  // Final fallback safety
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('reveal-visible')) {
        el.classList.add('reveal-visible');
      }
    });
  }, 2000);
});
</script>

<style scoped>
.home-container { overflow-x: hidden; }
.layout { background: white; }

/* ===== Header ===== */
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
.user-area { display: flex; align-items: center; gap: 16px; }
.login-btn { color: #595959; }
.start-btn { border-radius: 8px; height: 40px; padding: 0 24px; }
.user-profile { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.user-name { font-size: 14px; color: #262626; font-weight: 500; }

/* AI 创作入口 */
.ai-entry {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 18px; cursor: pointer; transition: all 0.25s;
  border: 1px solid rgba(235,47,150,0.1);
  background: linear-gradient(135deg, rgba(235,47,150,0.04), rgba(114,46,209,0.02));
  margin-right: 12px;
}
.ai-entry:hover {
  background: linear-gradient(135deg, rgba(235,47,150,0.08), rgba(114,46,209,0.06));
  border-color: rgba(235,47,150,0.2); transform: translateY(-1px);
}
.ai-entry-icon { font-size: 15px; }
.ai-entry-text { font-size: 13px; font-weight: 600; color: #eb2f96; }

/* Hamburger menu */
.hamburger {
  display: none; flex-direction: column; gap: 4px; cursor: pointer;
  padding: 6px; z-index: 1100; margin-left: auto;
}
.hamburger span {
  display: block; width: 22px; height: 2px; background: #595959;
  border-radius: 2px; transition: all 0.3s;
}
.hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }

/* Mobile drawer extra items */
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
  .user-area, .ai-entry { display: none; }
  .drawer-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.15); z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
  .drawer-overlay.show { opacity: 1; pointer-events: auto; }
}

/* AI 菜单弹窗 */
.ai-menu { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
.ai-menu-item {
  display: flex; gap: 16px; padding: 18px 20px; border-radius: 14px;
  border: 1px solid #f0f0f0; cursor: pointer; transition: all 0.3s; align-items: center;
}
.ai-menu-item:hover { border-color: #eb2f96; background: #fdf2f8; transform: translateX(4px); }
.ai-menu-icon { font-size: 32px; flex-shrink: 0; }
.ai-menu-info strong { display: block; font-size: 15px; margin-bottom: 4px; color: #262626; }
.ai-menu-info span { font-size: 12px; color: #8c8c8c; }

/* ===== Hero Section (Premium Refactor) ===== */
.hero-section {
  position: relative;
  padding: 60px 0 80px;
  min-height: calc(100vh - 68px);
  display: flex;
  align-items: center;
  background: #fff;
  overflow: hidden;
  isolation: isolate;
}

/* Mesh Gradient Background */
.hero-mesh-bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  filter: blur(80px);
  opacity: 0.6;
}
.mesh-blob {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: multiply;
  animation: blobFloat 20s infinite alternate ease-in-out;
}
.blob-1 { width: 500px; height: 500px; background: #fff0f6; top: -100px; right: -100px; }
.blob-2 { width: 400px; height: 400px; background: #f9f0ff; bottom: -100px; left: -100px; animation-delay: -5s; }
.blob-3 { width: 350px; height: 350px; background: #e6f7ff; top: 20%; left: 30%; animation-delay: -10s; }

@keyframes blobFloat {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -30px) scale(1.05); }
  66% { transform: translate(-15px, 15px) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}

.hero-noise {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
}

/* Decorative Icons */
.hero-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.decor-icon {
  position: absolute;
  font-size: 20px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
  animation: floatDecor 8s infinite ease-in-out;
}
.icon-1 { top: 15%; left: 10%; animation-delay: 0s; }
.icon-2 { top: 10%; right: 15%; animation-delay: -2s; font-size: 28px; }
.icon-3 { bottom: 20%; left: 20%; animation-delay: -4s; }
.icon-4 { bottom: 15%; right: 10%; animation-delay: -6s; }
.icon-5 { top: 40%; right: 25%; animation-delay: -1s; opacity: 0.5; }

@keyframes floatDecor {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(10deg); }
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
  padding: 0 24px;
  position: relative;
  z-index: 1;
  width: 100%;
}

.hero-text { flex: 1.1; }

/* Premium Typography */
.hero-badge-wrapper { margin-bottom: 24px; }
.hero-pill {
  padding: 6px 16px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(235,47,150,0.12);
  border-radius: 100px;
  color: #eb2f96;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.hero-title {
  font-size: 60px;
  line-height: 1.1;
  font-weight: 900;
  color: #1a1a1a;
  margin-bottom: 20px;
  letter-spacing: -1.5px;
}
.title-line { display: block; }
.highlight-text {
  background: linear-gradient(120deg, #eb2f96, #722ed1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}
.highlight-text::after {
  content: '';
  position: absolute;
  bottom: 8px; left: 0;
  width: 100%; height: 8px;
  background: rgba(235,47,150,0.08);
  z-index: -1;
  border-radius: 4px;
}

.hero-description {
  font-size: 18px;
  color: #4d4d4d;
  line-height: 1.7;
  margin-bottom: 40px;
  max-width: 520px;
}

/* Premium Buttons */
.hero-cta {
  display: flex;
  gap: 16px;
  margin-bottom: 52px;
}
.btn-premium {
  height: 52px;
  padding: 0 32px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 700;
  background: linear-gradient(135deg, #eb2f96, #722ed1);
  border: none;
  box-shadow: 0 8px 24px rgba(235,47,150,0.25);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-premium:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 32px rgba(235,47,150,0.3); }

.btn-glass {
  height: 52px;
  padding: 0 32px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0,0,0,0.05);
  color: #262626;
  transition: all 0.3s;
}
.btn-glass:hover { background: #fff; border-color: #eb2f96; color: #eb2f96; }

.btn-ghost {
  height: 52px;
  padding: 0 28px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  border: 1px dashed rgba(0,0,0,0.1);
  background: transparent;
  color: #595959;
}

/* Glass Stats Bar */
.hero-stats-glass {
  display: inline-flex;
  padding: 18px 32px;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 24px;
  gap: 32px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.03);
}
.stat-glass-item { display: flex; flex-direction: column; }
.stat-val { font-size: 30px; font-weight: 900; color: #1a1a1a; line-height: 1; margin-bottom: 2px; }
.stat-lab { font-size: 12px; color: #8c8c8c; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-glass-divider { width: 1px; height: 32px; background: rgba(0,0,0,0.06); align-self: center; }

/* Visual Visual Visual */
.hero-visual { flex: 1; position: relative; }
.visual-stack { position: relative; width: 100%; height: 420px; perspective: 1000px; }

.main-card-wrap {
  position: absolute;
  width: 320px;
  height: 380px;
  top: 0; left: 30px;
  z-index: 2;
}
.main-card-inner {
  width: 100%; height: 100%;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.12);
  position: relative;
}
.main-card-inner img { width: 100%; height: 100%; object-fit: cover; }
.card-glass-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.25));
}

.side-card-wrap {
  position: absolute;
  width: 220px; height: 150px;
  right: 0; top: 50px;
  z-index: 3;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0,0,0,0.08);
  border: 5px solid white;
}
.side-card-wrap img { width: 100%; height: 100%; object-fit: cover; }

.mini-card-wrap {
  position: absolute;
  width: 180px; height: 130px;
  right: 50px; bottom: 30px;
  z-index: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 25px rgba(0,0,0,0.06);
}
.mini-card-wrap img { width: 100%; height: 100%; object-fit: cover; }

.live-badge-glass {
  position: absolute;
  bottom: 60px; left: -15px;
  z-index: 4;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(15px);
  padding: 12px 20px;
  border-radius: 20px;
  border: 1px solid white;
  box-shadow: 0 12px 30px rgba(235,47,150,0.12);
  display: flex;
  align-items: center;
  gap: 12px;
}
.pulse-dot {
  width: 10px; height: 10px;
  background: #eb2f96;
  border-radius: 50%;
  position: relative;
}
.pulse-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 2px solid #eb2f96;
  border-radius: 50%;
  animation: badgePulse 2s infinite;
}
@keyframes badgePulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}
.badge-content { display: flex; flex-direction: column; }
.badge-title { font-weight: 800; color: #1a1a1a; font-size: 14px; }
.badge-sub { font-size: 11px; color: #eb2f96; font-weight: 600; }

/* Floating Animations */
.floating-y { animation: floatY 6s infinite ease-in-out; }
.floating-y-delayed { animation: floatY 6s infinite ease-in-out 1s; }
.floating-y-slow { animation: floatY 8s infinite ease-in-out 0.5s; }

@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* ===== Responsive (Hero) ===== */
@media (max-width: 1200px) {
  .hero-title { font-size: 52px; }
  .main-card-wrap { width: 280px; height: 340px; }
}

@media (max-width: 992px) {
  .hero-section { padding: 40px 0 60px; min-height: auto; }
  .hero-content { flex-direction: column; text-align: center; gap: 40px; }
  .hero-description { margin: 0 auto 32px; }
  .hero-cta { justify-content: center; }
  .hero-visual { width: 100%; display: flex; justify-content: center; }
  .visual-stack { width: 450px; height: 380px; }
}

@media (max-width: 576px) {
  .hero-title { font-size: 38px; }
  .hero-cta { flex-direction: column; width: 100%; }
  .btn-premium, .btn-glass, .btn-ghost { width: 100%; }
  .hero-stats-glass { flex-direction: column; gap: 16px; padding: 24px; }
  .stat-glass-divider { width: 32px; height: 1px; }
  .visual-stack { transform: scale(0.75); }
}

/* ===== Hot Products ===== */
.section-header {
  max-width: 1200px; margin: 0 auto 32px; padding: 0 24px;
  display: flex; justify-content: space-between; align-items: flex-end;
}
.section-header-left h2 { font-size: 26px; font-weight: 800; color: #262626; margin-bottom: 4px; }
.section-header-left p { font-size: 14px; color: #8c8c8c; margin: 0; }
.view-all { font-size: 13px; color: #eb2f96; font-weight: 600; white-space: nowrap; }

.view-all-floating {
  position: absolute; right: 24px; bottom: 0;
  font-size: 14px; font-weight: 700; color: #eb2f96;
  padding: 8px 16px; border-radius: 100px;
  background: #fff0f6; transition: all 0.3s;
}
.view-all-floating:hover {
  background: #eb2f96; color: white; transform: translateX(5px);
}
.relative-z { position: relative; z-index: 1; }

/* ===== Hot Products ===== */
.hot-section { 
  padding: 60px 0; max-width: 1200px; margin: 0 auto; 
  position: relative; overflow: hidden;
}
.hot-section .section-header { padding: 0; }
.hot-product-card { 
  background: white; 
  border-radius: 20px; 
  overflow: hidden; 
  padding: 2px;
  background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%);
  cursor: pointer; 
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}
.hot-product-card:hover { 
  transform: translateY(-10px); 
  background: linear-gradient(135deg, #eb2f96 0%, #722ed1 100%);
  box-shadow: 0 20px 40px rgba(235,47,150,0.1); 
}
.hot-product-inner {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  height: 100%;
}
.hot-product-img { position: relative; height: 160px; overflow: hidden; }
.hot-product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.hot-product-card:hover .hot-product-img img { transform: scale(1.1); }
.hot-product-like { 
  position: absolute; bottom: 10px; left: 10px; 
  background: rgba(255,255,255,0.9); 
  backdrop-filter: blur(8px); 
  padding: 3px 10px; border-radius: 100px; 
  font-size: 11px; font-weight: 700; color: #262626; 
  display: flex; align-items: center; gap: 3px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.04);
}
.vintage-tag-mini { 
  position: absolute; top: 10px; right: 10px; 
  background: linear-gradient(135deg, #722ed1, #eb2f96); 
  width: 28px; height: 28px; border-radius: 8px; 
  display: flex; align-items: center; justify-content: center; 
  font-size: 14px; box-shadow: 0 3px 10px rgba(114,46,209,0.25); 
}
.hot-product-info { padding: 14px; display: flex; flex-direction: column; gap: 6px; }
.hot-product-title { font-size: 14px; font-weight: 700; color: #262626; transition: color 0.3s; }
.hot-product-card:hover .hot-product-title { color: #eb2f96; }
.hot-product-price { font-size: 17px; font-weight: 800; color: #eb2f96; display: baseline; }
.hot-product-price::before { content: '￥'; font-size: 11px; margin-right: 2px; }

/* ===== Features ===== */
.features-section { 
  padding: 80px 0; 
  max-width: 1200px; 
  margin: 0 auto; 
  position: relative;
  overflow: hidden;
}
.features-bg-ornament {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 100%; height: 100%;
  background: radial-gradient(circle at 10% 20%, rgba(235,47,150,0.02) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(114,46,209,0.02) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}
.section-header.centered {
  text-align: center;
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.section-subtitle {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #eb2f96;
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-transform: uppercase;
}
.section-header-line {
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, #eb2f96, #722ed1);
  border-radius: 2px;
  margin: 16px 0;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}
.feature-card {
  height: 100%;
  background: white;
  border-radius: 24px;
  padding: 2px; /* For gradient border effect */
  background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
}
.feature-card:hover {
  transform: translateY(-12px);
  background: linear-gradient(135deg, #eb2f96 0%, #722ed1 100%);
  box-shadow: 0 20px 40px rgba(235,47,150,0.15);
}
.feature-card-inner {
  background: white;
  border-radius: 22px;
  padding: 40px 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.4s;
}
.feature-card:hover .feature-card-inner {
  background: rgba(255, 255, 255, 0.96);
}
.feature-icon-box {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.feature-card:hover .feature-icon-box {
  transform: rotateY(360deg) scale(1.1);
}
.feature-icon {
  font-size: 30px;
}
.gradient-pink { background: linear-gradient(135deg, #fff0f6, #ffe0eb); }
.gradient-purple { background: linear-gradient(135deg, #f9f0ff, #efdbff); }
.gradient-orange { background: linear-gradient(135deg, #fff7e6, #ffe7ba); }
.feature-card h3 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 16px;
  color: #262626;
  transition: all 0.3s;
}
.feature-card p {
  font-size: 15px;
  color: #595959;
  line-height: 1.7;
  margin-bottom: 24px;
  flex-grow: 1;
}
.feature-card-footer {
  margin-top: auto;
}
.feature-link {
  font-size: 14px;
  font-weight: 700;
  color: #eb2f96;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.8;
  transition: all 0.3s;
}
.feature-card:hover .feature-link {
  gap: 10px;
  opacity: 1;
}

/* ===== Skills Preview ===== */
.skills-preview { 
  padding: 60px 0; max-width: 1200px; margin: 0 auto; 
  position: relative; overflow: hidden;
}
.skills-preview .section-header { padding: 0; }
.skill-preview-card { 
  background: white; 
  border-radius: 20px; 
  padding: 2px;
  background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%);
  cursor: pointer; 
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  height: 100%; 
}
.skill-preview-card:hover { 
  transform: translateY(-8px); 
  background: linear-gradient(135deg, #eb2f96 0%, #722ed1 100%);
  box-shadow: 0 20px 40px rgba(0,0,0,0.06); 
}
.skill-preview-inner {
  background: white;
  border-radius: 18px;
  padding: 24px;
  height: 100%;
  display: flex; flex-direction: column;
}
.skill-preview-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.skill-preview-header strong { display: block; font-size: 15px; color: #262626; margin-bottom: 2px; }
.skill-preview-header span { 
  font-size: 12px; color: #eb2f96; 
  background: #fff0f6; padding: 2px 8px; border-radius: 4px; font-weight: 600;
}
.skill-preview-title { 
  font-size: 16px; font-weight: 700; color: #434343; 
  margin-bottom: 20px; line-height: 1.6; min-height: 52px; 
  flex-grow: 1;
}
.skill-preview-footer { 
  display: flex; justify-content: space-between; align-items: center; 
  padding-top: 16px; border-top: 1px dashed #f0f0f0;
}
.skill-cost { font-size: 16px; font-weight: 800; color: #fa8c16; }
.skill-exchanges { font-size: 12px; color: #8c8c8c; font-weight: 500; }

/* ===== CTA ===== */
.cta-section { padding: 20px 24px 40px; }
.cta-bg {
  max-width: 1100px; margin: 0 auto;
  background: linear-gradient(135deg, #eb2f96, #722ed1);
  border-radius: 24px; padding: 50px 40px; text-align: center;
  position: relative; overflow: hidden;
}
.cta-bg::before { content: ''; position: absolute; width: 300px; height: 300px; background: rgba(255,255,255,0.05); border-radius: 50%; top: -100px; left: -80px; }
.cta-bg::after { content: ''; position: absolute; width: 200px; height: 200px; background: rgba(255,255,255,0.04); border-radius: 50%; bottom: -60px; right: -40px; }
.cta-inner { position: relative; z-index: 1; }
.cta-inner h2 { color: white; font-size: 30px; font-weight: 800; margin-bottom: 10px; }
.cta-inner p { color: rgba(255,255,255,0.8); font-size: 15px; margin-bottom: 24px; }
.cta-inner :deep(.ant-btn) { height: 48px; padding: 0 36px; border-radius: 24px; font-size: 15px; font-weight: 700; background: white; color: #eb2f96; border: none; box-shadow: 0 6px 20px rgba(0,0,0,0.1); }

/* ===== Footer ===== */
.footer { 
  background: #ffffff !important; 
  padding: 40px 24px 0 !important; 
  border-top: 1px solid #f0f0f0; 
}
.footer-inner { 
  max-width: 1200px; margin: 0 auto; 
  display: flex; justify-content: space-between; 
  padding-bottom: 40px; 
}
.footer-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.footer-brand p { 
  font-size: 14px; color: #8c8c8c; margin: 0; 
  max-width: 220px; line-height: 1.5;
}
.footer-links { display: flex; gap: 60px; }
.link-group h4 { font-size: 15px; font-weight: 700; color: #262626; margin-bottom: 20px; }
.link-group a { 
  display: block; font-size: 13px; color: #595959; 
  margin-bottom: 10px; cursor: pointer; transition: all 0.3s; 
}
.link-group a:hover { color: #eb2f96; transform: translateX(4px); }
.footer-bottom { 
  max-width: 1200px; margin: 0 auto; 
  padding: 20px; 
  border-top: 1px solid #f5f5f5; 
  text-align: center; 
  font-size: 12px; color: #bfbfbf; 
  letter-spacing: 0.5px;
}

.ml-16 { margin-left: 16px; }

/* ===== Scroll Reveal ===== */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.2, 0, 0, 1);
  will-change: transform, opacity;
}
.reveal-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Ensure content is visible if animation fails or takes too long */
.no-js .reveal {
  opacity: 1;
  transform: none;
}

/* ===== Responsive ===== */
@media (max-width: 992px) {
  .header-content { padding: 0 16px; }
  .hero-text h1 { font-size: 42px; }
  .footer-links { gap: 32px; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .header-content { padding: 0 16px; }
  .ai-entry { padding: 4px 10px; }
  .ai-entry-text { font-size: 12px; }
  .user-area :deep(.ant-btn) { font-size: 12px; height: 32px; padding: 0 10px; }
  .hero-content { flex-direction: column; gap: 32px; text-align: center; }
  .hero-text h1 { font-size: 34px; }
  .hero-desc { margin: 0 auto 24px; }
  .hero-actions { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-image { width: 100%; }
  .image-collage { height: 300px; display: flex; justify-content: center; }
  .collage-main { width: 180px; height: 220px; position: relative; }
  .collage-side { right: 10px; top: 30px; }
  .side-img { width: 120px; height: 90px; }
  .side-img.secondary { display: none; }
  .floating-badge { left: 50%; transform: translateX(-50%); bottom: -10px; }
  
  .features-grid { grid-template-columns: 1fr; }
  .features-section { padding: 60px 0; }
  
  .footer-inner { flex-direction: column; gap: 40px; text-align: center; }
  .footer-brand p { max-width: 100%; }
  .footer-logo { justify-content: center; }
  .footer-links { justify-content: center; }
}

/* --- 640px: tablet/mid-range fix --- */
@media (max-width: 640px) {
  .ai-entry { padding: 4px 10px; }
  .ai-entry-text { font-size: 11px; }
  .user-area :deep(.ant-btn) { font-size: 12px; height: 30px; padding: 0 10px; }
  .hero-section { padding: 48px 0; }
  .hero-content { flex-direction: column; gap: 24px; text-align: center; }
  .hero-text h1 { font-size: 30px; }
  .hero-desc { font-size: 14px; margin: 0 auto 20px; }
  .hero-actions { flex-direction: column; align-items: center; }
  .hero-actions .ant-btn { width: 100%; max-width: 260px; margin-left: 0 !important; }
  .hero-stats { gap: 16px; }
  .stat-num { font-size: 24px; }
  .features-section { padding: 48px 0; }
  .features-grid { grid-template-columns: 1fr; gap: 16px; }
  .feature-card { padding: 28px 20px; }
  .feature-card h3 { font-size: 17px; }
  .skills-preview { padding: 0 16px 48px; }
  .cta-section { padding: 0 16px 48px; }
  .cta-inner { padding: 48px 24px; }
  .cta-inner h2 { font-size: 22px; }
  .footer-inner { flex-direction: column; gap: 32px; text-align: center; }
  .footer-links { justify-content: center; flex-wrap: wrap; }
}

@media (max-width: 480px) {
  .ai-entry { display: none; }
  .hero-text h1 { font-size: 28px; }
  .hero-actions { flex-direction: column; width: 100%; }
  .hero-actions .ant-btn { width: 100%; margin-left: 0 !important; }
  .stat-num { font-size: 22px; }
  .stat-label { font-size: 11px; }
  .hero-section { padding: 40px 0; }
}
</style>