import { useEffect, useState } from "react";
import { resetPassword } from "../api/Auth";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
    <div>
      <h2>新しいパスワード</h2>
      <input
        type="password"
        placeholder="新しいパスワードを入力してください"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワードを再入力してください"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleReset}>再設定</button>
    </div>
  );
};

export default ResetPassword;
