import axios from 'axios';
import { FPTLIBEX_API } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
// Lấy Base URL từ biến môi trường
const BASE_URL = FPTLIBEX_API || 'https://fptlibex-api.gphan.website/fptlibex';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // timeout 10s
});

// Thêm interceptor cho Request
axiosClient.interceptors.request.use(
  async (config) => {
    // Có thể thêm Authorization Token ở đây trước khi gửi request
    // Ví dụ:
    const token = await AsyncStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho Response
axiosClient.interceptors.response.use(
  (response) => {
    // Bạn có thể parse luôn payload data ở đây để dùng cho tiện
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
