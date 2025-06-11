import { getUser } from "../api/User";
import { Search } from "lucide-react";
import styled from "styled-components";
import { getList, getSearchList } from "../api/Post";
import { Link, useNavigate } from "react-router-dom";
import { PageContext } from "../providers/pageProvider";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { SearchContext } from "../providers/SearchProvider";
import { PostListContext, PostType } from "../providers/PostListProvider";
import { get } from "http";

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [inputText, setInputText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const postsPerPage = 10;

  const { page } = useContext(PageContext);
  const { setPostList } = useContext(PostListContext);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { searchText, setSearchText } = useContext(SearchContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = await getUser(userInfo.id, userInfo.token);
      setAvatarUrl(user.avatar_url);
    };

    fetchUserInfo();
  }, []);

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
    let posts = await getSearchList(userInfo.token, searchText);

    if (!searchText) {
      const start = (page - 1) * postsPerPage;
      posts = await getList(userInfo.token, start, postsPerPage);
    }

    let postList: Array<PostType> = [];
    if (posts) {
      posts.forEach((post: PostType) => {
        postList.push({
          id: post.id,
          user_name: post.user_name,
          avatar_url: post.avatar_url,
          content: post.content,
          created_at: new Date(post.created_at).toLocaleString(),
        });
      });

      setPostList(postList);
    }
  };

  const logout = () => {
    setUserInfo({ id: 0, token: "", name: "", email: "", avatar_url: "" });
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_avatar");
  };

  useEffect(() => {
    const myGetUser = async () => {
      const user = await getUser(userInfo.id, userInfo.token);
      setUserName(user.name);
      setUserEmail(user.email);
      setUpdateDate(new Date(user.updated_at).toISOString().split("T")[0]);
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
        <SUserInfoContainer
          onMouseEnter={() => setShowDialog(true)}
          onMouseLeave={() => setShowDialog(false)}
        >
          {showDialog && (
            <SUserDialog>
              <SUserContent>
                <SUserDialogTitle>User Information</SUserDialogTitle>
                <SUserDialogContent>
                  <p className="label">User Name</p>
                  <p className="value">{userName}</p>
                  <p className="label">Email</p>
                  <p className="value">{userEmail}</p>
                  <p className="label">Last Update</p>
                  <p className="value">{updateDate}</p>
                </SUserDialogContent>
              </SUserContent>
            </SUserDialog>
          )}
          <SUserNameLink to={"/update"}>
            <SUserAvatar alt="User Avatar" src={avatarUrl} />
          </SUserNameLink>
        </SUserInfoContainer>
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

const SUserInfoContainer = styled.div`
  position: relative;
`;

const SUserDialog = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  height: 400px;
  width: 400px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding 20px;
  gap: 20px;
  z-index: 10;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SUserContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SUserDialogTitle = styled.p`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;

  &::after {
    content: "";
    display: block;
    width: 60px;
    height: 3px;
    background-color: #555555;
    margin: 8px auto 0;
    border-radius: 2px;
  }
`;

const SUserDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  padding: 0 24px;
  box-sizing: border-box;

  p.label {
    font-weight: bold;
    color: #6666ff;
    margin: 0;
  }

  p.value {
    margin: 4px 0;
    color: #222;
  }
`;

const SUserAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: border 0.2s ease, box-shadow 0.2 ease;
  cursor: pointer;

  &:hover {
    border: 2px solid #6666ff;
    box-shadow: 0 0 5px rgba(102, 102, 255, 0.5);
  }
`;
