import { useState } from "react";
import { requestPasswordReset } from "../api/Auth";

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
    <div>
      <h2>パスワード再設定</h2>
      <input
        type="email"
        placeholder="メールアドレスを入力してください"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleResetRequest}>送信</button>
    </div>
  );
};

export default ForgotPassword;
