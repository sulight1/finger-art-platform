import request from "./request";

export interface CustomRequest {
  id?: number;
  title: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  description: string;
  status?: string;
  createdAt?: string;
  buyer?: any;
}

export const createCustomRequest = (data: CustomRequest) => {
  return request.post("/custom-requests", data) as Promise<CustomRequest>;
};

export const getAllCustomRequests = () => {
  return request.get("/custom-requests") as Promise<CustomRequest[]>;
};

export const getCustomRequestById = (id: number) => {
  return request.get(`/custom-requests/${id}`) as Promise<CustomRequest>;
};

export const updateCustomRequestStatus = (id: number, status: string) => {
  return request.patch(`/custom-requests/${id}/status`, { status }) as Promise<CustomRequest>;
};

export const deleteCustomRequest = (id: number) => {
  return request.delete(`/custom-requests/${id}`) as Promise<string>;
};
