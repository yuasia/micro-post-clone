import axios from "axios";

export const post = async (user_id: string, token: string, msg: string) => {
  const data = {
    message: msg,
  };

  const url = `http://localhost:3001/post?user_id=${user_id}&token=${token}`;
  const res = await axios.post(url, data);
  console.log("Post response:", res.data);
};
