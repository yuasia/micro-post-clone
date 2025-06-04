import axios from "axios";
import { X } from "lucide-react";
import styled from "styled-components";
import UploadWidget from "./UploadWidget";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import { deleteUser } from "../api/User";

const Update = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

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
      const res = await axios.post(
        "http://localhost:3001/user/update",
        payload
      );
      alert("ユーザー情報を更新しました");
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

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert("パスワードを入力してください");
    }

    try {
      await deleteUser(userInfo.token, deletePassword);
      alert("アカウントを削除しました");

      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("avatar_url");
      navigate("/");
    } catch (err: any) {
      console.error("削除失敗", err);
      if (err.response?.data?.message?.includes("password")) {
        alert("パスワードが正しくありません");
      } else {
        alert("アカウントの削除に失敗しました");
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
        <SDeleteSection>
          <SDeleteButton onClick={() => setShowDeleteConfirm(true)}>
            アカウントを削除する
          </SDeleteButton>
        </SDeleteSection>

        {showDeleteConfirm && (
          <SOverlay>
            <SDialog>
              <SDialogTitle>
                <SDialogContent>
                  <p>
                    アカウントを削除すると、すべてのデータが完全に削除され、復元できなくなります。
                  </p>
                  <SWarning>この操作は取り消せません</SWarning>

                  <SInputWithLabel>
                    <SLabel>
                      パスワードを入力して確認<SRequired></SRequired>
                    </SLabel>
                    <SInput
                      type="password"
                      placeholder="パスワードを入力"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                    />
                  </SInputWithLabel>

                  <SDialogButtonGroup>
                    <SCancelButton
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword("");
                      }}
                    >
                      キャンセル
                    </SCancelButton>
                    <SDeleteConfirmButton onClick={handleDeleteAccount}>
                      削除を確定
                    </SDeleteConfirmButton>
                  </SDialogButtonGroup>
                </SDialogContent>
              </SDialogTitle>
            </SDialog>
          </SOverlay>
        )}
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
  border-radius: 12px;
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

const SDeleteSection = styled.div`
  display: flex;
  flex-direction: column:
  align-items: center;
  margin-top: 30px;
  width: 100%
  max-width: 500px;`;

const SDeleteButton = styled.button`
  background: transparent;
  border: 1px solid #ff4757;
  color: #ff4757;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &: hover {
    background: #fff1f2;
    box-shadow: 0 2px 4px rgba(255, 71, 87, 0.1);
  }
`;

const SOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const SDialog = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out forwards;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const SDialogTitle = styled.div`
  margin: 0 0 16px 0;
  color: #ff4757;
  font-size: 20px;
  font-weight: 600;
`;

const SDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SWarning = styled.div`
  background: #fff1f2;
  border-left: 4px solid #ff4757;
  padding: 12px;
  color: #ff4757;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
`;

const SDialogButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const SDeleteConfirmButton = styled.button`
  background: #ff4757;
  color: white;
  border: none; // セミコロンを追加
  border-radius: 8px; // 他のボタンと一貫性を持たせるため8pxに変更
  padding: 10px 16px;
  font-size: 14px; // フォントサイズ追加
  font-weight: 500; // フォントウェイト追加
  cursor: pointer;
  transition: all 0.2s ease; // transitionプロパティを拡張

  &:hover {
    background: #ff2e43;
    box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3);
  }

  &:active {
    transform: translateY(1px); // クリック時の押し込み効果
  }
`;
