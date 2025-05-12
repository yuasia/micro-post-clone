import { useContext, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { UserContext } from "../providers/UserProvider";
import { PostListProvider } from "../providers/PostListProvider";
import { SearchProvider } from "../providers/SearchProvider";

const Main = () => {
  const { userInfo, isInitialized } = useContext(UserContext);
  const loggedIn = userInfo.token !== "";

  if (!isInitialized) return <div>Loading...</div>;

  if (!userInfo.token) return <Navigate to="/" />;

  return (
    <PostListProvider>
      <SearchProvider>
        <MainLayout />
      </SearchProvider>
    </PostListProvider>
  );
};

export default Main;
