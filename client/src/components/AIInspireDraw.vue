<template>
  <a-modal v-model:open="visible" title="🎨 AI 灵感绘图" width="700px" :footer="null">
    <div class="draw-container">
      <!-- 输入区 -->
      <div class="draw-input">
        <a-form layout="vertical">
          <a-form-item label="描述你想要的画面">
            <a-textarea
              v-model:value="prompt"
              placeholder="例如：古风少女佩戴红色缠花发簪，水墨背景，柔光滤镜，手绘风格..."
              :rows="3"
              size="large"
            />
          </a-form-item>
          <div class="draw-controls">
            <a-form-item label="画面风格" style="margin-bottom:0">
              <a-select v-model:value="drawStyle" style="width:160px">
                <a-select-option value="handcraft">手作质感</a-select-option>
                <a-select-option value="ink">水墨国风</a-select-option>
                <a-select-option value="realistic">写实摄影</a-select-option>
                <a-select-option value="illustration">插画风格</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item style="margin-bottom:0">
              <a-button type="primary" @click="handleDraw" :loading="drawing" size="large"
                style="height:48px;min-width:140px;border-radius:14px">
                🎨 生成灵感图
              </a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>

      <!-- 结果展示 -->
      <transition name="fade">
        <div class="draw-result" v-if="resultImage">
          <a-divider>生成结果</a-divider>
          <div class="result-image-box">
            <img :src="resultImage" alt="AI generated" />
            <div class="image-overlay">
              <span class="prompt-hint">{{ prompt }}</span>
            </div>
          </div>
          <div class="result-actions">
            <a-button type="primary" ghost @click="downloadImage" :loading="downloading">下载图片</a-button>
            <a-button @click="applyToPublish">应用到发布</a-button>
            <a-button @click="handleDraw" :loading="drawing">重新生成</a-button>
          </div>
        </div>
      </transition>

      <!-- 灵感参考 -->
      <div class="inspiration-wall" v-if="!resultImage">
        <h4>💡 灵感参考</h4>
        <div class="inspo-grid">
          <div v-for="item in inspirations" :key="item.prompt" class="inspo-card"
            @click="prompt = item.prompt; drawStyle = item.style">
            <div class="inspo-cover">{{ item.emoji }}</div>
            <span class="inspo-text">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { generateDrawing } from '../api/ai';

const visible = defineModel<boolean>('open', { required: true });

const prompt = ref('');
const drawStyle = ref('handcraft');
const drawing = ref(false);
const downloading = ref(false);
const resultImage = ref('');

const inspirations = [
  { emoji: '🏮', label: '新中式发簪', prompt: '新中式发簪，红色缠花，金色凤凰纹样，古风柔光', style: 'ink' },
  { emoji: '💎', label: '滴胶耳环', prompt: '透明滴胶耳环，干花嵌入，阳光透射，微距摄影', style: 'realistic' },
  { emoji: '🎵', label: '音乐节穿搭', prompt: '夸张亚克力拼接耳环，荧光色，舞台灯光，潮流风格', style: 'illustration' },
  { emoji: '🌸', label: '团扇摆件', prompt: '古法缠花团扇，牡丹图案，深色背景，手工艺展示', style: 'handcraft' },
  { emoji: '🐱', label: '黏土公仔', prompt: '超轻粘土猫咪公仔，温馨桌面，柔光，可爱风格', style: 'handcraft' },
  { emoji: '💅', label: '穿戴甲设计', prompt: '精致穿戴甲，星月图案，粉色渐变，美甲展示', style: 'realistic' },
];

