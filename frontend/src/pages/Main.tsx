import MainLayout from "../components/MainLayout";
import { PostListProvider } from "../providers/PostListProvider";

const Main = () => {
  return (
    <PostListProvider>
      <MainLayout />
    </PostListProvider>
  );
};

export default Main;
