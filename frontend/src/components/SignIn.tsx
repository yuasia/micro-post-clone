import { sign_in } from "../api/Auth";
import styled from "styled-components";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";

const SignIn = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [pass, setPass] = useState("");

  const { userInfo, setUserInfo } = useContext(UserContext);

  const onSignInClick = async () => {
    const ret = await sign_in(userId, pass);
    console.log(ret);
    if (ret && ret.token) {
      setUserInfo({
        id: ret.user_id,
        token: ret.token,
      });
      navigate("/main");
    }
  };

  return (
    <SSignInFrame>
      <SignInTitle>Sign In</SignInTitle>
      <SSignInRow>
        <SSignInLabel htmlFor="id">ID</SSignInLabel>
        <SSignInInput
          id="id"
          value={userId}
          type="text"
          onChange={(e) => setUserId(e.target.value)}
        />
      </SSignInRow>
      <SSignInRow>
        <SSignInLabel htmlFor="id">PASSWORD</SSignInLabel>
        <SSignInInput
          id="password"
          value={pass}
          type="text"
          onChange={(e) => setPass(e.target.value)}
        />
      </SSignInRow>
      <SSignInRow>
        <SLoginButton type="button" onClick={onSignInClick}>
          Login
        </SLoginButton>
      </SSignInRow>
    </SSignInFrame>
  );
};

export default SignIn;

const SSignInFrame = styled.div`
  display: flex;
  padding: 32px;
  max-width: 400px;
  align-items: center;
  margin: 100px auto;
  border-radius: 12px;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SignInTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 24px;
  color: #555555;

  &::after {
    content: "";
    display: block;
    width: 40px;
    height: 3px;
    background-color: #555555;
    margin: 8px auto 0;
    border-radius: 2px;
  }
`;

const SSignInRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
`;

const SSignInLabel = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
  color: #444444;
`;

const SSignInInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  outline: none;
  text-align: center;

  &:focus {
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const SLoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #444444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #222222;
  }
`;
