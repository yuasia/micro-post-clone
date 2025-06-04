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
    <SUContainer>
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
      <SUCard>
        <SUTitle>Sign Up</SUTitle>
        <SUInputForm>
          <SUInput
            type="text"
            placeholder="user name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <SUInput
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SUInput
            type="text"
            placeholder="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </SUInputForm>

        <SUButton onClick={onRegister}>登録</SUButton>
      </SUCard>
    </SUContainer>
  );
};

export default SignUp;

const SUContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 20px;
  position: relative;
`;

const SUCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  height: 400px;
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const SUTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 24px;
  color: #444444;
  &::after {
    content: "";
    display: block;
    width: 40px;
    height: 3px;
    background-color: #444444;
    margin: 8px auto 0;
    border-radius: 2px;
  }
`;

const SUInputForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const SUInput = styled.input`
  padding: 10px 20px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 18px;
  font-size: 15px;
  transition: all 0.2s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    outline: none;
  }
`;

const SUButton = styled.button`
  background: white;
  color: #444444;
  border: 1px solid #444444;
  border-radius: 10px;
  padding: 6px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #444444;
    color: white;
  }
`;
