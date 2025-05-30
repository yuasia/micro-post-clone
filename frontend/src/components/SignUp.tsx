import { useState } from "react";
import styled from "styled-components";
import { createUser } from "../api/User";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const onRegister = async () => {
    if (!name || !email || !pass) {
      alert("すべてのフィールドを入力してください");
      return;
    }

    const res = await createUser(name, email, pass);
    if (res?.success) {
      alert(res.message);
      setName("");
      setEmail("");
      setPass("");
      navigate("/");
    } else {
      alert("登録に失敗しました");
      setName("");
      setEmail("");
      setPass("");
    }
  };

  return (
    <SContainer>
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
      <SCard>
        <h2>Sign Up</h2>
        <SInputForm>
          <SInput
            type="text"
            placeholder="user name"
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

        <SRButton onClick={onRegister}>登録</SRButton>
      </SCard>
    </SContainer>
  );
};

export default SignUp;

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
  padding: 9px;
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