const handleDraw = async () => {
  if (!prompt.value.trim()) {
    message.warning('请输入画面描述');
    return;
  }
  drawing.value = true;
  resultImage.value = ''; 
  
  let retryCount = 0;
  const maxRetries = 3;

  const attemptDraw = async (): Promise<string> => {
    const fullPrompt = `${prompt.value}${getStyleSuffix(drawStyle.value)}, high quality, highly detailed`;
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;

    try {
      // 使用 fetch 探测响应内容类型
      const response = await fetch(imageUrl, { method: 'GET' });
      const contentType = response.headers.get('content-type');
      
      // 如果返回的是 JSON，说明是错误信息（如队列已满）
      if (contentType && contentType.includes('application/json')) {
        const errData = await response.json();
        if (errData.error && errData.error.includes('Queue full')) {
          throw new Error('QUEUE_FULL');
        }
        throw new Error('API_ERROR');
      }

      if (!response.ok) throw new Error('NETWORK_ERROR');

      return imageUrl;
    } catch (err: any) {
      if (err.message === 'QUEUE_FULL' && retryCount < maxRetries) {
        retryCount++;
        message.loading({ content: `AI 队列繁忙，正在进行第 ${retryCount} 次自动重试...`, key: 'ai_retry' });
        await new Promise(resolve => setTimeout(resolve, 3000)); // 等待 3 秒后重试
        return attemptDraw();
      }
      throw err;
    }
  };

  try {
    const finalUrl = await attemptDraw();
    
    // 预加载图片确保渲染流畅
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error('IMAGE_LOAD_FAILED'));
      img.src = finalUrl;
    });

    resultImage.value = finalUrl;
    message.success({ content: 'AI 灵感图生成成功！', key: 'ai_retry' });
  } catch (err: any) {
    console.error('AI 绘图最终失败:', err);
    if (err.message === 'QUEUE_FULL') {
      message.error({ content: 'AI 绘图队列已满（尝试 3 次均繁忙），请稍等 1 分钟后再试', key: 'ai_retry', duration: 5 });
    } else {
      message.error({ content: 'AI 绘图暂时繁忙，请稍后再试或简化描述词', key: 'ai_retry' });
    }
  } finally {
    drawing.value = false;
  }
};

const getStyleSuffix = (style: string) => {
  const suffixes: Record<string, string> = {
    handcraft: ', handmade craft texture, soft lighting, artisan quality',
    ink: ', ink wash painting style, traditional Chinese art',
    realistic: ', photorealistic, macro photography, 8K detail',
    illustration: ', digital illustration, vibrant colors, trendy'
  };
  return suffixes[style] || '';
};

const downloadImage = async () => {
  if (!resultImage.value) return;
  
  downloading.value = true;
  message.loading({ content: '正在处理图像下载...', key: 'downloading' });
  
  try {
    // 尝试通过 fetch 获取图片 Blob
    const response = await fetch(resultImage.value, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `ai-inspiration-${Date.now()}.png`;
    
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    message.success({ content: '图片已开始下载', key: 'downloading' });
  } catch (err) {
    console.error('Blob下载失败，回退到普通下载:', err);
    // 回退方案：直接在新窗口打开
    try {
      const link = document.createElement('a');
      link.href = resultImage.value;
      link.target = '_blank';
      link.download = `ai-inspiration-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.info({ content: '已为您在新窗口打开图片，请右键另存为', key: 'downloading', duration: 4 });
    } catch (fallbackErr) {
      window.open(resultImage.value, '_blank');
      message.error({ content: '下载失败，请手动保存图片', key: 'downloading' });
    }
  } finally {
    downloading.value = false;
  }
};

const applyToPublish = () => {
  if (!resultImage.value) return;
  // 存储到 localStorage，各发布页读取
  localStorage.setItem('ai_generated_image', resultImage.value);
  message.success('已将 AI 灵感图保存，打开发布弹窗即可自动加载');
  visible.value = false;
};
</script>

<style scoped>
.draw-container { padding: 4px; }

.draw-controls {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.result-image-box {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
}

.result-image-box img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  padding: 40px 20px 16px;
  color: rgba(255,255,255,0.8);
  font-size: 12px;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.inspiration-wall {
  padding-top: 16px;
}

.inspiration-wall h4 {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.inspo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.inspo-card {
  background: #fdf6f9;
  border: 1px solid #fce4ec;
  border-radius: 14px;
  padding: 20px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.inspo-card:hover {
  border-color: #eb2f96;
  background: #fff;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(235,47,150,0.1);
}

.inspo-cover { font-size: 32px; margin-bottom: 8px; }
.inspo-text { font-size: 12px; color: #595959; font-weight: 500; }

.fade-enter-active { transition: all 0.4s ease; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }
</style>
