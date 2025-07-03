import axios from "axios";
import { API_CONFIG, API_ENDPOINTS } from "../config/api.config";

export const getList = async (
  token: string,
  start: number,
  nr_records: number
) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.POST.LIST}?token=${token}&start=${start}&nr_records=${nr_records}`;
  const res = await axios.get(url);
  return res.data;
};

export const getSearchList = async (token: string, keyword: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.POST.SEARCH}?token=${token}&keyword=${keyword}`;
  const res = await axios.get(url);
  return res.data;
};

export const post = async (user_id: string, token: string, msg: string) => {
  const data = {
    message: msg,
  };

  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.POST.CREATE}?token=${token}&user_id=${user_id}`;
  await axios.post(url, data);
};

export const getPostCount = async (token: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.POST.COUNT}?token=${token}`;
  const res = await axios.get(url);
  return res.data;
};

export const deletePost = async (id: number, token: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.POST.DELETE(
    id
  )}?token=${token}`;
  await axios.delete(url);
};
