<template>
  <div class="order-tracker">
    <div class="tracker-header">
      <h4>{{ title }}</h4>
      <a-tag :color="statusColor(currentStatus)">{{ statusLabel(currentStatus) }}</a-tag>
    </div>

    <!-- 进度条 -->
    <div class="progress-steps">
      <div
        v-for="(step, idx) in steps"
        :key="step.key"
        :class="['step', { active: step.active, completed: step.completed }]"
        @click="step.clickable ? $emit('updateStatus', step.key) : undefined"
      >
        <div class="step-indicator">
          <div class="step-dot">
            <span v-if="step.completed">✓</span>
            <span v-else-if="step.active">●</span>
            <span v-else>○</span>
          </div>
          <div class="step-line" v-if="idx < steps.length - 1"></div>
        </div>
        <div class="step-content">
          <span class="step-title">{{ step.label }}</span>
          <span class="step-desc">{{ step.desc }}</span>
          <span class="step-date" v-if="step.date">{{ step.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title?: string;
  currentStatus: string;
  isVintage?: boolean; // V1.5: 中古订单显示额外节点
}>();

defineEmits(['updateStatus']);

// ===== V1.5 订单状态机 =====
// 新增：wait_aging（等待做旧处理）、wait_material_sourcing（特殊材料寻源）
const baseSteps = [
  { key: 'PENDING_PAY', label: '等待付款', desc: '买家确认订单并支付' },
  { key: 'PRODUCING', label: '制作中', desc: '手作娘开始制作' },
  { key: 'HALF_FINISHED_CONFIRM', label: '确认半成品', desc: '买家确认半成品效果' },
  { key: 'PENDING_SHIP', label: '待发货', desc: '作品打包准备发出' },
  { key: 'RECEIVED', label: '已收货', desc: '买家确认收货' },
  { key: 'COMPLETED', label: '已完成', desc: '订单完成' },
];

// V1.5 新节点：等待做旧处理、特殊材料寻源
const vintageExtraSteps = [
  { key: 'WAIT_AGING', label: '等待做旧处理', desc: '进行复古做旧工艺处理', insertAfter: 'PRODUCING' },
  { key: 'WAIT_MATERIAL_SOURCING', label: '特殊材料寻源', desc: '寻找匹配的复古配件/材料', insertAfter: 'WAIT_AGING' },
];

const steps = computed(() => {
  const result = [...baseSteps];
  if (props.isVintage) {
    // 在 PRODUCING 之后插入做旧和寻源节点
    const idx = result.findIndex(s => s.key === 'PRODUCING');
    if (idx >= 0) {
      result.splice(idx + 1, 0, ...vintageExtraSteps);
    }
  }
  // 标记完成/激活状态
  const currentIdx = result.findIndex(s => s.key === props.currentStatus);
  return result.map((s, i) => ({
    ...s,
    completed: i < currentIdx,
    active: i === currentIdx,
    clickable: false
  }));
});

const statusLabel = (s: string) => {
  const labels: Record<string, string> = {
    PENDING_PAY: '待付款', PRODUCING: '制作中', HALF_FINISHED_CONFIRM: '半成品确认',
    PENDING_SHIP: '待发货', RECEIVED: '已收货', COMPLETED: '已完成',
    CANCELLED: '已取消',
    WAIT_AGING: '做旧处理中', WAIT_MATERIAL_SOURCING: '材料寻源中'
  };
  return labels[s] || s;
};

const statusColor = (s: string) => {
  const colors: Record<string, string> = {
    PENDING_PAY: 'orange', PRODUCING: 'processing', HALF_FINISHED_CONFIRM: 'blue',
    PENDING_SHIP: 'cyan', RECEIVED: 'green', COMPLETED: 'green',
    CANCELLED: 'red',
    WAIT_AGING: 'purple', WAIT_MATERIAL_SOURCING: 'geekblue'
  };
  return colors[s] || 'default';
};
</script>

<style scoped>
.order-tracker {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.tracker-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #262626;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  display: flex;
  gap: 14px;
  padding: 12px 0;
  cursor: default;
  transition: all 0.3s;
}

.step.clickable { cursor: pointer; }
.step.clickable:hover { background: #fafafa; border-radius: 8px; padding: 12px 8px; }

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 24px;
}

.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #8c8c8c;
  border: 2px solid #d9d9d9;
  background: white;
  z-index: 1;
}

.step.completed .step-dot {
  background: #52c41a;
  border-color: #52c41a;
  color: white;
}

.step.active .step-dot {
  background: #eb2f96;
  border-color: #eb2f96;
  color: white;
  box-shadow: 0 0 0 4px rgba(235,47,150,0.15);
}

.step-line {
  width: 2px;
  flex: 1;
  background: #d9d9d9;
  min-height: 20px;
}

.step.completed .step-line { background: #52c41a; }
.step.active .step-line { background: linear-gradient(#eb2f96, #d9d9d9); }

.step-content { flex: 1; padding-bottom: 12px; }

.step-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #595959;
  margin-bottom: 2px;
}

.step.completed .step-title { color: #8c8c8c; }
.step.active .step-title { color: #eb2f96; font-weight: 700; }

.step-desc { font-size: 12px; color: #8c8c8c; }
.step-date { font-size: 11px; color: #bfbfbf; display: block; margin-top: 2px; }
</style>
