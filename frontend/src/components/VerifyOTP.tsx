import { verifyOTP } from "../api/Auth";
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import styled from "styled-components";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // 数字のみ許可

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("temp_user_id");
    const otpString = otp.join("");

    try {
      if (userId && otpString.length === 6) {
        const res = await verifyOTP(parseInt(userId, 10), otpString);

        if (res && res.token) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("user_id", res.user_id);
          localStorage.setItem("user_name", res.user_name);
          localStorage.setItem("user_email", res.user_email);
          localStorage.setItem("user_avatar", res.avatar_url);
          localStorage.removeItem("temp_user_id");

          setUserInfo({
            ...userInfo,
            id: res.user_id,
            token: res.token,
          });
          navigate("/main");
        }
      }
    } catch (error) {}
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>2段階認証コードを入力</h2>
      <VFrame>
        {otp.map((digit, index) => (
          <VInput
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
          />
        ))}
      </VFrame>
      <VButton onClick={handleSubmit}>認証</VButton>
      <VDescription>
        <p>OTPコードが届かない場合は、メールアドレスを確認してください。</p>
        <VLink to="/">ログイン画面に戻る</VLink>
      </VDescription>
    </div>
  );
};

export default VerifyOTP;

const VFrame = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 30px auto;
`;

const VInput = styled.input`
  width: 40px;
  height: 40px;
  font-size: 24px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const VButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: white;
  color: #444444;
  border: 1px solid #444444;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444444;
    color: white;
  }
`;

const VDescription = styled.div`
  margin-top: 40px;
  font-size: 14px;
  text-align: center;
`;

const VLink = styled(Link)`
  color: #3498db;
  margin-bottom: 16px;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;
