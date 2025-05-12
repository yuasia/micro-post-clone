import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <SContainer>
      <SCard>
        <h2>ユーザー情報</h2>
        <SInputForm>
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
            placeholder="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </SInputForm>

        <SRButton>変更</SRButton>
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
  height: 400px;
  width: 100%;
  max-width: 500px;
  gap: 30px;
`;

const SInputForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
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
  padding: 10px;
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
