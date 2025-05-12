import { getUser } from "../api/User";
import { getSearchList } from "../api/Post";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { SearchContext } from "../providers/SearchProvider";
import { PostListContext, PostType } from "../providers/PostListProvider";
import { Search } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [inputText, setInputText] = useState("");
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { setPostList } = useContext(PostListContext);
  const { searchText, setSearchText } = useContext(SearchContext);

  /*
   * 不要なAPIコールを避けるために、300msの遅延を設けている
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchText(inputText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputText]);

  const getSearchedPost = async () => {
    const posts = await getSearchList(userInfo.token, searchText);

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

  const logout = () => {
    setUserInfo({ id: 0, token: "" });
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
  };

  useEffect(() => {
    const myGetUser = async () => {
      const user = await getUser(userInfo.id, userInfo.token);
      setUserName(user.name);
    };

    myGetUser();
  }, []);

  useEffect(() => {
    getSearchedPost();
  }, [searchText]);

  return (
    <SHeader>
      <SLogo>MicroPost</SLogo>
      <SSearchWrapper>
        <SSearchIcon>
          <Search />
        </SSearchIcon>
        <SSearchInput
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="投稿内容を検索"
        ></SSearchInput>
      </SSearchWrapper>

      <SUserInfo>
        <SUserNameLink to={"/profile"}>{userName}</SUserNameLink>
        <SLogoutButton onClick={logout}>Logout</SLogoutButton>
      </SUserInfo>
    </SHeader>
  );
};

export default Header;

const SHeader = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  background-color: #ffffff;
  color: #444444;
  font-weight: bold;
`;

const SLogo = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const SUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const SUserNameLink = styled(Link)`
  color: #444444;
  text-decoration: none;

  &:hover {
    color: #6666ff;
    text-decoration: underline;
  }
`;

const SLogoutButton = styled.button`
  background: white;
  color: #444444;
  border: 1px solid #444444;
  border-radius: 9px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #444444;
    color: white;
  }
`;

const SSearchWrapper = styled.div`
  position: relative;
  width: 300px;
`;

const SSearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
`;

const SSearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 40px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
  height: 25px;

  &:focus {
    outline: none;
    border-color: #6666ff;
    box-shadow: 0 0 5px #6666ff;
  }
`;
