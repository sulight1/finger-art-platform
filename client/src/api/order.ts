import request from "./request";

export interface CustomOrder {
  id?: number;
  buyerId: number;
  buyerName: string;
  artisanId: number;
  artisanName: string;
  productTitle: string;
  price: number;
  requirements: string;
  status: 'PENDING_PAY' | 'PRODUCING' | 'HALF_FINISHED_CONFIRM' | 'PENDING_SHIP' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED';
  createTime?: string;
}

export const createOrder = (data: any) => {
  return request.post("/orders", data) as Promise<CustomOrder>;
};

export const getArtisanOrders = (id: number) => {
  return request.get(`/orders/artisan/${id}`) as Promise<CustomOrder[]>;
};

export const getBuyerOrders = (id: number) => {
  return request.get(`/orders/buyer/${id}`) as Promise<CustomOrder[]>;
};

export const updateOrderStatus = (id: number, status: string) => {
  // 同时支持 Java (PUT + params) 和 NestJS (PATCH + body)
  // 这里优先适配 Java 后端，因为报错信息显示正在使用 Java
  return request.put(`/orders/${id}/status`, null, { params: { status } }) as Promise<CustomOrder>;
};

export const deleteOrder = (id: number) => {
  return request.delete(`/orders/${id}`) as Promise<string>;
};
