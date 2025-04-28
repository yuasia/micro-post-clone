import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { getList, post } from "../api/Post";
import { PostListContext, PostType } from "../providers/PostListProvider";

const SideBar = () => {
  const [msg, setMsg] = useState("");

  const { userInfo } = useContext(UserContext);
  const { setPostList } = useContext(PostListContext);

  const getPostList = async () => {
    const posts = await getList(userInfo.token);
    console.log(posts);
    let postList: Array<PostType> = [];
    if (posts) {
      console.log(posts);
      posts.forEach((post: any) => {
        postList.push({
          id: post.id,
          user_name: post.user_name,
          content: post.content,
          created_at: new Date(post.created_at).toLocaleString(),
        });
      });
    }

    setPostList(postList);
  };

  const onSendClick = () => {
    post(String(userInfo.id), String(userInfo.token), msg);
  };

  return (
    <div>
      <div>hoge</div>
      <div>hoge@example.com</div>
      <div>
        <textarea
          rows={4}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></textarea>
      </div>
      <div>
        <button onClick={onSendClick}>送信</button>
      </div>
    </div>
  );
};

export default SideBar;
