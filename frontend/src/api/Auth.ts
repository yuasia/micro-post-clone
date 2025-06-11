import axios from "axios";

export const login = async (email: string, password: string) => {
  const url = "http://localhost:3001/auth/login";
  const res = await axios.post(url, {
    email,
    password,
  });
  return res;
};

export const verifyOTP = async (user_id: number, otp: string) => {
  const url = "http://localhost:3001/auth/verify-otp";
  const res = await axios.post(url, {
    user_id,
    otp,
  });
  return res.data;
};

export const sign_in = async (user_id: string, password: string) => {
  const url = `http://localhost:3001/auth?user_id=${user_id}&password=${password}`;
  const res = await axios.get(url);
  return res.data;
};

export const requestPasswordReset = async (email: string) => {
  const url = "http://localhost:3001/auth/request-reset";
  const res = await axios.post(url, {
    email,
  });
  return res.data;
};

export const resetPassword = async (token: string, password: string) => {
  const url = "http://localhost:3001/auth/reset-password";
  const res = await axios.post(url, {
    token,
    password,
  });
  return res.data;
};
