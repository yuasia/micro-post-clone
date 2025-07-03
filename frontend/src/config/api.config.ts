export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
    REQUEST_RESET: "/auth/request-reset",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USER: {
    CREATE: "/user",
    GET: (id: number) => `/user/${id}`,
    UPDATE: "/user/update",
    DELETE: "/user/delete",
  },
  POST: {
    LIST: "/post",
    SEARCH: "/post/search",
    CREATE: "/post",
    COUNT: "/post/count",
    DELETE: (id: number) => `/post/${id}`,
  },
} as const;
