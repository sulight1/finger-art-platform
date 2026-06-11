import axios from 'axios';
import { message } from 'ant-design-vue';

// Create axios instance
const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000
});

// Response interceptor: unwrap Spring Boot Result<T> wrapper
request.interceptors.response.use(
  response => {
    const res = response.data;
    if (res && res.code === 200) {
      return res.data;
    }
    if (res && res.code) {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  error => {
    const msg = error.response?.data?.message || '网络请求失败';
    message.error(msg);
    return Promise.reject(error);
  }
);

export default request;
