import axios from "axios";

export const sign_in = async (user_id: string, password: string) => {
  const url = `http://localhost:3001/auth?user_id=${user_id}&password=${password}`;
  const res = await axios.get(url);
  return res.data;
};
