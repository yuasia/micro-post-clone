import { useState } from "react";
import { requestPasswordReset } from "../api/Auth";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetRequest = async () => {
    try {
      await requestPasswordReset(email);
      alert(
        "パスワードリセットのリクエストが送信されました。メールを確認してください。"
      );
    } catch (err) {
      console.error("パスワードリセットのリクエストに失敗しました:", err);
    }
  };

  return (
    <FPContainer>
      <Link to={"/main"}>
        {" "}
        <X
          style={{
            position: "absolute",
            top: 22,
            right: 22,
            color: "black",
            cursor: "pointer",
          }}
          size={40}
        />
      </Link>
      <FPTitle>パスワード再設定</FPTitle>
      <FPDescription>
        パスワードを忘れた場合は、以下に登録済みのメールアドレスを入力してください。
      </FPDescription>
      <FPInput
        type="email"
        placeholder="メールアドレスを入力してください"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FPButton onClick={handleResetRequest}>送信</FPButton>
    </FPContainer>
  );
};

export default ForgotPassword;

const FPContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f9f9f9;
`;

const FPTitle = styled.h2`
  font-size: 24px;
  color: #333333;
  margin-top: 100px;
`;

const FPDescription = styled.p`
  font-size: 16px;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
`;

const FPInput = styled.input`
  width: 400px;
  height: 25px;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
  text-align: center;
  transition: border-color 0.3s ease, box-shadow 0.3s eas;

  &focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  margin-bottom: 20px;
`;

const FPButton = styled.button`
  background: white;
  color: #444444;
  border: 1px solid #444444;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #444444;
    color: white;
  }
`;
