import React from "react";
import { ReactNode } from "react";

const Post = (props: any) => {
  const { children, post } = props;

  const getLines = (src: string): ReactNode => {
    return src.split("\n").map((line, index) => {
      return (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      );
    });
  };

  return (
    <div>
      <div>{post.created_at}</div>
      <div>{post.user_name}</div>
      <div>{getLines(post.content)}</div>
    </div>
  );
};

export default Post;
