import request from './request';

export interface ProductItem {
  id: number;
  title: string;
  price: number;
  type: string;       // READY_MADE 或 CUSTOMIZABLE
  creatorId?: number;
  creator: string;
  creatorAvatar?: string;
  image: string;
  likes: number;
  status: string;      // PENDING / APPROVED / REJECTED
  category?: string;   // 作品分类：crochet/resin/nails/clay/flower
  craftTechnique?: string;  // 制作工艺
}

export interface CraftTechniqueItem {
  id: number;
  category: string;
  name: string;
  label: string;
}

export const getProducts = (params?: { scope?: string; type?: string; category?: string; craftTechnique?: string }) => {
  return request.get('/products', { params }) as Promise<ProductItem[]>;
};

export const getProductById = (id: number) => {
  return request.get(`/products/${id}`) as Promise<ProductItem>;
};

export const createProduct = (data: Partial<ProductItem>) => {
  return request.post('/products', data) as Promise<ProductItem>;
};

export const updateProduct = (id: number, data: Partial<ProductItem>) => {
  return request.put(`/products/${id}`, data) as Promise<ProductItem>;
};

export const likeProduct = (id: number) => {
  return request.post(`/products/${id}/like`) as Promise<ProductItem>;
};

export const auditProduct = (id: number, status: string) => {
  return request.post(`/products/${id}/audit`, null, { params: { status } }) as Promise<ProductItem>;
};

export const deleteProduct = (id: number) => {
  return request.delete(`/products/${id}`) as Promise<string>;
};

export const getCraftTechniques = (category?: string) => {
  const params = category ? { category } : undefined;
  return request.get('/craft-techniques', { params }) as Promise<CraftTechniqueItem[]>;
};
