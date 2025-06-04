import axios from "axios";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const url = `http://localhost:3001/user`;
  const data = {
    name: name,
    email: email,
    password: password,
  };

  const res = await axios.post(url, data);
  return res.data;
};

export const getUser = async (user_id: number, token: string) => {
  const url = `http://localhost:3001/user/${user_id}&token=${token}`;
  const res = await axios.get(url);
  return res.data;
};

export const deleteUser = async (token: string, password: string) => {
  const url = `http://localhost:3001/user/delete`;
  const data = {
    token: token,
    password: password,
  };

  const res = await axios.post(url, data);
  return res.data;
};
