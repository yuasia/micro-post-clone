import { Dispatch, useEffect, useState } from "react";
import { createContext } from "react";

type UserInfo = {
  id: number;
  token: string;
  name: string;
  email: string;
  avatar_url: string;
};

export const UserContext = createContext(
  {} as {
    userInfo: UserInfo;
    setUserInfo: Dispatch<React.SetStateAction<UserInfo>>;
    isInitialized: boolean;
  }
);

export const UserProvider = (props: any) => {
  const { children } = props;
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 0,
    token: "",
    name: "",
    email: "",
    avatar_url: "",
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("user_id");
    const name = localStorage.getItem("user_name");
    const email = localStorage.getItem("user_email");
    const avatar_url = localStorage.getItem("user_avatar");

    if (token && id) {
      setUserInfo({
        id: parseInt(id, 10),
        token: token,
        name: name || "",
        email: email || "",
        avatar_url: avatar_url || "",
      });
    }

    setIsInitialized(true);
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, isInitialized }}>
      {children}
    </UserContext.Provider>
  );
};
