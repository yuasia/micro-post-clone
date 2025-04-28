import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";

const SideBar = () => {
  const [msg, setMsg] = useState("");

  const { userInfo } = useContext(UserContext);

  const onSendClick = () => {
    console.log("onSendClick");
    console.log(userInfo);
  };

  return (
    <div>
      <div>hoge</div>
      <div>hoge@example.com</div>
      <div>
        <textarea
          rows={4}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></textarea>
      </div>
      <div>
        <button onClick={onSendClick}>送信</button>
      </div>
    </div>
  );
};

export default SideBar;
