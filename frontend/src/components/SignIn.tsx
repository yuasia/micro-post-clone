import { useState } from "react";
import styled from "styled-components";
import { login } from "../api/Auth";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");

  const onSignInClick = async () => {
    const ret = await login(email, pass);

    try {
      const ret = await login(email, pass);

      if (ret.data.require_otp) {
        localStorage.setItem("user_id", ret.data.user_id);
        navigate("/verify_otp");
      }
    } catch (error) {
      console.error("Login failed: ", error);

      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "ログインに失敗しました";
        alert(errorMsg);
      } else {
        alert("予期しないエラーが発生しました。もう一度お試しください。");
      }
    }
  };

  return (
    <SSignInFrame>
      <SignInTitle>Micro Post</SignInTitle>
      <SSignInRow>
        <SSignInLabel htmlFor="id">email</SSignInLabel>
        <SSignInInput
          id="id"
          value={email}
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
      </SSignInRow>
      <SSignInRow>
        <SSignInLabel htmlFor="id">password</SSignInLabel>
        <SSignInInput
          id="password"
          value={pass}
          type="password"
          onChange={(e) => setPass(e.target.value)}
        />
      </SSignInRow>
      <SSignInRow>
        <SLoginButton type="button" onClick={onSignInClick}>
          Login
        </SLoginButton>
      </SSignInRow>
      <SLink to="/signup">アカウントをお持ちでない場合</SLink>
      <SLink to="/forgot-password">パスワードを忘れた場合</SLink>
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
  background-color: white;
  color: #444444;
  border: 1px solid #444444;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444444;
    color: white;
  }
`;

const SLink = styled(Link)`
  color: rgb(29, 31, 34);
  margin-bottom: 16px;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;
