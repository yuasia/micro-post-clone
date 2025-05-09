import styled from "styled-components";
import { getList, post } from "../api/Post";
import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { PostListContext, PostType } from "../providers/PostListProvider";
import { PageContext } from "../providers/pageProvider";

const SideBar = () => {
  const [msg, setMsg] = useState("");

  const postsPerPage = 10;

  const { userInfo } = useContext(UserContext);
  const { setPostList } = useContext(PostListContext);
  const { page } = useContext(PageContext);

  const getPostList = async () => {
    const start = (page - 1) * postsPerPage;
    const posts = await getList(userInfo.token, start, postsPerPage);
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

  const onSendClick = async () => {
    post(String(userInfo.id), String(userInfo.token), msg);
    await getPostList();
    setMsg("");
  };

  return (
    <SPostForm>
      <SPostTitle>新規投稿</SPostTitle>
      <SFormGroup>
        <STextArea
          rows={4}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></STextArea>
        <SButton onClick={onSendClick}>送信</SButton>
      </SFormGroup>
    </SPostForm>
  );
};

export default SideBar;

const SPostForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
`;

const SPostTitle = styled.div`
  font-size: 22px;
  color: #444444;
  margin-bottom: 20px;
  font-weight: bold;

  &::after {
    content: "";
    display: block;
    width: 40px;
    height: 3px;
    background-color: #444444;
    margin: 8px auto 0;
    border-radius: 2px;
  }
`;

const SFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const STextArea = styled.textarea`
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  min-height: 500px;

  &:focus {
    border-color: #444444;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0, 2);
  }
`;

const SButton = styled.button`
  width: 30%;
  padding: 10px 20px;
  background: #444444;
  color: white;
  font-weight: bold;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: white;
    color: #444444;
    border: 1px solid #444444;
  }
`;
