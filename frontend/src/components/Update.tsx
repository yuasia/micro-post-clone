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
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { userInfo, setUserInfo } = useContext(UserContext);

  const onUpdate = async () => {
    const payload: any = { token: userInfo.token };
    if (name.trim()) payload.name = name;
    if (email.trim()) payload.email = email;
    if (avatarUrl.trim()) payload.avatar_url = avatarUrl;

    // パスワード変更をリクエストしている場合のバリデーション
    if (newPassword.trim()) {
      if (!currentPassword.trim()) {
        setPasswordError("現在のパスワードを入力してください");
        return;
      }
      payload.currentPassword = currentPassword;
      payload.password = newPassword;
    }

    try {
      await axios.post(
        "http://localhost:3001/user/update",
        payload
      );
      alert("ユーザー情報を更新しました");

      const updated = { ...userInfo };
      if (name.trim()) {
        updated.name = name;
        localStorage.setItem("user_name", name);
      }
      if (email.trim()) {
        updated.email = email;
        localStorage.setItem("user_email", email);
      }
      if (avatarUrl.trim()) {
        updated.avatar_url = avatarUrl;
        localStorage.setItem("user_avatar", avatarUrl);
      }
      setUserInfo(updated);

      // 成功したらフィールドをクリア
      if (newPassword) {
        setNewPassword("");
        setCurrentPassword("");
        setShowPasswordSection(false);
      }
      setPasswordError("");
    } catch (err: any) {
      console.error("更新失敗", err);
      if (err.response?.data?.message?.includes("password")) {
        setPasswordError("現在のパスワードが正しくありません");
      } else {
        alert("ユーザー情報の更新に失敗しました");
      }
    }
  };

  return (
    <>
      <Link to={"/main"}>
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
          <STitle>ユーザー情報変更</STitle>
          <UploadWidget setAvatarUrl={setAvatarUrl} />

          <SSection>
            <SSectionTitle>基本情報</SSectionTitle>
            <SInputGroup>
              <SInputWithLabel>
                <SLabel>user name</SLabel>
                <SInput
                  type="text"
                  placeholder="変更する名前を入力"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </SInputWithLabel>

              <SInputWithLabel>
                <SLabel>mail address</SLabel>
                <SInput
                  type="text"
                  placeholder="変更するメールアドレスを入力"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </SInputWithLabel>
            </SInputGroup>
          </SSection>

          <SSection>
            <SSectionTitle>パスワード変更</SSectionTitle>
            {!showPasswordSection ? (
              <SToggleButton onClick={() => setShowPasswordSection(true)}>
                パスワードを変更する
              </SToggleButton>
            ) : (
              <>
                <SInputGroup>
                  <SInputWithLabel>
                    <SLabel>
                      現在のパスワード<SRequired>*</SRequired>
                    </SLabel>
                    <SInput
                      type="password"
                      placeholder="現在のパスワードを入力"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setPasswordError("");
                      }}
                    />
                  </SInputWithLabel>

                  <SInputWithLabel>
                    <SLabel>
                      新しいパスワード<SRequired>*</SRequired>
                    </SLabel>
                    <SInput
                      type="password"
                      placeholder="新しいパスワードを入力"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </SInputWithLabel>

                  {passwordError && (
                    <SErrorMessage>{passwordError}</SErrorMessage>
                  )}

                  <SButtonGroup>
                    <SCancelButton
                      onClick={() => {
                        setShowPasswordSection(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setPasswordError("");
                      }}
                    >
                      キャンセル
                    </SCancelButton>
                  </SButtonGroup>
                </SInputGroup>
              </>
            )}
          </SSection>

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
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: auto;
  min-height: 600px;
  width: 100%;
  max-width: 500px;
  gap: 20px;
  overflow-y: auto;
`;

const STitle = styled.h2`
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
`;

const SSection = styled.div`
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const SSectionTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
`;

const SInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
`;

const SInputWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SLabel = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
`;

const SRequired = styled.span`
  color: #ff4757;
  margin-left: 4px;
`;

const SInput = styled.input`
  width: 90%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6666ff;
    box-shadow: 0 0 0 2px rgba(102, 102, 255, 0.1);
  }
`;

const SErrorMessage = styled.p`
  color: #ff4757;
  font-size: 14px;
  margin: 5px 0 0 0;
`;

const SButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
`;

const SToggleButton = styled.button`
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }
`;

const SCancelButton = styled.button`
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #f0f0f0;
  }
`;

const SRButton = styled.button`
  width: auto;
  min-width: 150px;
  height: 40px;
  background: white;
  border: 1px solid #444444;
  border-radius: 8px;
  padding: 0 20px;
  text-align: center;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  color: #444444;
  transition: background 0.3s;
  margin-top: 10px;

  &:hover {
    background: #444444;
    color: white;
  }
`;
