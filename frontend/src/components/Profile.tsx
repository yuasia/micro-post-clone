import axios from "axios";
import styled from "styled-components";
import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";

const Profile = () => {
  const { userInfo } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const onUpdate = async () => {
    const payload: any = { token: userInfo.token };
    if (name.trim()) payload.name = name;
    if (email.trim()) payload.email = email;
    if (password.trim()) {
      payload.currentPassword = currentPassword;
      payload.password = password;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/user/update",
        payload
      );
      alert("ユーザー情報を更新しました");
    } catch (err) {
      console.error("更新失敗", err);
      alert("ユーザー情報の更新に失敗しました");
    }
  };

  return (
    <SContainer>
      <SCard>
        <h2>ユーザー情報変更</h2>
        <SInputGroup>
          <SInput
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <SInput
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SInput
            type="text"
            placeholder="current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <SInput
            type="text"
            placeholder="new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </SInputGroup>

        <SRButton onClick={onUpdate}>変更</SRButton>
      </SCard>
    </SContainer>
  );
};

export default Profile;

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const SCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 500px;
  width: 100%;
  max-width: 500px;
  gap: 30px;
`;

const SInputGroup = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: white;
  width: 100%;
  gap: 20px;
`;

const SInput = styled.input`
  width: 60%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6666ff;
  }
`;

const SButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  background: black;
  width: 100%;
`;

const SRButton = styled.button`
  width: 25%;
  height: 40px;
  background: white;
  border: 1px solid #444444;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #444444;
  transition: background 0.3s;

  &:hover {
    background: #444444;
    color: white;
  }
`;
