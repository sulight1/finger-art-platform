import request from './request';

// ========== AI 文案生成 ==========
export interface CopywritingResult {
  title: string;
  description: string;
  tags: string[];
  style: string;
}

export const generateCopywriting = (data: {
  imageUrl?: string;
  keywords?: string;
  style?: string;
}) => {
  return request.post('/ai/generate-copywriting', data) as Promise<CopywritingResult>;
};

// ========== AI 灵感绘图 ==========
export interface DrawResult {
  imageUrl: string;
  prompt: string;
  seed: string;
}

export const generateDrawing = (data: {
  prompt: string;
  negativePrompt?: string;
  style?: string;
}) => {
  return request.post('/ai/generate-drawing', data) as Promise<DrawResult>;
};

// ========== AI 造物管家聊天 ==========
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResult {
  reply: string;
  recommendations?: {
    id: number;
    title: string;
    price: number;
    image: string;
  }[];
}

export const aiChat = (messages: ChatMessage[]) => {
  return request.post('/ai/chat', { messages }) as Promise<ChatResult>;
};

// ========== AI 智能推荐 ==========
export interface RecommendResult {
  keywords: string[];
  products: {
    id: number;
    title: string;
    price: number;
    image: string;
    reason: string;
  }[];
}

export const aiRecommend = (query: string) => {
  return request.post('/ai/recommend', { query }) as Promise<RecommendResult>;
};
