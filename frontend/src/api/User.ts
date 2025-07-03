import axios from "axios";

import { API_CONFIG, API_ENDPOINTS } from "../config/api.config";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.CREATE}`;
  const data = {
    name: name,
    email: email,
    password: password,
  };

  const res = await axios.post(url, data);
  return res.data;
};

export const getUser = async (user_id: number, token: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.GET(
    user_id
  )}?token=${token}`;
  const res = await axios.get(url);
  return res.data;
};

export const updateUser = async (payload: any) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.UPDATE}`;
  const res = await axios.post(url, payload);
  return res.data;
};

export const deleteUser = async (token: string, password: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.DELETE}`;
  const data = {
    token: token,
    password: password,
  };

  const res = await axios.post(url, data);
  return res.data;
};
