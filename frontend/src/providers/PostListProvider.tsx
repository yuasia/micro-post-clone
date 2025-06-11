import { createContext, useState } from "react";

export type PostType = {
  id: number;
  user_id: number;
  user_name: string;
  avatar_url: string;
  content: string;
  created_at: string;
};

export const PostListContext = createContext(
  {} as {
    postList: PostType[];
    setPostList: React.Dispatch<React.SetStateAction<PostType[]>>;
  }
);

export const PostListProvider = (props: any) => {
  const { children } = props;
  const [postList, setPostList] = useState<PostType[]>([]);

  return (
    <PostListContext.Provider value={{ postList, setPostList }}>
      {children}
    </PostListContext.Provider>
  );
};
