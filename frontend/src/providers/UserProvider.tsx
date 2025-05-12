import { Dispatch, useEffect, useState } from "react";
import { createContext } from "react";

type UserInfo = {
  id: number;
  token: string;
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
  const [userInfo, setUserInfo] = useState<UserInfo>({ id: 0, token: "" });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("user_id");

    if (token && id) {
      setUserInfo({
        id: parseInt(id, 10),
        token: token,
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
