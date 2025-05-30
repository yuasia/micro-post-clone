import { useEffect, useState } from "react";
import { resetPassword } from "../api/Auth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get("token");

  const handleReset = async () => {
    if (password !== confirmPassword) {
      alert("パスワードが一致しません。");
      return;
    }

    try {
      await resetPassword(token as string, password);
      alert("パスワードが再設定されました。ログインしてください。");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      alert(
        `エラーが発生しました: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <RPContainer>
      <RPTitle>新しいパスワードを設定</RPTitle>
      <RPInputGroup>
        <RPInput
          type="password"
          placeholder="新しいパスワードを入力してください"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <RPInput
          type="password"
          placeholder="パスワードを再入力してください"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </RPInputGroup>
      <RPButton onClick={handleReset}>再設定</RPButton>
    </RPContainer>
  );
};

export default ResetPassword;

const RPContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 20px;
`;

const RPTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-top: 100px;
`;

const RPInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 20px 0;
`;

const RPInput = styled.input`
  width: 80%;
  height: 25px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  text-align: center;

  &:focus {
    border-color: #4a90e2;
    outline: none;
  }
`;

const RPButton = styled.button`
  background: white;
  color: #444444;
  border: 1px solid #444444;
  border-radius: 10px;
  padding: 9px 18px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #444444;
    color: white;
  }
`;
