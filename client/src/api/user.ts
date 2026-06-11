import request from "./request";

export interface UserInfo {
  id: number;
  username: string;
  password?: string;
  email?: string;
  role: string;
  avatar?: string;
  bio?: string;
  zaowuBiBalance?: string | number;
}

export const login = (data: { username: string; password: string }) => {
  return request.post("/users/login", data) as Promise<UserInfo>;
};

export const register = (data: { username: string; password: string; role?: string; email?: string }) => {
  return request.post("/users/register", data) as Promise<UserInfo>;
};

export const getProfile = (id: number) => {
  return request.get("/users/profile", { params: { id } }) as Promise<UserInfo>;
};

export const addCoins = (userId: number, amount: number) => {
  return request.post("/users/add-coins", { userId, amount }) as Promise<UserInfo>;
};

export const getAllUsers = () => {
  return request.get("/users") as Promise<UserInfo[]>;
};

export const deleteUser = (id: number) => {
  return request.delete(`/users/${id}`) as Promise<string>;
};

export const updateUser = (id: number, data: Partial<UserInfo>) => {
  return request.put(`/users/${id}`, data) as Promise<UserInfo>;
};

export const followUser = (followerId: number, followingId: number) => {
  return request.post("/users/follow", { followerId, followingId }) as Promise<string>;
};

export const unfollowUser = (followerId: number, followingId: number) => {
  return request.post("/users/unfollow", { followerId, followingId }) as Promise<string>;
};

export const checkFollowing = (followerId: number, followingId: number) => {
  return request.get("/users/is-following", { params: { followerId, followingId } }) as Promise<boolean>;
};

export const getFollowings = (id: number) => {
  return request.get(`/users/${id}/followings`) as Promise<UserInfo[]>;
};

export const getFollowers = (id: number) => {
  return request.get(`/users/${id}/followers`) as Promise<UserInfo[]>;
};
