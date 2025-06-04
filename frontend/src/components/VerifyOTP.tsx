import { verifyOTP } from "../api/Auth";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      } else {
        alert("OTP verification failed");
      }
    } else {
      alert("6桁のコードを入力してください");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>2段階認証コードを入力</h2>
      <SVOTPFrame>
        {otp.map((digit, index) => (
          <SVOTPInput
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
      </SVOTPFrame>
      <SButton onClick={handleSubmit}>認証</SButton>
    </div>
  );
};

export default VerifyOTP;

const SVOTPFrame = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 30px auto;
`;

const SVOTPInput = styled.input`
  width: 40px;
  height: 40px;
  font-size: 24px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const SButton = styled.button`
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
