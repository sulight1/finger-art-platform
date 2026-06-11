<template>
  <div class="ai-chat-widget">
    <!-- 浮动按钮 -->
    <div class="chat-float-btn" @click="toggleChat" v-if="!open">
      <span class="btn-icon">💬</span>
      <span class="btn-text">AI 造物管家</span>
      <div class="pulse-dot"></div>
    </div>

    <!-- 聊天窗口 -->
    <transition name="slide-up">
      <div class="chat-panel" v-if="open">
        <div class="chat-header">
          <div class="header-left">
            <div class="ai-avatar">🤖</div>
            <div class="header-info">
              <strong>AI 造物管家</strong>
              <span>7x24h 在线</span>
            </div>
          </div>
          <div class="header-actions">
            <a-button type="text" size="small" @click="toggleChat" title="最小化" style="color:rgba(255,255,255,0.7)">−</a-button>
            <a-button type="text" size="small" @click="closeChat" title="关闭" style="color:rgba(255,255,255,0.7);margin-left:2px">✕</a-button>
          </div>
        </div>

        <!-- 快捷入口 -->
        <div class="quick-actions" v-if="messages.length === 0">
          <a-tag class="quick-tag" v-for="q in quickQuestions" :key="q" @click="sendQuick(q)">{{ q }}</a-tag>
        </div>

        <!-- 消息列表 -->
        <div class="chat-messages" ref="msgContainer">
          <div v-for="(msg, idx) in messages" :key="idx" :class="['msg-bubble', msg.role]">
            <div class="msg-avatar">{{ msg.role === 'user' ? '👩' : '🤖' }}</div>
            <div class="msg-content">
              <div class="msg-text">{{ msg.content }}</div>
              <!-- 商品推荐卡片 -->
              <div v-if="msg.products?.length" class="product-recommend">
                <div v-for="p in msg.products" :key="p.id" class="rec-card" @click="goToProduct(p.id)">
                  <img :src="p.image" :alt="p.title" />
                  <div class="rec-info">
                    <span class="rec-title">{{ p.title }}</span>
                    <span class="rec-price">￥{{ p.price }}</span>
                  </div>
                </div>
              </div>
              <span class="msg-time">{{ msg.time }}</span>
            </div>
          </div>
          <div v-if="typing" class="msg-bubble assistant">
            <div class="msg-avatar">🤖</div>
            <div class="msg-content">
              <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
          </div>
        </div>

        <!-- 输入区 -->
        <div class="chat-input-area">
          <a-input
            v-model:value="inputText"
            placeholder="描述你的需求，比如：适合配汉服的头饰..."
            @pressEnter="sendMessage"
            :disabled="typing"
          >
            <template #suffix>
              <a-button type="link" @click="sendMessage" :disabled="!inputText.trim() || typing" size="small">
                发送
              </a-button>
            </template>
          </a-input>
          <div class="input-hints">
            <span class="hint" @click="inputText='我想买个配汉服的头饰'">🪷 配汉服</span>
            <span class="hint" @click="inputText='适合去音乐节的夸张耳环'">🎵 音乐节</span>
            <span class="hint" @click="inputText='推荐新中式风格的饰品'">🏮 新中式</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { aiChat, type ChatMessage } from '../api/ai';
import { getProducts } from '../api/product';

const router = useRouter();
const open = ref(false);
const inputText = ref('');
const typing = ref(false);
const msgContainer = ref<HTMLElement | null>(null);

interface DisplayMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
  products?: { id: number; title: string; price: number; image: string }[];
}

const messages = ref<DisplayMessage[]>([]);

const quickQuestions = [
  '想买配汉服的头饰',
  '适合音乐节的夸张耳环',
  '推荐新中式饰品',
  '我的订单做到哪了？',
  '推荐送闺蜜的手工礼物'
];

const scrollToBottom = () => {
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight;
    }
  });
};

const toggleChat = () => {
  open.value = !open.value;
  if (open.value) scrollToBottom();
};

const closeChat = () => {
  open.value = false;
  messages.value = [];
};

const sendQuick = (q: string) => {
  inputText.value = q;
  sendMessage();
};

