import Post from "./Post";
import { getList } from "../api/Post";
import { useContext, useEffect } from "react";
import { UserContext } from "../providers/UserProvider";
import { PostListContext, PostType } from "../providers/PostListProvider";

const PostList = () => {
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
  }, []);

  return (
    <div>
      <p>PostList</p>
      {postList.map((post: PostType) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
