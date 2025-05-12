import React from "react";
import { ReactNode } from "react";
import styled from "styled-components";

const Post = (props: any) => {
  const { post, onDelete } = props;

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

  const handleDelete = () => {
    onDelete(post.id);
  };

  return (
    <SPostCard>
      <SPostFrame>
        <div>
          <SPostHeader>
            <SName>{post.user_name}</SName>
            <SDate>{post.created_at}</SDate>
          </SPostHeader>
          <div>{getLines(post.content)}</div>{" "}
        </div>
        <SDeleteButton onClick={handleDelete}>削除</SDeleteButton>
      </SPostFrame>
    </SPostCard>
  );
};

export default Post;

const SPostCard = styled.div`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ccc;
`;

const SPostFrame = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 60px;
  align-items: center;
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

const SDeleteButton = styled.button`
  background:white;
  color: #444444;
  width: 60px;
  height: 30px;
  border: 1px solid #444444;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  cursor pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #444444;
    color: white;
    }
  `;
