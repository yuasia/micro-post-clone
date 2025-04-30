import React from "react";
import { ReactNode } from "react";
import styled from "styled-components";

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
    <SPostCard>
      <SPostHeader>
        <SName>{post.user_name}</SName>
        <SDate>{post.created_at}</SDate>
      </SPostHeader>
      <div>{getLines(post.content)}</div>
    </SPostCard>
  );
};

export default Post;

const SPostCard = styled.div`
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #ccc;
`;

const SPostHeader = styled.div`
  display: flex;
  justify-content: space-between;

  align-items: center;
  margin-bottom: 12px;
`;

const SName = styled.span`
  font-size: small;
  color: #000044;
`;

const SDate = styled.span`
  margin-left: 8px;
  font-size: small;
  color: #000044;
`;
