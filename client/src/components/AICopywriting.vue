<template>
  <a-modal v-model:open="visible" title="🤖 AI 智能文案生成" @ok="handleGenerate" :confirmLoading="loading"
    width="640px" :footer="null">
    <div class="copywriting-container">
      <!-- 输入区 -->
      <div class="input-section">
        <a-form layout="vertical">
          <a-form-item label="作品关键词">
            <a-input v-model:value="keywords" placeholder="例如：红色缠花发簪，凤凰图案，复古婚礼" size="large" />
          </a-form-item>
          <a-form-item label="风格偏好">
            <a-radio-group v-model:value="style" button-style="solid" size="small">
              <a-radio-button value="auto">智能识别</a-radio-button>
              <a-radio-button value="y2k">Y2K 千禧风</a-radio-button>
              <a-radio-button value="newChinese">新中式美学</a-radio-button>
              <a-radio-button value="dopamine">多巴胺穿搭</a-radio-button>
              <a-radio-button value="retro">复古文艺</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" block size="large" @click="handleGenerate" :loading="loading"
              style="height:48px;border-radius:14px;font-size:16px">
              ✨ 生成文案
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 结果区 -->
      <transition name="fade">
        <div class="result-section" v-if="result">
          <a-divider>生成结果</a-divider>
          <div class="result-card">
            <div class="result-field">
              <span class="field-label">作品标题</span>
              <div class="field-value title">{{ result.title }}</div>
            </div>
            <div class="result-field">
              <span class="field-label">详情描述</span>
              <div class="field-value desc">{{ result.description }}</div>
            </div>
            <div class="result-field">
              <span class="field-label">推荐标签</span>
              <div class="tag-list">
                <a-tag v-for="t in result.tags" :key="t" color="pink">{{ t }}</a-tag>
              </div>
            </div>
            <div class="result-field">
              <span class="field-label">识别风格</span>
              <a-tag color="purple">{{ styleLabel(result.style) }}</a-tag>
            </div>
          </div>
          <div class="result-actions">
            <a-button type="primary" ghost @click="copyAll">一键复制</a-button>
            <a-button @click="applyToPublish">应用到发布</a-button>
            <a-button @click="handleGenerate" :loading="loading">重新生成</a-button>
          </div>
        </div>
      </transition>

      <!-- 初始引导 -->
      <div class="guide-section" v-if="!result && !loading">
        <div class="guide-examples">
          <h4>💡 试试这些示例：</h4>
          <a-tag class="example-tag" v-for="e in examples" :key="e" @click="keywords = e">{{ e }}</a-tag>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { generateCopywriting, type CopywritingResult } from '../api/ai';

const visible = defineModel<boolean>('open', { required: true });

const keywords = ref('');
const style = ref('auto');
const loading = ref(false);
const result = ref<CopywritingResult | null>(null);

const examples = [
  '红色缠花发簪，凤凰图案，复古婚礼',
  '亚克力拼接耳环，荧光色，音乐节',
  '滴胶干花项链，薰衣草紫色',
  '超轻粘土猫咪摆件，软萌可爱',
  '古法缠花团扇，牡丹图案'
];

const styleLabel = (s: string) => {
  const map: Record<string, string> = { auto: '智能识别', y2k: 'Y2K千禧风', newChinese: '新中式美学', dopamine: '多巴胺穿搭', retro: '复古文艺' };
  return map[s] || s;
};

const handleGenerate = async () => {
  if (!keywords.value.trim()) {
    message.warning('请输入作品关键词');
    return;
  }
  loading.value = true;
  try {
    result.value = await generateCopywriting({
      keywords: keywords.value,
      style: style.value
    });
  } catch {
    // 本地模拟生成
    const kw = keywords.value;
    const titleTemplates = [
      `【手作】${kw} · 匠心定制`,
      `指尖造物 | 原创${kw}`,
      `${kw} — 专属定制 限量发售`
    ];
    const descTemplates = [
      `纯手工${kw}，采用优质材料精心制作。每一件作品都倾注了手作娘的心血与温度，适合日常穿搭或特殊场合佩戴。支持定制尺寸和配色方案。`,
      `这款${kw}融合了传统工艺与现代审美，细节之处尽显匠心。无论自用还是送礼，都是独一无二的选择。`
    ];
    const tags = kw.split(/[,，、]/).filter(Boolean).concat(['手作', '定制', '复古']);

    result.value = {
      title: titleTemplates[Math.floor(Math.random() * titleTemplates.length)],
      description: descTemplates[Math.floor(Math.random() * descTemplates.length)],
      tags: [...new Set(tags)],
      style: style.value === 'auto' ? 'newChinese' : style.value
    };
  } finally {
    loading.value = false;
  }
};

const copyAll = () => {
  if (!result.value) return;
  const text = `标题：${result.value.title}\n描述：${result.value.description}\n标签：${result.value.tags.join('、')}`;
  navigator.clipboard.writeText(text).then(() => message.success('文案已复制到剪贴板'));
};

const applyToPublish = () => {
  if (!result.value) return;
  // 存储到 localStorage，各发布页读取
  localStorage.setItem('ai_copywriting', JSON.stringify(result.value));
  message.success('文案已保存，请打开对应发布弹窗即可自动填充');
  visible.value = false;
};
</script>

<style scoped>
.copywriting-container { padding: 4px; }

.input-section { padding: 8px 0; }

.result-section { padding-top: 8px; }

.result-card {
  background: linear-gradient(135deg, #fdf2f8, #f9f0ff);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}

.result-field { margin-bottom: 16px; }
.result-field:last-child { margin-bottom: 0; }

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #8c8c8c;
  margin-bottom: 6px;
}

.field-value.title { font-size: 18px; font-weight: 800; color: #262626; }
.field-value.desc { font-size: 14px; color: #595959; line-height: 1.7; }

.tag-list { display: flex; gap: 6px; flex-wrap: wrap; }

.result-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.guide-examples {
  text-align: center;
  padding: 20px 0;
}
.guide-examples h4 { font-size: 14px; color: #8c8c8c; margin-bottom: 12px; }
.example-tag {
  cursor: pointer;
  margin: 4px;
  padding: 4px 12px;
  border-radius: 14px;
  transition: all 0.2s;
}
.example-tag:hover { color: #eb2f96; border-color: #eb2f96; }

.fade-enter-active { transition: all 0.4s ease; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }
</style>
