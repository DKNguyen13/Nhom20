import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((req) => {
  if (accessToken && req.headers) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
});

// Response interceptor: tự động refresh token nếu 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // nếu 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // thử refresh token
        const res = await api.post("/auth/refresh-token");
        const newAccessToken = res.data.accessToken;

        // update accessToken trong memory
        setAccessToken(newAccessToken);

        // attach token mới vào request cũ
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // retry request gốc
        return api(originalRequest);
      } catch {
        // refresh token hết hạn → gọi logout server
        await api.post("/auth/logout").catch(() => {});

        // xóa dữ liệu client
        setAccessToken(null);
        window.localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
