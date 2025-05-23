import { useContext } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { UserContext } from "../providers/UserProvider";
import { SearchProvider } from "../providers/SearchProvider";
import { PostListProvider } from "../providers/PostListProvider";

const Main = () => {
  const { userInfo, isInitialized } = useContext(UserContext);

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
