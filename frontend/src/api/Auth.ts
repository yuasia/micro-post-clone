import axios from "axios";
import { API_CONFIG, API_ENDPOINTS } from "../config/api.config";

export const login = async (email: string, password: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
  const res = await axios.post(url, {
    email,
    password,
  });
  return res.data;
};

export const verifyOTP = async (user_id: number, otp: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.VERIFY_OTP}`;
  const res = await axios.post(url, {
    user_id,
    otp,
  });
  return res.data;
};

export const requestPasswordReset = async (email: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REQUEST_RESET}`;
  const res = await axios.post(url, {
    email,
  });
  return res.data;
};

export const resetPassword = async (token: string, password: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`;
  const res = await axios.post(url, {
    token,
    password,
  });
  return res.data;
};
