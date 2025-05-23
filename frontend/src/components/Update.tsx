import axios from "axios";
import { X } from "lucide-react";
import styled from "styled-components";
import UploadWidget from "./UploadWidget";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";

const Update = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [ShowPasswordFiled, setShowPasswordField] = useState(false);

  const { userInfo } = useContext(UserContext);

  const togglePasswordField = () => {
    setShowPasswordField(!ShowPasswordFiled);
    setCurrentPassword("");
    setNewPassword("");
  };

  const onUpdate = async () => {
    const payload: any = { token: userInfo.token };
    if (name.trim()) payload.name = name;
    if (email.trim()) payload.email = email;
    if (avatarUrl.trim()) payload.avatar_url = avatarUrl;
    if (newPassword.trim()) {
      payload.currentPassword = currentPassword;
      payload.password = newPassword;
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
    <>
      <Link to={"/main"}>
        {" "}
        <X
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            color: "black",
            cursor: "pointer",
          }}
          size={40}
        />
      </Link>
      <SContainer>
        <SCard>
          <h2>ユーザー情報変更</h2>
          <UploadWidget setAvatarUrl={setAvatarUrl} />
          <SToggleButton onClick={togglePasswordField}>
            パスワードを変更
          </SToggleButton>
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

            {ShowPasswordFiled && (
              <div>
                <div>現在のパスワード</div>
                <SInput
                  type="text"
                  placeholder="current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div>新しいパスワード</div>
                <SInput
                  type="text"
                  placeholder="new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            )}
          </SInputGroup>

          <SRButton onClick={onUpdate}>変更を適用</SRButton>
        </SCard>
      </SContainer>
    </>
  );
};

export default Update;

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
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 600px;
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
  gap: 30px;
`;

const SInput = styled.input`
  width: 50%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6666ff;
  }
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

const SToggleButton = styled.button`
  width: 50%;
  height: 60px;
  background: white;
  border: 1px solid #444444;
  border-radius: 10px;
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
