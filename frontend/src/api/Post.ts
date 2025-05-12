import axios from "axios";

export const getList = async (
  token: string,
  start: number,
  nr_records: number
) => {
  const url = `http://localhost:3001/post?token=${token}&start=${start}&records=${nr_records}`;
  const res = await axios.get(url);
  return res.data;
};

export const getSearchList = async (token: string, keyword: string) => {
  const url = `http://localhost:3001/post/search?token=${token}&keyword=${keyword}`;
  const res = await axios.get(url);
  return res.data;
};

export const post = async (user_id: string, token: string, msg: string) => {
  const data = {
    message: msg,
  };

  const url = `http://localhost:3001/post?user_id=${user_id}&token=${token}`;
  const res = await axios.post(url, data);
};

export const getPostCount = async (token: string) => {
  const url = `http://localhost:3001/post/count?token=${token}`;
  const res = await axios.get(url);
  return res.data;
};

export const deletePost = async (id: number, token: string) => {
  const url = `http://localhost:3001/post/${id}?token=${token}`;
  const res = await axios.delete(url);
};
