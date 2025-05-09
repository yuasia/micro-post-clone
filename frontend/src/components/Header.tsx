import { getUser } from "../api/User";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { userInfo, setUserInfo } = useContext(UserContext);

  const logout = () => {
    setUserInfo({ id: 0, token: "" });
    navigate("/");
  };

  useEffect(() => {
    const myGetUser = async () => {
      const user = await getUser(userInfo.id, userInfo.token);
      setUserName(user.name);
    };

    myGetUser();
  }, []);

  return (
    <SHeader>
      <SLogo>MicroPost</SLogo>
      <SUserInfo>
        <SUserName>{userName}</SUserName>
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

const SUserName = styled.div`
  font-size: 18px;
`;

const SLogoutButton = styled.button`
  background: #444444;
  border: 1px solid white;
  border-radius: 9px;
  padding: 10px 20px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: white;
    color: #444444;
    border: 1px solid #444444;
  }
`;
