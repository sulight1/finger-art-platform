import request from "./request";

export const getSystemStats = () => {
  return request.get("/stats/summary") as Promise<any>;
};
