import Post from "./Post";
import { getList } from "../api/Post";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { PostListContext, PostType } from "../providers/PostListProvider";
import styled from "styled-components";

const PostList = () => {
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  const { postList, setPostList } = useContext(PostListContext);
  const { userInfo } = useContext(UserContext);

  const getPostList = async () => {
    const posts = await getList(userInfo.token);
    console.log(posts);

    let postList: Array<PostType> = [];
    if (posts) {
      posts.forEach((post: PostType) => {
        postList.push({
          id: post.id,
          user_name: post.user_name,
          content: post.content,
          created_at: new Date(post.created_at).toLocaleString(),
        });
      });

      setPostList(postList);
    }
  };

  useEffect(() => {
    getPostList();
  }, [page]);

  return (
    <SPostList>
      <SPostTitle>PostList</SPostTitle>
      {postList.map((post: PostType) => (
        <Post key={post.id} post={post} />
      ))}
    </SPostList>
  );
};

export default PostList;

const SPostList = styled.div`
  margin-top: 24px;
  height: 100%;
  overflow-y: auto;
`;

const SPostTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #444444;
  margin-bottom: 24px;

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
