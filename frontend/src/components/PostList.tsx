import Post from "./Post";
import { getList } from "../api/Post";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { PostListContext, PostType } from "../providers/PostListProvider";
import { PageContext } from "../providers/pageProvider";

const PostList = () => {
  const postsPerPage = 10;

  const { postList, setPostList } = useContext(PostListContext);
  const { userInfo } = useContext(UserContext);
  const { page, setPage } = useContext(PageContext);

  const getPostList = async () => {
    const start = (page - 1) * postsPerPage;
    const posts = await getList(userInfo.token, start, postsPerPage);

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
      <SPostTitle>Post List</SPostTitle>
      {postList.map((post: PostType) => (
        <Post key={post.id} post={post} />
      ))}
      <SBtnGroup>
        <SPaginationButton
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          前へ
        </SPaginationButton>
        <SPaginationButton onClick={() => setPage(page + 1)}>
          後へ
        </SPaginationButton>
      </SBtnGroup>
    </SPostList>
  );
};

export default PostList;

const SPostList = styled.div`
  padding-top: 24px;
  height: 100%;
  overflow-y: auto;
  text-align: center;
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

const SBtnGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 30px;
`;

const SPaginationButton = styled.button`
  background: #555555;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #333333;
  }
`;
