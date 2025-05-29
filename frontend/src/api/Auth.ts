import axios from "axios";

export const login = async (email: string, password: string) => {
  const url = "http://localhost:3001/auth/login";
  const res = await axios.post(url, {
    email,
    password,
  });
  return res.data;
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
