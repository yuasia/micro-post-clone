import styled from "styled-components";
import { ReactNode, useEffect } from "react";
import { UserContext } from "../providers/UserProvider";
import React, { useContext, useState } from "react";

const Post = (props: any) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const { userInfo } = useContext(UserContext);
  const { post, onDelete } = props;

  useEffect(() => {
    const updateAvatarUrl = () => {
      if (userInfo.avatar_url) {
        setAvatarUrl(userInfo.avatar_url);
      }
    };

    updateAvatarUrl();
  });

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
    <PPostCard>
      <PPostFrame>
        <div>
          <PPostHeader>
            <PUserAvatar alt="User Avatar" src={avatarUrl} />
            <PDate>{post.created_at}</PDate>
          </PPostHeader>
          <div>{getLines(post.content)}</div>{" "}
        </div>
        <PDeleteButton onClick={handleDelete}>削除</PDeleteButton>
      </PPostFrame>
    </PPostCard>
  );
};

export default Post;

const PPostCard = styled.div`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ccc;
`;

const PPostFrame = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 60px;
  align-items: center;
`;

const PPostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PDate = styled.span`
  margin-left: 8px;
  font-size: small;
  color: #000044;
`;

const PDeleteButton = styled.button`
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

const PUserAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: border 0.2s ease, box-shadow 0.2 ease;
`;
