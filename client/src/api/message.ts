import request from "./request";

export interface Message {
  id?: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  content: string;
  isRead?: boolean;
  createTime?: string;
}

export const sendMessage = (data: Message) => {
  return request.post("/messages", data) as Promise<Message>;
};

export const getChatHistory = (userId1: number, userId2: number) => {
  return request.get("/messages/chat", { params: { userId1, userId2 } }) as Promise<Message[]>;
};

export const getUnreadCount = (userId: number) => {
  return request.get(`/messages/unread-count/${userId}`) as Promise<number>;
};

export const getUserMessages = (userId: number) => {
  return request.get(`/messages/list/${userId}`) as Promise<Message[]>;
};

export const deleteMessage = (id: number) => {
  return request.delete(`/messages/${id}`) as Promise<string>;
};