const sendMessage = async () => {
  const text = inputText.value.trim();
  if (!text || typing.value) return;
  inputText.value = '';

  const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  // 添加用户消息
  messages.value.push({ role: 'user', content: text, time: now });
  scrollToBottom();

  typing.value = true;

  try {
    const history: ChatMessage[] = messages.value.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    const result = await aiChat(history);

    typing.value = false;
    messages.value.push({
      role: 'assistant',
      content: result.reply,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      products: result.recommendations
    });
  } catch {
    typing.value = false;
    // 后端未部署时使用本地模拟回复
    let reply = '';
    let products: any[] | undefined;

    if (text.includes('汉服') || text.includes('头饰')) {
      reply = '为你筛选了这些新中式头饰，都是纯手工制作，搭配汉服非常出彩哦～✨';
      const data = await getProducts({ scope: 'approved' });
      products = data.slice(0, 3).map(p => ({
        id: p.id, title: p.title, price: p.price,
        image: p.image || 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633'
      }));
    } else if (text.includes('音乐节') || text.includes('耳环')) {
      reply = '这几款夸张风耳环超适合音乐节！搭配亮色穿搭，你就是全场焦点～🎵';
    } else if (text.includes('订单')) {
      reply = '手作娘正在精心制作中哦～每个作品都是纯手工完成，请耐心等待，通常需要 3-7 天。完成后会第一时间通知你！💝';
    } else if (text.includes('新中式')) {
      reply = '新中式风格最近超火！推荐你试试缠花发簪或滴胶团扇，国风满满又不失现代感～🏮';
    } else if (text.includes('礼物') || text.includes('送')) {
      reply = '手工礼物最有心意了！钩织公仔、定制穿戴甲都很适合送人，还可以刻上对方的名字哦～🎁';
    } else {
      reply = '好的～我记下了你的偏好。你可以告诉我具体想要的风格（复古/甜美/国风/简约）或者用途，我帮你精准推荐！💡';
    }

    messages.value.push({ role: 'assistant', content: reply, time: now, products });
  }
  scrollToBottom();
};

const goToProduct = (id: number) => {
  router.push('/marketplace');
};
</script>

<style scoped>
.ai-chat-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 浮动按钮 */
.chat-float-btn {
  width: 160px;
  height: 52px;
  background: linear-gradient(135deg, #eb2f96, #722ed1);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(235,47,150,0.35);
  transition: all 0.3s;
  color: white;
  font-size: 15px;
  font-weight: 600;
  position: relative;
}

.chat-float-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(235,47,150,0.45);
}

.btn-icon { font-size: 20px; }

.pulse-dot {
  width: 10px;
  height: 10px;
  background: #52c41a;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  right: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.3); }
}

/* 聊天面板 */
.chat-panel {
  width: 380px;
  height: 560px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #eb2f96, #722ed1);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.header-left { display: flex; align-items: center; gap: 10px; }
.ai-avatar {
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
}
.header-info strong { display: block; font-size: 15px; }
.header-info span { font-size: 11px; opacity: 0.8; }

/* 快捷入口 */
.quick-actions {
  padding: 14px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 1px solid #f5f5f5;
}
.quick-tag {
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 14px;
  background: #fdf2f8;
  color: #eb2f96;
  border: 1px solid #fce4ec;
  font-size: 12px;
  transition: all 0.2s;
}
.quick-tag:hover { background: #eb2f96; color: white; }

/* 消息区 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fafafa;
}

.msg-bubble { display: flex; gap: 8px; }
.msg-bubble.user { flex-direction: row-reverse; }

.msg-avatar {
  width: 32px; height: 32px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.msg-bubble.user .msg-avatar { background: #fff0f6; }
.msg-bubble.assistant .msg-avatar { background: #f6ffed; }

.msg-content { max-width: 78%; }
.msg-text {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
}
.msg-bubble.user .msg-text { background: #eb2f96; color: white; border-bottom-right-radius: 4px; }
.msg-bubble.assistant .msg-text { background: white; color: #434343; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

.msg-time { font-size: 10px; color: #bfbfbf; display: block; margin-top: 4px; }

/* 商品推荐卡 */
.product-recommend {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rec-card {
  display: flex;
  gap: 10px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s;
}
.rec-card:hover { border-color: #eb2f96; transform: translateY(-1px); }
.rec-card img {
  width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin: 6px;
}
.rec-info { display: flex; flex-direction: column; justify-content: center; gap: 4px; }
.rec-title { font-size: 13px; font-weight: 600; color: #262626; }
.rec-price { font-size: 14px; font-weight: 700; color: #eb2f96; }

/* 输入中动画 */
.typing-dots { display: flex; gap: 4px; padding: 10px 14px; }
.typing-dots span {
  width: 7px; height: 7px;
  background: #d9d9d9;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%,60%,100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-6px); } }

/* 输入区 */
.chat-input-area { padding: 12px 16px; border-top: 1px solid #f0f0f0; background: white; }
.input-hints {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.hint {
  font-size: 11px;
  color: #8c8c8c;
  cursor: pointer;
  transition: color 0.2s;
}
.hint:hover { color: #eb2f96; }

/* 过渡动画 */
.slide-up-enter-active { animation: slideUp 0.35s ease-out; }
.slide-up-leave-active { animation: slideUp 0.25s ease-in reverse; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
