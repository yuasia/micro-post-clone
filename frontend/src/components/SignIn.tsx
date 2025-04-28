import { useContext, useState } from "react";
import { sign_in } from "../api/Auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";

const SignIn = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [pass, setPass] = useState("");

  const { setUserInfo } = useContext(UserContext);

  const onSignInClick = async () => {
    const ret = await sign_in(userId, pass);
    if (ret && ret.token) {
      setUserInfo({
        id: ret.user_id,
        token: ret.token,
      });
      navigate("/main");
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="id">ID</label>
        <input
          id="id"
          value={userId}
          type="text"
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          value={pass}
          type="text"
          onChange={(e) => setPass(e.target.value)}
        />
      </div>
      <div>
        <button type="button" onClick={onSignInClick}>
          Login
        </button>
      </div>
    </div>
  );
};

export default SignIn;
