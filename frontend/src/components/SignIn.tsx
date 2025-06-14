import { useState } from "react";
import styled from "styled-components";
import { login } from "../api/Auth";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "./Toast";

const SignIn = () => {
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const onSignInClick = async () => {
    try {
      setIsLoading(true);
      const ret = await login(email, pass);

      if (ret.data.require_otp) {
        localStorage.setItem("temp_user_id", ret.data.user_id);
        navigate("/verify_otp");
      }
    } catch (error) {
      console.error("Login failed: ", error);

      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "ログインに失敗しました";
        setToast({ show: true, message: errorMsg });
      } else {
        setToast({
          show: true,
          message: "予期しないエラーが発生しました。もう一度お試しください。",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ show: false, message: "" })}
        />
      )}
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
          <SSignInLabel htmlFor="pwd">password</SSignInLabel>
          <SSignInInput
            id="pwd"
            value={pass}
            type="password"
            onChange={(e) => setPass(e.target.value)}
          />
        </SSignInRow>
        <SSignInRow>
          <SLoginButton
            type="button"
            onClick={onSignInClick}
            disabled={isLoading}
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </SLoginButton>
        </SSignInRow>
        <SLink to="/signup">アカウントをお持ちでない場合</SLink>
        <SLink to="/forgot-password">パスワードを忘れた場合</SLink>
      </SSignInFrame>
    </>
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

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    border-color: #999999;
    cursor: not-allowed;
  }
`;

const SLink = styled(Link)`
  color: #3498db;
  margin-bottom: 16px;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const SErrorMessage = styled.div`
  color: #e74c3c
  background-color: #fdecea;
  border-left; 4px solid #e74c3c
  padding; 12px 16px;
  margin: 15px 0;
  border-radius: 4px;
  font-size: 4px;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0; transform: translateY(-10px);}}
    to {
      opacity: 1; transform: translateY(0);}}
  `;
