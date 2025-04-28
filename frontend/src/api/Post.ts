import axios from "axios";

export const getList = async (token: string) => {
  const url = `http://localhost:3001/post?token=${token}&records=10`;
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
