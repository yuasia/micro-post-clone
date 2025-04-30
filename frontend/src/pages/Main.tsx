import { useContext } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { UserContext } from "../providers/UserProvider";
import { PostListProvider } from "../providers/PostListProvider";

const Main = () => {
  const { userInfo } = useContext(UserContext);
  const loggedIn = userInfo.token !== "";

  return (
    <PostListProvider>
      {loggedIn ? <MainLayout /> : <Navigate replace to="/" />}
    </PostListProvider>
  );
};

export default Main;
