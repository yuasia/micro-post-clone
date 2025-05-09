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

export const post = async (user_id: string, token: string, msg: string) => {
  const data = {
    message: msg,
  };

  const url = `http://localhost:3001/post?user_id=${user_id}&token=${token}`;
  const res = await axios.post(url, data);
};
